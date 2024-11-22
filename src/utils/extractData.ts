import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// Manually specify the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

// Simplified regex extraction helper
const extractWithRegex = (text: string) => {
  const patterns = {
    email: /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/,
    name: /(Name|Full Name):\s*(.+)/i,
    skills: /(Skills|Technical Skills):\s*(.+)/i,
    experience: /(Experience|Work Experience):\s*(.+)/i,
  };

  return {
    email: text.match(patterns.email)?.[0] || null,
    name: text.match(patterns.name)?.[2] || null,
    skills: text.match(patterns.skills)?.[2]?.split(",").map(s => s.trim()) || [],
    experience: text.match(patterns.experience)?.[2] || null,
  };
};

// Simplified Gemini prompt
async function processWithGemini(text: string) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `
              Analyze this resume and provide a JSON response with:
              1. Basic information
              2. Strengths and improvements
              3. CV assessment
              4. Career analysis
              5. Growth roadmap
              
              JSON structure:
              {
                "name": "string",
                "email": "string",
                "skills": ["string"],
                "experience": "string",
                "currentPosition": {
                  "title": "string",
                  "designation": "string",
                  "company": "string",
                  "duration": "string"
                },
                "careerAnalysis": {
                  "currentLevel": "string",
                  "totalYearsOfExperience": number,
                  "positionHistory": [{
                    "title": "string",
                    "designation": "string",
                    "company": "string",
                    "duration": "string",
                    "level": "string",
                    "responsibilities": ["string"]
                  }],
                  "suggestedNextRole": "string",
                  "careerProgression": "string",
                  "progressionRoadmap": {
                    "targetRole": "string",
                    "estimatedTimeframe": "string",
                    "requiredSkills": [{
                      "skill": "string",
                      "priority": "high|medium|low",
                      "currentLevel": "none|basic|intermediate|advanced",
                      "actionItems": ["string"]
                    }],
                    "milestones": [{
                      "title": "string",
                      "timeframe": "string",
                      "actions": ["string"]
                    }]
                  }
                },
                "analysis": {
                  "strengths": {
                    "skills": ["string"],
                    "experience": ["string"],
                    "marketAlignment": ["string"]
                  },
                  "improvements": {
                    "skills": ["string"],
                    "experience": ["string"],
                    "suggestions": ["string"]
                  },
                  "marketScore": number,
                  "cvScore": number
                }
              }
              Resume: ${text}`
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
}

// Generic text extraction function
const extractText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  
  if (file.type === "application/pdf") {
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const textContent = [];
    
    for (let i = 0; i < pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i + 1);
      const content = await page.getTextContent();
      textContent.push(
        content.items
          .map((item: any) => item.str)
          .join(' ')
      );
    }
    
    return textContent.join('\n').replace(/\s+/g, ' ').trim();
  } else {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.replace(/\s+/g, ' ').trim();
  }
};

// Main extraction function
export async function extractData(file: File): Promise<any> {
  try {
    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        .includes(file.type)) {
      throw new Error("Please upload a PDF or DOCX file");
    }

    const text = await extractText(file);
    console.log("Extracted text:", text);

    try {
      const aiData = await processWithGemini(text);
      return { ...aiData, rawText: text };
    } catch (error) {
      console.warn("Falling back to regex extraction:", error);
      return { ...extractWithRegex(text), rawText: text };
    }
  } catch (error) {
    console.error("Extraction error:", error);
    throw error;
  }
}
  
