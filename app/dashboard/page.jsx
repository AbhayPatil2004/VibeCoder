import React from "react";
import AddNewButton from "../../modules/dashboard/components/add-new";
import AddRepo from "../../modules/dashboard/components/add-repo";
import {
  getAllPlayground,
  deleteProjectById,
  editProjectById,
  duplicateProjectById,
} from "../../modules/dashboard/actions";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectTable from "../../modules/dashboard/components/project-tabel.jsx";

export default async function DashboardPage() {
  const playgrounds = await getAllPlayground();

  // ✅ SERVER ACTION WRAPPERS (IMPORTANT)
  async function handleDeleteProject(id) {
    "use server";
    await deleteProjectById(id);
  }

  async function handleUpdateProject(id, data) {
    "use server";
    await editProjectById(id, data);
  }

  async function handleDuplicateProject(id) {
    "use server";
    await duplicateProjectById(id);
  }

  return (
    <div className="flex flex-col items-start min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepo />
      </div>

      <div className="mt-10 w-full">
        {playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          <ProjectTable
            projects={playgrounds}
            onDeleteProject={handleDeleteProject}
            onUpdateProject={handleUpdateProject}
            onDuplicateProject={handleDuplicateProject}
          />
        )}
      </div>
    </div>
  );
}
