export interface JobDescription {
	title: string;
	responsibilities: string[];
	requirements: string[];
	preferences: string[];
	rawContent: string;
}

export interface MatchResult {
	matchRate: number;
	suitable: boolean;
	cvSummary: {
		position: string;
		experience: string[];
		skills: string[];
	};
	jobSummary: {
		title: string;
		responsibilities: string[];
		requirements: string[];
	};
	improvements: {
		category: string;
		details: string;
		priority: "high" | "medium" | "low";
	}[];
	analysis: {
		strengths: string[];
		gaps: string[];
		recommendations: string[];
	};
}

export interface JobMatchProps {
	resumeData: any;
	onMatchComplete?: (result: MatchResult) => void;
}
