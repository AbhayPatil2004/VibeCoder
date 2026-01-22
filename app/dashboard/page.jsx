import React from 'react'
import AddNewButton from '../../modules/dashboard/components/add-new'
import AddRepo from '../../modules/dashboard/components/add-repo'
import { getAllPlayground } from '../../modules/dashboard/actions/index.js'
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectTable from "../../modules/dashboard/components/project-tabel.jsx";

async function DashboardPage() {

    const playgrounds = await getAllPlayground()
    return (
        <div
            className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <AddNewButton />
                <AddRepo />
            </div>

            <div className="mt-10 flex flex-col justify-center items-center w-full">
                {playgrounds && playgrounds.length === 0 ? (
                    <EmptyState />
                ) : (
                    <ProjectTable
                        projects={playgrounds || []}
                        onDeleteProject={()=>{}}
                        onUpdateProject={()=>{}}
                        onDuplicateProject={()=>{}}
                    />
                )}
            </div>
        </div>
    )
}

export default DashboardPage