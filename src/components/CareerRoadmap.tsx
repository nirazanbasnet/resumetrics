import React from 'react';

interface ProgressionSkill {
    skill: string;
    priority: 'high' | 'medium' | 'low';
    currentLevel: 'none' | 'basic' | 'intermediate' | 'advanced';
    actionItems: string[];
}

interface Certification {
    name: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
}

interface Milestone {
    title: string;
    timeframe: string;
    actions: string[];
}

interface ProgressionRoadmap {
    targetRole: string;
    estimatedTimeframe: string;
    requiredSkills: ProgressionSkill[];
    certifications: Certification[];
    milestones: Milestone[];
}

interface CareerRoadmapProps {
    roadmap: Partial<ProgressionRoadmap>;
}

export const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ roadmap }) => {
    const {
        targetRole = '',
        estimatedTimeframe = '',
        requiredSkills = [],
        certifications = [],
        milestones = []
    } = roadmap || {};

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            {/* Target Role & Timeline */}
            {(targetRole || estimatedTimeframe) && (
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {targetRole && (
                        <div className="rounded-lg bg-blue-50 p-4">
                            <h3 className="mb-1 text-lg font-semibold text-blue-800">Target Role</h3>
                            <p className="text-gray-600">{targetRole}</p>
                        </div>
                    )}
                    {estimatedTimeframe && (
                        <div className="rounded-lg bg-blue-50 p-4">
                            <h3 className="mb-1 text-lg font-semibold text-blue-800">Timeline</h3>
                            <p className="text-gray-600">{estimatedTimeframe}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Required Skills */}
            {requiredSkills.length > 0 && (
                <div className="mb-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-700">Required Skills</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {requiredSkills.map((skill, index) => (
                            <div key={index} className="rounded-lg border p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="font-medium text-gray-800">{skill.skill}</h4>
                                    <span className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(skill.priority)}`}>
                                        {skill.priority.toUpperCase()}
                                    </span>
                                </div>
                                <p className="mb-2 text-sm text-gray-600">Current Level: {skill.currentLevel}</p>
                                {skill.actionItems?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Action Items:</p>
                                        <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                                            {skill.actionItems.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certifications?.length > 0 && (
                <div className="mb-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-700">Recommended Certifications</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {certifications.map((cert, index) => (
                            <div key={index} className="rounded-lg border p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="font-medium text-gray-800">{cert.name}</h4>
                                    <span className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(cert.priority)}`}>
                                        {cert.priority.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">Timeline: {cert.timeframe}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Milestones */}
            {milestones?.length > 0 && (
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-700">Key Milestones</h3>
                    <div className="space-y-4">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="rounded-lg border p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="font-medium text-gray-800">{milestone.title}</h4>
                                    <span className="text-sm text-gray-600">{milestone.timeframe}</span>
                                </div>
                                {milestone.actions?.length > 0 && (
                                    <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                                        {milestone.actions.map((action, idx) => (
                                            <li key={idx}>{action}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};