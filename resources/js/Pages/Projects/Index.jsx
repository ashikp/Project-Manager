import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import AddProjectDialog from '@/Components/Projects/AddProjectDialog';
import { Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Star as StarFilled, Import, Filter } from 'lucide-react';

export default function ProjectIndex({ projects, users }) {
    return (
        <AuthenticatedLayout
            header={{ title: "Projects" }}
            projects={projects}
        >
            <Head title="Projects" />
            
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-96">
                            <Input 
                                type="search" 
                                placeholder="Search projects" 
                                className="pl-8"
                            />
                            <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="gap-2">
                                <Import className="h-4 w-4" />
                                Import / Export
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <AddProjectDialog users={users} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="w-4 p-4">
                                        <Checkbox />
                                    </th>
                                    <th className="text-left p-4">Name</th>
                                    <th className="text-left p-4">Tags</th>
                                    <th className="text-left p-4">Assignee</th>
                                    <th className="text-left p-4">Progress</th>
                                    <th className="text-left p-4">Deadline</th>
                                    <th className="text-left p-4">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            <Checkbox />
                                        </td>
                                        <td className="p-4">
                                            <Link 
                                                href={route('projects.show', project.id)}
                                                className="flex items-center gap-3"
                                            >
                                                {project.logo ? (
                                                    <img 
                                                        src={`/storage/${project.logo}`} 
                                                        alt={project.name}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <span className="text-lg font-bold text-gray-400">
                                                            {project.name[0]}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium">{project.name}</div>
                                                    <div className="text-sm text-gray-500">{project.department}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {project.tags?.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="rounded-sm">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex -space-x-2">
                                                {project.assignees?.map((user) => (
                                                    <Avatar
                                                        key={user.id}
                                                        className="w-8 h-8 border-2 border-white"
                                                        title={user.name}
                                                    >
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1 bg-gray-200 rounded-full">
                                                    <div 
                                                        className="h-full bg-blue-500 rounded-full" 
                                                        style={{ 
                                                            width: `${project.progress[1] === 0 ? 0 : (project.progress[0] / project.progress[1]) * 100}%` 
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {project.progress[0]}/{project.progress[1]}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {project.deadline && format(new Date(project.deadline), 'MMM d, yyyy')}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star}>
                                                        {star <= (project.rating || 0) ? (
                                                            <StarFilled className="w-4 h-4 text-yellow-400" />
                                                        ) : (
                                                            <Star className="w-4 h-4 text-gray-300" />
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 