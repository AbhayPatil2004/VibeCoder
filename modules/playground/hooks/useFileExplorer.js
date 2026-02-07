import { create } from "zustand";
import { toast } from "sonner";

import { generateFileId } from "../lib";

// @ts-ignore
export const useFileExplorer = create((set, get) => ({
  templateData: null,
  playgroundId: "",
  openFiles: [],
  activeFileId: null,
  editorContent: "",

  /* ---------------- setters ---------------- */

  setTemplateData: (data) => set({ templateData: data }),
  setPlaygroundId: (id) => set({ playgroundId: id }),
  setEditorContent: (content) => set({ editorContent: content }),
  setOpenFiles: (files) => set({ openFiles: files }),
  setActiveFileId: (fileId) => set({ activeFileId: fileId }),

  /* ---------------- file handling ---------------- */

  openFile: (file) => {
    const templateData = get().templateData;
    if (!templateData) return;

    const fileId = generateFileId(file, templateData);
    const { openFiles } = get();
    const existingFile = openFiles.find((f) => f.id === fileId);

    if (existingFile) {
      set({
        activeFileId: fileId,
        editorContent: existingFile.content,
      });
      return;
    }

    const newOpenFile = {
      ...file,
      id: fileId,
      hasUnsavedChanges: false,
      content: file.content || "",
      originalContent: file.content || "",
    };

    set((state) => ({
      openFiles: [...state.openFiles, newOpenFile],
      activeFileId: fileId,
      editorContent: newOpenFile.content,
    }));
  },

  closeFile: (fileId) => {
    const { openFiles, activeFileId, editorContent } = get();
    const newFiles = openFiles.filter((f) => f.id !== fileId);

    let newActiveFileId = activeFileId;
    let newEditorContent = editorContent;

    if (activeFileId === fileId) {
      if (newFiles.length > 0) {
        const lastFile = newFiles[newFiles.length - 1];
        newActiveFileId = lastFile.id;
        newEditorContent = lastFile.content;
      } else {
        newActiveFileId = null;
        newEditorContent = "";
      }
    }

    set({
      openFiles: newFiles,
      activeFileId: newActiveFileId,
      editorContent: newEditorContent,
    });
  },

  closeAllFiles: () => {
    set({
      openFiles: [],
      activeFileId: null,
      editorContent: "",
    });
  },

  /* ---------------- add file ---------------- */

  handleAddFile: async (
    newFile,
    parentPath,
    writeFileSync,
    instance,
    saveTemplateData
  ) => {
    const { templateData } = get();
    if (!templateData) return;

    try {
      const updatedTemplateData = JSON.parse(JSON.stringify(templateData));
      const pathParts = parentPath.split("/");
      let currentFolder = updatedTemplateData;

      for (const part of pathParts) {
        if (!part) continue;
        const next = currentFolder.items.find(
          (i) => i.folderName === part
        );
        if (next) currentFolder = next;
      }

      currentFolder.items.push(newFile);
      set({ templateData: updatedTemplateData });

      await saveTemplateData(updatedTemplateData);

      if (writeFileSync) {
        const filePath = parentPath
          ? `${parentPath}/${newFile.filename}.${newFile.fileExtension}`
          : `${newFile.filename}.${newFile.fileExtension}`;

        await writeFileSync(filePath, newFile.content || "");
      }

      toast.success(`Created file: ${newFile.filename}.${newFile.fileExtension}`);
      get().openFile(newFile);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create file");
    }
  },

  /* ---------------- add folder ---------------- */

  handleAddFolder: async (
    newFolder,
    parentPath,
    instance,
    saveTemplateData
  ) => {
    const { templateData } = get();
    if (!templateData) return;

    try {
      const updatedTemplateData = JSON.parse(JSON.stringify(templateData));
      const pathParts = parentPath.split("/");
      let currentFolder = updatedTemplateData;

      for (const part of pathParts) {
        if (!part) continue;
        const next = currentFolder.items.find(
          (i) => i.folderName === part
        );
        if (next) currentFolder = next;
      }

      currentFolder.items.push(newFolder);
      set({ templateData: updatedTemplateData });

      await saveTemplateData(updatedTemplateData);

      if (instance?.fs) {
        const folderPath = parentPath
          ? `${parentPath}/${newFolder.folderName}`
          : newFolder.folderName;
        await instance.fs.mkdir(folderPath, { recursive: true });
      }

      toast.success(`Created folder: ${newFolder.folderName}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create folder");
    }
  },

  /* ---------------- update content ---------------- */

  updateFileContent: (fileId, content) => {
    set((state) => ({
      openFiles: state.openFiles.map((file) =>
        file.id === fileId
          ? {
              ...file,
              content,
              hasUnsavedChanges: content !== file.originalContent,
            }
          : file
      ),
      editorContent:
        fileId === state.activeFileId ? content : state.editorContent,
    }));
  },
}));
