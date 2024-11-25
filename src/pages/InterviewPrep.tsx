import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

// Importing directly from the parent directory
import { extractData } from '../utils/extractData';

// Define types for better clarity and type safety
interface JobDescription {
    title: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    preferences: string[];
    rawContent: string;
}

interface ExtractedData {
    skills?: string[];
    careerAnalysis?: {
        positionHistory?: { company: string; responsibilities: string[] }[];
    };
}

interface BehavioralData {
    currentPosition?: { company: string };
}

// Define a type for the preparation data
interface InterviewPrepData {
    technicalQuestions: { question: string; tips: string[] }[];
    behavioralQuestions: { question: string; tips: string[] }[];
    keyPoints: {
        strengths: string[];
        improvements: string[];
        experience: { company: string; highlights: string[] }[];
    };
    preparation: string[];
}

const InterviewPrep = () => {
    const [file, setFile] = useState<File | null>(null);
    const [jobDesc, setJobDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [prepData, setPrepData] = useState<InterviewPrepData | null>(null);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files![0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
    };

    const generatePrep = async () => {
        try {
            setLoading(true);
            setError('');

            if (!file) {
                throw new Error('Please upload your resume');
            }

            if (!jobDesc) {
                throw new Error('Please enter the job description');
            }

            const jobDescription: JobDescription = {
                title: "Position",
                description: jobDesc,
                requirements: [],
                responsibilities: [],
                preferences: [],
                rawContent: jobDesc
            };

            const extractedData = await extractData(file, jobDescription);

            const interviewPrep = {
                technicalQuestions: generateTechnicalQuestions(extractedData),
                behavioralQuestions: generateBehavioralQuestions(extractedData),
                keyPoints: generateKeyPoints(extractedData),
                preparation: generatePreparationTips(extractedData)
            };

            setPrepData(interviewPrep);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error));
            }
        } finally {
            setLoading(false);
        }
    };

    const generateTechnicalQuestions = (data: ExtractedData) => {
        const questions: { question: string; tips: string[] }[] = [];

        data.skills?.forEach((skill) => {
            questions.push({
                question: `Can you explain your experience with ${skill}?`,
                tips: [
                    `Highlight specific projects using ${skill}`,
                    `Mention any certifications or training in ${skill}`,
                    `Prepare code examples if applicable`,
                ],
            });
        });

        data.careerAnalysis?.positionHistory?.forEach((position) => {
            questions.push({
                question: `What were your main technical challenges at ${position.company}?`,
                tips: [
                    `Focus on problem-solving process`,
                    `Highlight technologies used`,
                    `Quantify the impact of your solutions`,
                ],
            });
        });

        return questions;
    };

    const generateBehavioralQuestions = (data: BehavioralData) => {
        return [
            {
                question: "Tell me about a challenging project you worked on",
                tips: ["Use STAR method", "Focus on your specific contributions", "Highlight outcomes"],
            },
            {
                question: "How do you handle disagreements with team members?",
                tips: ["Emphasize communication skills", "Show conflict resolution abilities", "Focus on positive outcomes"],
            },
            {
                question: `Describe a situation where you demonstrated leadership at ${data.currentPosition?.company}`,
                tips: ["Focus on initiative taken", "Highlight team coordination", "Discuss results achieved"],
            },
        ];
    };

    const generateKeyPoints = (data: any) => {
        return {
            strengths: data.skills?.length ? data.skills : [],
            improvements: data.improvements?.skills || [],
            experience: data.careerAnalysis?.positionHistory?.map((pos: { company: string; responsibilities?: string[] }) => ({
                company: pos.company,
                highlights: pos.responsibilities || [],
            })) || [],
        };
    };

    const generatePreparationTips = (data: ExtractedData) => {
        return [
            "Research recent projects and news about the company",
            `Prepare examples of your work with ${data.skills?.slice(0, 3).join(', ')}`,
            "Review the job description requirements and match them to your experience",
            "Prepare questions about the company's technology stack and development processes",
            "Practice explaining your career progression and goals",
        ];
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Interview Preparation Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Upload Resume (PDF/DOCX)</label>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Job Description</label>
                        <textarea
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                            className="min-h-32 w-full rounded border p-2"
                            placeholder="Paste the job description here..."
                        />
                    </div>

                    <Button
                        onClick={generatePrep}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Generate Interview Prep'
                        )}
                    </Button>

                    {error && (
                        <div className="text-sm text-red-500">{error}</div>
                    )}
                </div>

                {/* Results Section */}
                {prepData && (
                    <div className="space-y-6">
                        {/* Technical Questions Section */}
                        <div className="overflow-hidden rounded-lg border">
                            <button
                                onClick={() => setActiveSection(activeSection === 'technical' ? '' : 'technical')}
                                className="flex w-full items-center justify-between bg-gray-50 p-4 text-left font-medium hover:bg-gray-100"
                            >
                                Technical Questions
                                <span className="text-gray-500">{activeSection === 'technical' ? '−' : '+'}</span>
                            </button>
                            {activeSection === 'technical' && (
                                <div className="space-y-4 p-4">
                                    {prepData?.technicalQuestions.map((q, i) => (
                                        <div key={i} className="rounded border p-4">
                                            <p className="font-medium">{q.question}</p>
                                            <ul className="mt-2 space-y-1">
                                                {q.tips.map((tip, j) => (
                                                    <li key={j} className="text-sm text-gray-600">• {tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Behavioral Questions Section */}
                        <div className="overflow-hidden rounded-lg border">
                            <button
                                onClick={() => setActiveSection(activeSection === 'behavioral' ? '' : 'behavioral')}
                                className="flex w-full items-center justify-between bg-gray-50 p-4 text-left font-medium hover:bg-gray-100"
                            >
                                Behavioral Questions
                                <span className="text-gray-500">{activeSection === 'behavioral' ? '−' : '+'}</span>
                            </button>
                            {activeSection === 'behavioral' && (
                                <div className="space-y-4 p-4">
                                    {prepData.behavioralQuestions.map((q, i) => (
                                        <div key={i} className="rounded border p-4">
                                            <p className="font-medium">{q.question}</p>
                                            <ul className="mt-2 space-y-1">
                                                {q.tips.map((tip, j) => (
                                                    <li key={j} className="text-sm text-gray-600">• {tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Key Points Section */}
                        <div className="overflow-hidden rounded-lg border">
                            <button
                                onClick={() => setActiveSection(activeSection === 'keypoints' ? '' : 'keypoints')}
                                className="flex w-full items-center justify-between bg-gray-50 p-4 text-left font-medium hover:bg-gray-100"
                            >
                                Key Points to Highlight
                                <span className="text-gray-500">{activeSection === 'keypoints' ? '−' : '+'}</span>
                            </button>
                            {activeSection === 'keypoints' && (
                                <div className="space-y-4 p-4">
                                    <div>
                                        <h4 className="mb-2 font-medium">Core Strengths</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {prepData.keyPoints.strengths.map((strength, i) => (
                                                <span key={i} className="rounded-full bg-gray-100 px-2 py-1 text-sm">
                                                    {strength}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="mb-2 font-medium">Experience Highlights</h4>
                                        {prepData.keyPoints.experience.map((exp, i) => (
                                            <div key={i} className="mb-2">
                                                <p className="font-medium">{exp.company}</p>
                                                <ul className="ml-4 list-disc">
                                                    {exp.highlights.slice(0, 2).map((highlight, j) => (
                                                        <li key={j} className="text-sm">{highlight}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Preparation Tips Section */}
                        <div className="overflow-hidden rounded-lg border">
                            <button
                                onClick={() => setActiveSection(activeSection === 'tips' ? '' : 'tips')}
                                className="flex w-full items-center justify-between bg-gray-50 p-4 text-left font-medium hover:bg-gray-100"
                            >
                                Preparation Tips
                                <span className="text-gray-500">{activeSection === 'tips' ? '−' : '+'}</span>
                            </button>
                            {activeSection === 'tips' && (
                                <div className="p-4">
                                    <ul className="space-y-2">
                                        {prepData.preparation.map((tip, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default InterviewPrep;