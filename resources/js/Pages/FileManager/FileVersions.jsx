import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function FileVersions({ auth, file, versions }) {
    const [isUploading, setIsUploading] = useState(false);
    
    const { data, setData, post, progress, reset, errors } = useForm({
        file: null,
        comment: ''
    });

    const handleFileChange = (e) => {
        setData('file', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUploading(true);
        
        post(route('files.upload-version', file.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsUploading(false);
                reset();
            },
            onError: () => {
                setIsUploading(false);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="File Versions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* File Information */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4">File Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Name:</p>
                                        <p className="font-medium">{file.original_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Current Version:</p>
                                        <p className="font-medium">{file.version}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload New Version Form */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Upload New Version</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            File
                                        </label>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="mt-1 block w-full"
                                            disabled={isUploading}
                                        />
                                        {errors.file && (
                                            <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Version Comment
                                        </label>
                                        <textarea
                                            value={data.comment}
                                            onChange={e => setData('comment', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="3"
                                            disabled={isUploading}
                                        />
                                        {errors.comment && (
                                            <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
                                        )}
                                    </div>

                                    {progress && (
                                        <div className="relative pt-1">
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                                                <div
                                                    style={{ width: `${progress}%` }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isUploading || !data.file}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload New Version'}
                                    </button>
                                </form>
                            </div>

                            {/* Version History */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Version History</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Version
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Uploaded By
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Comment
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {versions.map((version) => (
                                                <tr key={version.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">v{version.version}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">{version.created_by_name}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">
                                                            {new Date(version.created_at).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-900">{version.comment || '-'}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <a
                                                            href={route('files.download', { file: file.id, version: version.version })}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Download
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 