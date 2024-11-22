import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { extractData } from '../utils/extractData';
import { saveResume } from '../utils/fileStorage';


export default function Upload() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const analysis = await extractData(file);
            const resumeId = await saveResume(file, analysis);
            navigate(`/resume/${resumeId}`);
        } catch (error) {
            console.error('Upload error:', error);
            setError(error instanceof Error ? error.message : 'Failed to process resume');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">ResuMetrics</h1>
                    <p className="mt-2 text-gray-600">
                        Upload your resume to get detailed analysis and career insights
                    </p>
                </div>

                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => navigate('/resumes')}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <svg
                            className="mr-1 h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                        </svg>
                        View All Resumes
                    </button>
                </div>

                <div
                    {...getRootProps()}
                    className={`
            mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg
            ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
            ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                >
                    <div className="space-y-1 text-center">
                        <input {...getInputProps()} />
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none hover:text-blue-500">
                                {isDragActive ? (
                                    <span>Drop the file here</span>
                                ) : (
                                    <span>
                                        {loading ? 'Processing...' : 'Upload a file or drag and drop'}
                                    </span>
                                )}
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">PDF or DOCX up to 10MB</p>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 rounded-lg bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Upload failed
                                </h3>
                                <p className="mt-1 text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="mt-4 flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>
        </div>
    );
}