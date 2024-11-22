import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResumeById } from '../utils/fileStorage';
import ResumeAnalysis from '../components/ResumeAnalysis';
import { CareerRoadmap } from '../components/CareerRoadmap';

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResume = async () => {
      if (!id) return;

      try {
        const resume = await getResumeById(id);
        if (!resume) {
          setError('Resume not found');
          return;
        }
        setData(resume.metadata.analysis);
      } catch (error) {
        console.error('Error loading resume:', error);
        setError('Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Error</h2>
          <p className="mb-8 text-gray-600">{error}</p>
          <Link
            to="/resumes"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Resume List
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/resumes"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Resume List
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-6">
          {/* Market Score */}
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">Market Readiness Score</h3>
            <div className={`w-24 h-24 rounded-full ${getScoreColor(data.analysis.marketScore)} text-white flex items-center justify-center text-2xl font-bold mx-auto`}>
              {data.analysis.marketScore}%
            </div>
            <p className="mt-4 text-gray-600">
              {data.analysis.marketScore >= 80 ? 'Excellent market alignment' :
                data.analysis.marketScore >= 60 ? 'Good potential with room for improvement' :
                  'Needs significant improvement'}
            </p>
          </div>

          {/* CV Score */}
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">CV Quality Score</h3>
            <div className={`w-24 h-24 rounded-full ${getScoreColor(data.analysis.cvScore)} text-white flex items-center justify-center text-2xl font-bold mx-auto`}>
              {data.analysis.cvScore}%
            </div>
            <p className="mt-4 text-gray-600">
              {data.analysis.cvScore >= 80 ? 'Well-structured and detailed CV' :
                data.analysis.cvScore >= 60 ? 'Good CV with some areas to enhance' :
                  'CV needs significant improvements'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-lg bg-white p-6 shadow">
          {/* Basic Information */}
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">{data.name}</h1>

            {data.currentPosition && (
              <div className="mb-6 rounded-lg bg-blue-50 p-4">
                <h2 className="mb-2 text-xl font-semibold text-blue-800">Current Position</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-medium text-gray-800">{data.currentPosition.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="font-medium text-gray-800">{data.currentPosition.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-800">{data.currentPosition.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-800">{data.currentPosition.duration}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-2 text-lg font-semibold text-gray-700">
                  Contact Information
                </h2>
                <p className="text-gray-600">{data.email}</p>
              </div>
              <div>
                <h2 className="mb-2 text-lg font-semibold text-gray-700">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills?.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Career Analysis */}
          {data.careerAnalysis && (
            <div className="border-t pt-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Career Analysis
              </h2>

              {/* Current Level & Experience */}
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Current Level
                  </h3>
                  <p className="text-gray-600">
                    {data.careerAnalysis.currentLevel}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Total Experience
                  </h3>
                  <p className="text-gray-600">
                    {data.careerAnalysis.totalYearsOfExperience} years
                  </p>
                </div>
              </div>

              {/* Position History */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Position History
                </h3>
                <div className="space-y-4">
                  {data.careerAnalysis.positionHistory.map((position: { title: string; designation: string; company: string; duration: string; level: string; responsibilities?: string[] }, index: number) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{position.title}</p>
                          <p className="text-sm text-gray-600">{position.designation}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">{position.company}</p>
                          <p className="text-sm text-gray-600">{position.duration}</p>
                        </div>
                      </div>
                      <p className="mb-2 text-sm text-gray-600">Level: {position.level}</p>
                      {position.responsibilities && position.responsibilities.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Key Responsibilities:</p>
                          <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                            {position.responsibilities.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Resume Analysis */}
          {data.analysis && <ResumeAnalysis analysis={data.analysis} />}

          <div className="border-t pt-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Career Growth Plan</h2>
            {data.careerAnalysis && data.careerAnalysis.suggestedNextRole && (
              <div className="mb-6 rounded-lg bg-green-50 p-4">
                <h2 className="mb-2 text-xl font-semibold text-green-800">Suggested Next Role</h2>
                <p className="text-gray-600">{data.careerAnalysis.suggestedNextRole}</p>
              </div>
            )}
            {/* Career Roadmap */}
            {data.careerAnalysis?.progressionRoadmap && (
              <CareerRoadmap roadmap={data.careerAnalysis.progressionRoadmap} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}