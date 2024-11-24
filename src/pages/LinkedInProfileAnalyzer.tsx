import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type AnalysisType = {
    name: string;
    currentRole: string;
    yearsOfExperience: number;
    industry: string;
    strengthsAnalysis: {
        majorStrengths: string[];
        technicalStrengths: string[];
        softSkills: string[];
    };
    weaknessAnalysis: {
        areasOfImprovement: string[];
        skillGaps: string[];
        recommendations: string[];
    };
    careerGrowth: {
        potentialRoles: string[];
        suggestedSkills: string[];
        growthScore: number;
    };
    marketRelevance: {
        industryFit: string;
        marketScore: number;
        demandLevel: 'high' | 'medium' | 'low';
    };
};

type ProfileDataType = {
    // Define the structure of the LinkedIn profile data you expect
};

const LinkedInProfileAnalyzer = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [analysis, setAnalysis] = useState<AnalysisType | null>(null);
    // Function to validate LinkedIn URL
    const isValidLinkedInUrl = (url: string) => {
        return url.match(/^https?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?$/);
    };
    // Function to process LinkedIn profile with Gemini
    const processWithGemini = async (profileData: ProfileDataType) => {
        try {
            const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
            const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
                Analyze this LinkedIn profile and provide a JSON response with:
                1. Professional assessment
                2. Key strengths and weaknesses
                3. Skill evaluation
                4. Career growth potential

                Profile data: ${JSON.stringify(profileData)}

                Provide response in this JSON structure:
                {
                  "profileSummary": {
                    "name": "string",
                    "currentRole": "string",
                    "yearsOfExperience": number,
                    "industry": "string"
                  },
                  "strengthsAnalysis": {
                    "majorStrengths": ["string"],
                    "technicalStrengths": ["string"],
                    "softSkills": ["string"]
                  },
                  "weaknessAnalysis": {
                    "areasOfImprovement": ["string"],
                    "skillGaps": ["string"],
                    "recommendations": ["string"]
                  },
                  "careerGrowth": {
                    "potentialRoles": ["string"],
                    "suggestedSkills": ["string"],
                    "growthScore": number
                  },
                  "marketRelevance": {
                    "industryFit": "string",
                    "marketScore": number,
                    "demandLevel": "high" | "medium" | "low"
                  }
                }
              `
                        }]
                    }]
                })
            });

            if (!response.ok) throw new Error('Gemini API request failed');

            const result = await response.json();
            const content = result.candidates[0].content.parts[0].text;
            const jsonMatch = content.match(/\{[\s\S]*\}/);

            if (!jsonMatch) throw new Error('No valid JSON found in response');
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Gemini processing error:", error);
            throw error;
        }
    };

    const handleAnalyze = async () => {
        setError('');
        setLoading(true);

        try {
            if (!isValidLinkedInUrl(url)) {
                throw new Error('Please enter a valid LinkedIn profile URL');
            }

            // Fetch actual LinkedIn profile data
            const profileData = await fetchLinkedInProfile(url);
            const analysisResult = await processWithGemini(profileData);
            setAnalysis(analysisResult);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch LinkedIn profile data
    const fetchLinkedInProfile = async (url: string): Promise<ProfileDataType> => {
        const ACCESS_TOKEN = process.env.REACT_APP_LINKEDIN_ACCESS_TOKEN; // Ensure you have a valid access token
        const response = await fetch(`https://api.linkedin.com/v2/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch LinkedIn profile data');
        }

        return await response.json();
    };

    const renderAnalysis = () => {
        if (!analysis) return null;

        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Profile Summary</h3>
                    <p className="text-gray-600">
                        {analysis.name} - {analysis.currentRole}
                    </p>
                    <p className="text-gray-600">
                        {analysis.yearsOfExperience} years of experience in {analysis.industry}
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Major Strengths</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {analysis.strengthsAnalysis.majorStrengths.map((strength, index) => (
                            <li key={index} className="text-gray-600">{strength}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {analysis.weaknessAnalysis.areasOfImprovement.map((weakness, index) => (
                            <li key={index} className="text-gray-600">{weakness}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Career Growth Potential</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium">Growth Score: {analysis.careerGrowth.growthScore}/100</p>
                        <p className="text-sm text-gray-600 mt-2">Market Demand: {analysis.marketRelevance.demandLevel}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>LinkedIn Profile Analyzer</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Enter LinkedIn profile URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleAnalyze}
                            disabled={loading || !url}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing
                                </>
                            ) : (
                                'Analyze Profile'
                            )}
                        </Button>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {analysis && (
                        <Alert className="mt-4">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>Analysis completed successfully</AlertDescription>
                        </Alert>
                    )}

                    {renderAnalysis()}
                </div>
            </CardContent>
        </Card>
    );
};

export default LinkedInProfileAnalyzer;