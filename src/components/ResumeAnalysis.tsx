import React from 'react';

interface ResumeAnalysisProps {
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
    cvScore: number;  // Added CV Score
  };
}

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ analysis }) => {
  return (
    <div className="px-0 pb-6">

      {/* Analysis Sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Strengths Section */}
        <div className="rounded-lg bg-green-50 p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-green-800">Strengths</h2>
          
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-green-700">Strong Skills</h3>
            <ul className="space-y-2">
              {analysis.strengths.skills.map((skill, index) => (
                <li key={`strength-skill-${index}`} 
                    className="flex items-center text-green-600">
                  <span className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-sm text-white">✓</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-green-700">Valuable Experience</h3>
            <ul className="space-y-2">
              {analysis.strengths.experience.map((exp, index) => (
                <li key={`strength-exp-${index}`} 
                    className="flex items-center text-green-600">
                  <span className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-sm text-white">✓</span>
                  {exp}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-green-700">Market Alignment</h3>
            <ul className="space-y-2">
              {analysis.strengths.marketAlignment.map((item, index) => (
                <li key={`alignment-${index}`} 
                    className="flex items-center text-green-600">
                  <span className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-sm text-white">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Improvements Section */}
        <div className="rounded-lg bg-red-50 p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-red-800">Areas for Improvement</h2>
          
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-red-700">Skills to Develop</h3>
            <ul className="space-y-2">
              {analysis.improvements.skills.map((skill, index) => (
                <li key={`improve-skill-${index}`} 
                    className="flex items-center text-red-600">
                  <span className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-sm text-white">!</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-red-700">Experience Gaps</h3>
            <ul className="space-y-2">
              {analysis.improvements.experience.map((exp, index) => (
                <li key={`improve-exp-${index}`} 
                    className="flex items-center text-red-600">
                  <span className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-sm text-white">!</span>
                  {exp}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-red-700">Recommendations</h3>
            <ul className="space-y-2">
              {analysis.improvements.suggestions.map((suggestion, index) => (
                <li key={`suggestion-${index}`} 
                    className="flex items-center text-red-600">
                  <span className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-sm text-white">!</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysis;