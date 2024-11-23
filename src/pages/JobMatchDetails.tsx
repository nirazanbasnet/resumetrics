import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobMatch from '../components/JobMatch';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { MatchResult } from '../@types/job-match';
import { saveResume, deleteResume } from '../utils/fileStorage';
import { extractData } from '../utils/extractData';
import { useDropzone } from 'react-dropzone';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog";

interface ResumeMetadata {
    id: string;
    fileName: string;
    uploadDate: string;
    fileType: string;
    fileSize: number;
    analysis: any;
}

export default function Details() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<ResumeMetadata | null>(null);
    const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = async (acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0];
        if (!uploadedFile) return;

        setLoading(true);
        setError(null);

        try {
            const analysisData = await extractData(uploadedFile);
            const resumeId = await saveResume(uploadedFile, analysisData);

            const newMetadata: ResumeMetadata = {
                id: resumeId,
                fileName: uploadedFile.name,
                uploadDate: new Date().toISOString(),
                fileType: uploadedFile.type,
                fileSize: uploadedFile.size,
                analysis: analysisData
            };

            setFile(uploadedFile);
            setMetadata(newMetadata);
        } catch (err) {
            console.error("Error processing file:", err);
            setError("Failed to process the CV. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1,
        multiple: false
    });

    const handleMatchComplete = (result: MatchResult) => {
        setMatchResult(result);
    };

    const handleDelete = async () => {
        if (!metadata?.id) return;

        try {
            await deleteResume(metadata.id);
            navigate('/', {
                replace: true,
                state: { message: 'Resume deleted successfully' }
            });
        } catch (err) {
            console.error("Error deleting resume:", err);
            setError("Failed to delete resume");
        }
    };

    return (
        <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => navigate('/')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">CV Analysis & Job Matching</h1>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                <div className='grid md:grid-cols-2 gap-5'>
                    <div
                        {...getRootProps()}
                        className={`
                        mt-2 mb-5 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg
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
                                <label className="flex-1 relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none hover:text-blue-500">
                                    {isDragActive ? (
                                        <span>Drop the file here</span>
                                    ) : (
                                        <span className='text-center'>
                                            {loading ? 'Processing...' : 'Upload a file or drag and drop'}
                                        </span>
                                    )}
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PDF or DOCX up to 10MB</p>
                        </div>
                    </div>
                </div>

                {
                    loading ? (
                        <div className="flex items-center justify-center gap-2 w-1/2">
                            <span>Please Wait</span>
                            <Loader2 className="size-4 animate-spin text-gray-500" />
                        </div>
                    ) : (
                        metadata && metadata.analysis && (
                            <>
                                <div className='grid md:grid-cols-2 gap-5'>
                                    <Card className="mb-6 relative">
                                        <CardHeader>
                                            <CardTitle>File Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">File Name</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{metadata.fileName}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Upload Date</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {new Date(metadata.uploadDate).toLocaleDateString()}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">File Size</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {(metadata.fileSize / 1024 / 1024).toFixed(2)} MB
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">File Type</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{metadata.fileType}</dd>
                                                </div>
                                            </dl>

                                            {metadata && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger
                                                        className='absolute top-2 right-2' asChild>
                                                        <Button variant="destructive" size="icon">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className='bg-white'>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this resume? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction className='bg-red-500 text-white' onClick={handleDelete}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                <JobMatch
                                    resumeData={metadata.analysis}
                                    onMatchComplete={handleMatchComplete}
                                />
                            </>
                        )
                    )
                }

            </div>
        </div>
    );
}