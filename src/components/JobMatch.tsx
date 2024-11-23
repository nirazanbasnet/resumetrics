import React, { useState } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEditor } from '@tiptap/react';
import { Button } from '../components/ui/button';
import { JobMatchProps, JobDescription, MatchResult } from '../@types/job-match';
import { processJobDescriptionAndCVContentWithGemini } from '../utils/extractData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

export default function JobMatch({ resumeData, onMatchComplete }: JobMatchProps) {

    const [loading, setLoading] = useState(false);
    const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
            },
        },
    });

    const handleMatch = async () => {
        if (!editor) return;

        setLoading(true);
        try {
            const jobDescription: JobDescription = {
                title: '',
                responsibilities: [],
                requirements: [],
                preferences: [],
                rawContent: editor.getText(),
            };

            const result = await processJobDescriptionAndCVContentWithGemini(
                resumeData,
                jobDescription
            );

            setMatchResult(result);
            if (onMatchComplete) {
                onMatchComplete(result);
            }
        } catch (error) {
            console.error('Matching error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-5">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-[350px] overflow-auto border rounded-lg p-4 bg-gray-50">
                        <EditorContent editor={editor} />
                    </div>
                    <Button
                        onClick={handleMatch}
                        disabled={loading || !editor?.getText().trim()}
                        className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                    >
                        {loading ? 'Analyzing...' : 'Match with CV'}
                    </Button>
                </CardContent>
            </Card>

            {matchResult && (
                <div className="space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Match Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Match Rate</span>
                                        <span className="text-sm font-medium">{matchResult.matchRate}%</span>
                                    </div>
                                    <Progress value={matchResult.matchRate} className="mt-2" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Suitability</h3>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${matchResult.suitable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {matchResult.suitable ? 'Suitable' : 'Not Suitable'}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Key Improvements</h3>
                                    <ul className="space-y-2">
                                        {matchResult.improvements.map((improvement, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <div className={`px-2 py-1 rounded text-xs ${improvement.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                    improvement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                                    {improvement.priority}
                                                </div>
                                                <span>{improvement.details}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-600">Strengths</h4>
                                            <ul className="list-disc pl-5 mt-2">
                                                {matchResult.analysis.strengths.map((strength, index) => (
                                                    <li key={index}>{strength}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-600">Gaps</h4>
                                            <ul className="list-disc pl-5 mt-2">
                                                {matchResult.analysis.gaps.map((gap, index) => (
                                                    <li key={index}>{gap}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}