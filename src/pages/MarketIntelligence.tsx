import { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, TrendingUp, Map, Briefcase, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Type Definitions
interface JobDescription {
    title: string;
    location: string;
    skills: string[];
    salary: number;
    company?: string;
    postDate?: string;
    id?: string;
}

interface GrowthSector {
    sector: string;
    growthRate: number;
}

interface EmergingRole {
    role: string;
    demand: number;
}

interface SkillTrend {
    skill: string;
    demandScore: number;
}

interface Location {
    location: string;
    jobCount: number;
}

interface SalaryRange {
    location: string;
    avgSalary: number;
}

interface RemoteWork {
    percentage: number;
    trend: string;
}

interface TechnicalSkill {
    skill: string;
    demand: number;
    trend: string;
}

interface SoftSkill {
    skill: string;
    demand: number;
}

interface Certification {
    name: string;
    value: number;
}

interface Metric {
    name: string;
    value: number;
}

interface MarketAnalysis {
    industryTrends: {
        growthSectors: GrowthSector[];
        emergingRoles: EmergingRole[];
        skillTrends: SkillTrend[];
    };
    geographicalAnalysis: {
        hotspots: Location[];
        salaryRanges: SalaryRange[];
        remoteWork: RemoteWork;
    };
    skillDemand: {
        technical: TechnicalSkill[];
        soft: SoftSkill[];
        certifications: Certification[];
    };
    marketHealth: {
        overall: number;
        metrics: Metric[];
        forecast: string;
    };
}

interface FetchOptions {
    endpoint?: string;
    filters?: Record<string, any>;
    page?: number;
    pageSize?: number;
}

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const MarketIntelligence = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [marketData, setMarketData] = useState<MarketAnalysis | null>(null);
    const [activeTab, setActiveTab] = useState<'trends' | 'skills' | 'geography'>('trends');

    const analyzeMarketData = async (jobData: JobDescription[]): Promise<MarketAnalysis> => {
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
                Analyze these job descriptions and provide market intelligence data in JSON format:
                ${JSON.stringify(jobData)}
                
                Provide analysis in this structure:
                ${JSON.stringify({
                                industryTrends: {
                                    growthSectors: [{ sector: "string", growthRate: 0 }],
                                    emergingRoles: [{ role: "string", demand: 0 }],
                                    skillTrends: [{ skill: "string", demandScore: 0 }]
                                },
                                geographicalAnalysis: {
                                    hotspots: [{ location: "string", jobCount: 0 }],
                                    salaryRanges: [{ location: "string", avgSalary: 0 }],
                                    remoteWork: { percentage: 0, trend: "string" }
                                },
                                skillDemand: {
                                    technical: [{ skill: "string", demand: 0, trend: "string" }],
                                    soft: [{ skill: "string", demand: 0 }],
                                    certifications: [{ name: "string", value: 0 }]
                                },
                                marketHealth: {
                                    overall: 0,
                                    metrics: [{ name: "string", value: 0 }],
                                    forecast: "string"
                                }
                            }, null, 2)}
              `
                        }]
                    }]
                })
            });

            if (!response.ok) throw new Error('Failed to analyze market data');

            const result = await response.json();
            const content = result.candidates[0].content.parts[0].text;
            const jsonMatch = content.match(/\{[\s\S]*\}/);

            if (!jsonMatch) throw new Error('Invalid analysis response');
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Market analysis error:', error);
            throw error;
        }
    };

    const fetchMarketData = async ({
        endpoint = '/api/market-data',
        filters = {},
        page = 1,
        pageSize = 100
    }: FetchOptions = {}) => {
        try {
            setLoading(true);
            setError('');

            // Build query parameters
            const queryParams = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
                ...filters
            }).toString();

            // Fetch job data from API
            const response = await axios.get(`${endpoint}?${queryParams}`);

            if (!response.data || !Array.isArray(response.data.jobs)) {
                throw new Error('Invalid response format from API');
            }

            // Process and validate the raw data
            const jobData = response.data.jobs.map((job: any): JobDescription => ({
                title: job.title,
                location: job.location,
                skills: Array.isArray(job.skills) ? job.skills : [],
                salary: Number(job.salary) || 0,
                company: job.company,
                postDate: job.postDate,
                id: job.id
            }));

            const validJobs = jobData.filter((job: JobDescription) =>
                job.title &&
                job.location &&
                job.salary > 0 &&
                job.skills.length > 0
            );

            if (validJobs.length === 0) {
                throw new Error('No valid job data found');
            }

            // Analyze the validated data
            const analysisResult = await analyzeMarketData(validJobs);
            setMarketData(analysisResult);

            return analysisResult;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(`Failed to fetch market data: ${errorMessage}`);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const renderTrendsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="p-4">
                    <h3 className="mb-4 text-lg font-medium">Industry Growth Sectors</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart data={marketData?.industryTrends.growthSectors || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="sector" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="growthRate" stroke="#8884d8" />
                            </RechartsLineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-4">
                    <h3 className="mb-4 text-lg font-medium">Emerging Roles</h3>
                    <div className="space-y-2">
                        {marketData?.industryTrends.emergingRoles.map((role, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span>{role.role}</span>
                                <span className="text-blue-600">{role.demand}% demand</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderSkillsTab = () => (
        <div className="space-y-6">
            <Card className="p-4">
                <h3 className="mb-4 text-lg font-medium">Technical Skills in Demand</h3>
                <div className="grid grid-cols-2 gap-4">
                    {marketData?.skillDemand.technical.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className="flex-1">
                                <div className="text-sm font-medium">{skill.skill}</div>
                                <div className="h-2 rounded-full bg-gray-200">
                                    <div
                                        className="h-2 rounded-full bg-blue-600"
                                        style={{ width: `${skill.demand}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-sm">{skill.demand}%</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-4">
                <h3 className="mb-4 text-lg font-medium">Valuable Certifications</h3>
                <div className="grid grid-cols-2 gap-4">
                    {marketData?.skillDemand.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span>{cert.name}</span>
                            <span className="text-green-600">+{cert.value}%</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    const renderGeographyTab = () => (
        <div className="space-y-6">
            <Card className="p-4">
                <h3 className="mb-4 text-lg font-medium">Job Market Hotspots</h3>
                <div className="space-y-2">
                    {marketData?.geographicalAnalysis.hotspots.map((location, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span>{location.location}</span>
                            <span>{location.jobCount} openings</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-4">
                <h3 className="mb-4 text-lg font-medium">Regional Salary Ranges</h3>
                <div className="space-y-2">
                    {marketData?.geographicalAnalysis.salaryRanges.map((range, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span>{range.location}</span>
                            <span>${range.avgSalary.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    return (
        <div className="mx-auto w-full max-w-6xl p-4">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-6 w-6" />
                        Market Intelligence Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={() => fetchMarketData()}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing Market Data...
                            </>
                        ) : (
                            'Fetch Market Intelligence'
                        )}
                    </Button>

                    {error && (
                        <div className="mt-4 text-sm text-red-500">{error}</div>
                    )}
                </CardContent>
            </Card>

            {marketData && (
                <>
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Market Health</p>
                                    <p className="text-2xl font-bold">{marketData.marketHealth.overall}%</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-500" />
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Remote Work Trend</p>
                                    <p className="text-2xl font-bold">{marketData.geographicalAnalysis.remoteWork.percentage}%</p>
                                </div>
                                <Briefcase className="h-8 w-8 text-blue-500" />
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Active Markets</p>
                                    <p className="text-2xl font-bold">{marketData.geographicalAnalysis.hotspots.length}</p>
                                </div>
                                <Map className="h-8 w-8 text-purple-500" />
                            </div>
                        </Card>
                    </div>

                    <div className="mb-6 flex space-x-4">
                        <Button
                            variant={activeTab === 'trends' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('trends')}
                        >
                            Industry Trends
                        </Button>
                        <Button
                            variant={activeTab === 'skills' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('skills')}
                        >
                            Skill Demand
                        </Button>
                        <Button
                            variant={activeTab === 'geography' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('geography')}
                        >
                            Geographical Analysis
                        </Button>
                    </div>

                    <div className="mt-6">
                        {activeTab === 'trends' && renderTrendsTab()}
                        {activeTab === 'skills' && renderSkillsTab()}
                        {activeTab === 'geography' && renderGeographyTab()}
                    </div>
                </>
            )}
        </div>
    );
};

export default MarketIntelligence;