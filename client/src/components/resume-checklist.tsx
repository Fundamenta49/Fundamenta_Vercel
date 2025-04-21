import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

/**
 * Resume Checklist Component
 * Provides a comprehensive checklist for resume quality control
 */
export function ResumeChecklist() {
  return (
    <div className="space-y-5 p-2">
      <h2 className="text-lg font-semibold text-blue-600 mb-3">Resume Quality Checklist</h2>
      <p className="text-sm text-gray-600 mb-4">
        Use this checklist to ensure your resume is polished and effective before sending it to employers.
        Aim to check off all these items for the best results.
      </p>

      <ChecklistSection 
        title="Content & Organization" 
        items={[
          "Contact information is complete and up-to-date",
          "Professional summary effectively highlights key qualifications",
          "Experience section shows clear progression and achievements",
          "Education details are complete with relevant information",
          "Skills section includes relevant technical and soft skills",
          "Content is organized in a logical, easy-to-scan format",
          "Accomplishments are emphasized over responsibilities",
          "All information is relevant to target position"
        ]}
      />

      <ChecklistSection 
        title="Language & Clarity" 
        items={[
          "Uses clear, concise language throughout",
          "Bullet points begin with strong action verbs",
          "No spelling or grammatical errors",
          "No first-person pronouns (I, me, my)",
          "Industry-specific keywords are included",
          "Achievements are quantified with metrics where possible",
          "No unnecessary jargon or overly complex language",
          "Consistent verb tense (past tense for previous roles, present for current)"
        ]}
      />

      <ChecklistSection 
        title="Formatting & Presentation" 
        items={[
          "Clean, professional design appropriate for industry",
          "Consistent formatting for headings, dates, and bullets",
          "Appropriate font choices (readable, professional)",
          "Font size between 10-12pt for body text",
          "Sufficient white space for readability",
          "Fits on 1-2 pages maximum",
          "Section headers clearly distinguish different parts",
          "PDF format preserves layout and formatting"
        ]}
      />

      <ChecklistSection 
        title="Targeting & Relevance" 
        items={[
          "Resume is tailored to specific job or industry",
          "Keywords from job description are incorporated",
          "Most relevant experiences are prominently featured",
          "Skills match requirements in job posting",
          "Achievements demonstrate value proposition",
          "Education and certifications support target role",
          "No irrelevant or excessive personal information",
          "Overall narrative aligns with career goals"
        ]}
      />

      <div className="bg-blue-50 p-3 rounded-md mt-6">
        <p className="text-sm text-blue-800 font-medium">Final Review Recommendation:</p>
        <p className="text-sm text-gray-700 mt-1">
          After completing this checklist, have someone else review your resume for additional feedback. 
          Even better, if possible, get input from someone in your target industry who understands what 
          hiring managers are looking for.
        </p>
      </div>
    </div>
  );
}

interface ChecklistSectionProps {
  title: string;
  items: string[];
}

function ChecklistSection({ title, items }: ChecklistSectionProps) {
  return (
    <div className="mb-5">
      <h3 className="text-md font-medium text-gray-800 mb-2">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="mt-0.5 flex-shrink-0">
              <Circle className="h-4 w-4 text-gray-300 stroke-[2.5]" />
            </div>
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeChecklist;