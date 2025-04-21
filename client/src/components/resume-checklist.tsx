import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw } from "lucide-react";

export function ResumeChecklist() {
  const [checklist, setChecklist] = useState([
    { id: "header", label: "Header contains name, email, and phone number", checked: false },
    { id: "summary", label: "Professional summary is concise and tailored", checked: false },
    { id: "experience", label: "Work experience includes achievements, not just responsibilities", checked: false },
    { id: "bullets", label: "Bullet points start with action verbs", checked: false },
    { id: "quant", label: "Achievements are quantified with specific numbers", checked: false },
    { id: "skills", label: "Skills section includes relevant technical and soft skills", checked: false },
    { id: "education", label: "Education section is properly formatted", checked: false },
    { id: "dates", label: "All dates are in consistent format", checked: false },
    { id: "format", label: "Resume layout is clean and professional", checked: false },
    { id: "spelling", label: "No spelling or grammar errors", checked: false },
    { id: "page", label: "Resume fits on one page (if less than 10 years experience)", checked: false },
    { id: "contact", label: "Contact information is up-to-date", checked: false },
    { id: "keywords", label: "Keywords from job description are incorporated", checked: false },
    { id: "cronological", label: "Work experience is in reverse chronological order", checked: false },
    { id: "impact", label: "Bullet points emphasize impact, not just tasks", checked: false },
    { id: "consistent", label: "Formatting is consistent throughout the document", checked: false },
    { id: "proofread", label: "Resume has been proofread by someone else", checked: false },
    { id: "ats", label: "Resume passes ATS (no unusual formatting, tables, or headers)", checked: false },
  ]);

  const progress = Math.round((checklist.filter(item => item.checked).length / checklist.length) * 100);

  const toggleItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const resetChecklist = () => {
    setChecklist(checklist.map(item => ({ ...item, checked: false })));
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resume Checklist</h3>
        <Button variant="outline" size="sm" onClick={resetChecklist} className="text-xs h-8">
          <RefreshCw className="h-3 w-3 mr-1.5" />
          Reset
        </Button>
      </div>
      
      <div className="relative pt-1 mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-medium text-gray-500">Progress</div>
          <div className="text-xs font-medium text-blue-600">{progress}%</div>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
          <div 
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
          />
        </div>
      </div>
      
      {progress === 100 && (
        <div className="rounded-md bg-green-50 p-3 mb-4 flex items-center text-green-700 border border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm font-medium">
            Congratulations! Your resume is ready for submission.
          </span>
        </div>
      )}
      
      <div className="space-y-2">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-start space-x-2">
            <Checkbox 
              id={item.id} 
              checked={item.checked} 
              onCheckedChange={() => toggleItem(item.id)}
              className="mt-0.5"
            />
            <label 
              htmlFor={item.id} 
              className={`text-sm ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}