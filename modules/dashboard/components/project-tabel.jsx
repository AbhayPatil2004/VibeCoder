"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  Download,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { MarkedToggleButton } from "./marked-toggle";

export default function ProjectTable({
  projects,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditData({
      title: project.title,
      description: project.description || "",
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!selectedProject || !onUpdateProject) return;

    setIsLoading(true);
    try {
      await onUpdateProject(selectedProject.id, editData);
      setEditDialogOpen(false);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !onDeleteProject) return;

    setIsLoading(true);
    try {
      await onDeleteProject(selectedProject.id);
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateProject = async (project) => {
    if (!onDuplicateProject) return;

    setIsLoading(true);
    try {
      await onDuplicateProject(project.id);
      toast.success("Project duplicated successfully");
    } catch (error) {
      toast.error("Failed to duplicate project");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyProjectUrl = (projectId) => {
    const url = `${window.location.origin}/playground/${projectId}`;
    navigator.clipboard.writeText(url);
    toast.success("Project url copied to clipboard");
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link href={`/playground/${project.id}`} className="font-semibold hover:underline">
                    {project.title}
                  </Link>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {project.description}
                  </p>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">{project.template}</Badge>
                </TableCell>

                <TableCell className="text-sm text-gray-500">
                  {format(new Date(project.createdAt), "MMM dd, yyyy")}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={project.user.image || "/placeholder.svg"}
                      alt={project.user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span>{project.user.name}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <MarkedToggleButton
                          markedForRevision={project.Starmark?.[0]?.isMarked}
                          id={project.id}
                        />
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href={`/playground/${project.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Open
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => handleEditClick(project)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => handleDuplicateProject(project)}>
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => copyProjectUrl(project.id)}>
                        <Download className="mr-2 h-4 w-4" /> Copy URL
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteClick(project)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* EDIT DIALOG */}
<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Project</DialogTitle>
      <DialogDescription>
        Update your project details
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={editData.title}
          onChange={(e) =>
            setEditData({ ...editData, title: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={editData.description}
          onChange={(e) =>
            setEditData({ ...editData, description: e.target.value })
          }
        />
      </div>
    </div>

    <DialogFooter>
      <Button
        onClick={handleUpdateProject}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* DELETE DIALOG */}
<AlertDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Delete Project?
      </AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDeleteProject}
        disabled={isLoading}
        className="bg-destructive"
      >
        {isLoading ? "Deleting..." : "Delete"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

      </div>
    </>
  );
}
