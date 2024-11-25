/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { Camera, Square, Volume2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { extractData } from '../utils/extractData';

// Type Definitions
type Skill = {
    skill: string;
    priority: 'high' | 'medium' | 'low';
    currentLevel: 'none' | 'basic' | 'intermediate' | 'advanced';
    actionItems: string[];
};

type Milestone = {
    title: string;
    timeframe: string;
    actions: string[];
};

type PositionHistory = {
    title: string;
    designation: string;
    company: string;
    duration: string;
    level: string;
    responsibilities: string[];
};

type CurrentPosition = {
    title: string;
    designation: string;
    company: string;
    duration: string;
};

type CVData = {
    name: string;
    email: string;
    skills: string[];
    experience: string;
    currentPosition: CurrentPosition;
    careerAnalysis: {
        currentLevel: string;
        totalYearsOfExperience: number;
        positionHistory: PositionHistory[];
        suggestedNextRole: string;
        careerProgression: string;
        progressionRoadmap: {
            targetRole: string;
            estimatedTimeframe: string;
            requiredSkills: Skill[];
            milestones: Milestone[];
        };
    };
    analysis: {
        strengths: {
            skills: string[];
            experience: string[];
            marketAlignment: string[];
        };
        improvements: {
            skills: string[];
            experience: string[];
            suggestions: string[];
        };
        marketScore: number;
        cvScore: number;
    };
    rawText?: string;
};

type InterviewQuestion = {
    question: string;
    answerFramework: {
        structure: string;
        keyPoints: string[];
        tips: string[];
    };
};

type PracticeFeedback = {
    strengths: string[];
    improvements: string[];
    confidenceScore: number;
    clarityScore: number;
    recommendations: string[];
};

const InterviewCoach = () => {
    const [cvData, setCVData] = useState<CVData | null>(null);
    const [recording, setRecording] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [feedback, setFeedback] = useState<PracticeFeedback | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadStatus('uploading');
            setLoading(true);

            const extractedData = await extractData(file);
            setCVData(extractedData);
            setUploadStatus('success');

            // Automatically generate questions once CV is processed
            await generateQuestions(extractedData);
        } catch (err) {
            setError('Failed to process CV file');
            setUploadStatus('error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generateQuestions = async (data: CVData) => {
        try {
            setLoading(true);

            // Make the API call
            const response = await fetch(`${GEMINI_API_URL}?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
                        Based on this CV data, generate 5 role-specific interview questions
                        and provide a framework for answering each question.
                        Focus on the candidate's current role as ${data.currentPosition.title}
                        and their target role as ${data.careerAnalysis.progressionRoadmap.targetRole}.
                        
                        CV Data: ${JSON.stringify(data)}
                        
                        Format the response as JSON:
                        {
                          "questions": [{
                            "question": "string",
                            "answerFramework": {
                              "structure": "string",
                              "keyPoints": ["string"],
                              "tips": ["string"]
                            }
                          }]
                        }
                      `
                        }]
                    }]
                })
            });

            if (!response.ok) throw new Error('Failed to generate questions');

            // Parse the response
            const result = await response.json();
            const rawContent = result.candidates[0].content.parts[0].text;

            const cleanedContent = rawContent.replace(/```json|```/g, '').trim();

            // Clean and parse the JSON
            let content;
            try {
                content = JSON.parse(cleanedContent);
            } catch (parseErr) {
                console.error('Invalid JSON response:', cleanedContent);
                throw new Error('Failed to parse API response as JSON');
            }

            setQuestions(content.questions);
        } catch (err) {
            setError('Failed to generate interview questions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            const mediaRecorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                setVideoURL(URL.createObjectURL(blob));
                analyzePractice(blob);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            setError('Failed to start recording');
            console.error(err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        streamRef.current?.getTracks().forEach(track => track.stop());
        setRecording(false);
    };

    const analyzePractice = async (videoBlob: Blob) => {
        try {
            setLoading(true);

            // Placeholder for uploading the videoBlob (if needed in the future)
            // You can implement AWS Transcribe or other video/audio analysis services here.

            // Simulate feedback analysis with Gemini API
            const response = await fetch(`${GEMINI_API_URL}?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
                            Analyze this mock interview response and provide feedback.
                            Consider the candidate's target role: ${cvData?.careerAnalysis.progressionRoadmap.targetRole}
                            
                            Format as JSON:
                            {
                            "feedback": {
                                "strengths": ["string"],
                                "improvements": ["string"],
                                "confidenceScore": number,
                                "clarityScore": number,
                                "recommendations": ["string"]
                            }
                            }
                        `
                        }]
                    }]
                })
            });

            if (!response.ok) throw new Error('Failed to analyze practice');

            // Parse the response
            const result = await response.json();
            const rawContent = result.candidates[0].content.parts[0].text;

            // Clean and parse the JSON response
            let content;
            try {
                content = JSON.parse(rawContent.replace(/```json|```/g, '').trim());
            } catch (parseErr) {
                console.error('Invalid JSON response:', rawContent);
                throw new Error('Failed to parse API response as JSON');
            }

            setFeedback(content.feedback);
        } catch (err) {
            setError('Failed to analyze practice session');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Interview Coach</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        {/* CV Upload Section */}
                        {!cvData && (
                            <div className="rounded-lg border-2 border-dashed p-6 text-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".pdf,.docx"
                                    className="hidden"
                                />
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload CV (PDF or DOCX)
                                </Button>
                                <p className="mt-2 text-sm text-gray-600">
                                    Upload your CV to get personalized interview questions
                                </p>
                            </div>
                        )}

                        {/* CV Summary */}
                        {cvData && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold">Current Position</h3>
                                            <p>{cvData.currentPosition.title} at {cvData.currentPosition.company}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Target Role</h3>
                                            <p>{cvData.careerAnalysis.progressionRoadmap.targetRole}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Key Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {cvData.skills.slice(0, 5).map((skill, i) => (
                                                    <span key={i} className="rounded-full bg-blue-100 px-2 py-1 text-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Video Preview */}
                        {cvData && (
                            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}

                        {/* Controls */}
                        {cvData && (
                            <div className="flex justify-center gap-4">
                                <Button
                                    onClick={recording ? stopRecording : startRecording}
                                    variant={recording ? "destructive" : "default"}
                                >
                                    {recording ? (
                                        <>
                                            <Square className="mr-2 h-4 w-4" />
                                            Stop Recording
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="mr-2 h-4 w-4" />
                                            Start Practice
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => generateQuestions(cvData)}
                                    disabled={loading}
                                >
                                    <Volume2 className="mr-2 h-4 w-4" />
                                    Generate Questions
                                </Button>
                            </div>
                        )}

                        {/* Questions */}
                        {questions.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Interview Questions</h3>
                                {questions.map((q, i) => (
                                    <Card key={i}>
                                        <CardContent className="pt-6">
                                            <p className="font-medium">{q.question}</p>
                                            <div className="mt-2 text-sm text-gray-600">
                                                <p><strong>Structure:</strong> {q.answerFramework.structure}</p>
                                                <ul className="mt-2 list-disc pl-5">
                                                    {q.answerFramework.keyPoints.map((point, j) => (
                                                        <li key={j}>{point}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Feedback */}
                        {feedback && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Practice Feedback</h3>
                                <div className="grid gap-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Confidence Score</p>
                                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full bg-blue-500"
                                                    style={{ width: `${feedback.confidenceScore}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Clarity Score</p>
                                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full bg-green-500"
                                                    style={{ width: `${feedback.clarityScore}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <h4 className="font-medium">Strengths</h4>
                                        <ul className="list-disc pl-5">
                                            {feedback.strengths.map((strength, i) => (
                                                <li key={i}>{strength}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid gap-2">
                                        <h4 className="font-medium">Areas for Improvement</h4>
                                        <ul className="list-disc pl-5">
                                            {feedback.improvements.map((improvement, i) => (
                                                <li key={i}>{improvement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InterviewCoach;