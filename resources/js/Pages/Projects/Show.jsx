import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KanbanBoard from '@/Components/Projects/KanbanBoard';
import AddTaskDialog from '@/Components/Projects/AddTaskDialog';

export default function ProjectShow({ project, projects }) {
    return (
        <AuthenticatedLayout
            header={{ title: project.name }}
            projects={projects}
        >
            <Head title={project.name} />
            
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{project.name}</h2>
                    <AddTaskDialog projectId={project.id} users={project.assignees} />
                </div>
                
                <KanbanBoard tasks={project.tasks} />
            </div>
        </AuthenticatedLayout>
    );
} 