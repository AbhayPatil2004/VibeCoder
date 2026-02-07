"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import LoadingStep from "@/modules/playground/components/loader";
import { PlaygroundEditor } from "@/modules/playground/components/playground-editor";
import { TemplateFileTree } from "@/modules/playground/components/playground-explorer";
import { useFileExplorer } from "@/modules/playground/hooks/useFileExplorer";
import { usePlayground } from "@/modules/playground/hooks/usePlayground";
import { findFilePath } from "@/modules/playground/lib";
import WebContainerPreview from "@/modules/webcontainers/components/webcontainer-preview";
import { useWebContainer } from "@/modules/webcontainers/hooks/useWebContainer";
import {
  AlertCircle,
  FolderOpen,
  Save,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const MainPlaygroundPage = () => {
  const { id } = useParams();
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const { templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);

  const {
    setTemplateData,
    setPlaygroundId,
    setOpenFiles,
    activeFileId,
    openFile,
    openFiles,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    updateFileContent,
  } = useFileExplorer();

  const {
    serverUrl,
    isLoading: containerLoading,
    error: containerError,
    instance,
    writeFileSync,
  } = useWebContainer({ templateData });

  const lastSyncedContent = useRef(new Map());

  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  const wrappedHandleAddFile = useCallback(
    (newFile, parentPath) =>
      handleAddFile(
        newFile,
        parentPath,
        writeFileSync,
        instance,
        saveTemplateData
      ),
    [handleAddFile, writeFileSync, instance, saveTemplateData]
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder, parentPath) =>
      handleAddFolder(newFolder, parentPath, instance, saveTemplateData),
    [handleAddFolder, instance, saveTemplateData]
  );

  const wrappedHandleDeleteFile = useCallback(
    (file, parentPath) =>
      handleDeleteFile(file, parentPath, saveTemplateData),
    [handleDeleteFile, saveTemplateData]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder, parentPath) =>
      handleDeleteFolder(folder, parentPath, saveTemplateData),
    [handleDeleteFolder, saveTemplateData]
  );

  const wrappedHandleRenameFile = useCallback(
    (file, newFilename, newExtension, parentPath) =>
      handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData
      ),
    [handleRenameFile, saveTemplateData]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder, newFolderName, parentPath) =>
      handleRenameFolder(folder, newFolderName, parentPath, saveTemplateData),
    [handleRenameFolder, saveTemplateData]
  );

  const activeFile = openFiles.find((f) => f.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((f) => f.hasUnsavedChanges);

  const handleFileSelect = (file) => openFile(file);

  const handleSave = useCallback(
    async (fileId) => {
      const targetFileId = fileId || activeFileId;
      if (!targetFileId) return;

      const fileToSave = openFiles.find((f) => f.id === targetFileId);
      if (!fileToSave) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return;

      try {
        const filePath = findFilePath(fileToSave, latestTemplateData);
        if (!filePath) {
          toast.error("File path not found");
          return;
        }

        if (writeFileSync) {
          await writeFileSync(filePath, fileToSave.content);
          lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
        }

        const newTemplateData = await saveTemplateData(latestTemplateData);
        setTemplateData(newTemplateData || latestTemplateData);

        setOpenFiles(
          openFiles.map((f) =>
            f.id === targetFileId
              ? { ...f, hasUnsavedChanges: false }
              : f
          )
        );

        toast.success(`Saved ${fileToSave.filename}`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to save file");
      }
    },
    [
      activeFileId,
      openFiles,
      writeFileSync,
      saveTemplateData,
      setTemplateData,
      setOpenFiles,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) return <LoadingStep />;

  if (!templateData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FolderOpen className="h-12 w-12 text-yellow-500" />
        <p>No template data</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <TemplateFileTree
        data={templateData}
        onFileSelect={handleFileSelect}
        selectedFile={activeFile}
        onAddFile={wrappedHandleAddFile}
        onAddFolder={wrappedHandleAddFolder}
        onDeleteFile={wrappedHandleDeleteFile}
        onDeleteFolder={wrappedHandleDeleteFolder}
        onRenameFile={wrappedHandleRenameFile}
        onRenameFolder={wrappedHandleRenameFolder}
      />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Button onClick={() => handleSave()} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4" />
          </Button>
        </header>

        <PlaygroundEditor
          activeFile={activeFile}
          content={activeFile?.content || ""}
          onContentChange={(value) =>
            activeFileId && updateFileContent(activeFileId, value)
          }
        />

        {isPreviewVisible && (
          <WebContainerPreview
            templateData={templateData}
            instance={instance}
            writeFileSync={writeFileSync}
            isLoading={containerLoading}
            error={containerError}
            serverUrl={serverUrl}
          />
        )}
      </SidebarInset>
    </TooltipProvider>
  );
};

export default MainPlaygroundPage;
