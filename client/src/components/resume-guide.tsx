import React from "react";
import { FileText } from "lucide-react";

export function ResumeGuide() {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-md">
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Resume Writing Guide</h2>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Resume Writing Fundamentals</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          A well-crafted resume is your personal marketing document that showcases your skills, experiences, and achievements to potential employers. Follow these guidelines to create an effective resume.
        </p>
      </div>
      
      <div className="space-y-6">
        <section>
          <h4 className="text-md font-medium text-gray-800 mb-2">1. Keep it Concise</h4>
          <p className="text-gray-700 leading-relaxed">
            Most employers spend less than 30 seconds reviewing a resume initially. Limit your resume to 1-2 pages, focusing on the most relevant information. Use bullet points and concise language to maximize impact.
          </p>
        </section>
  
        <section>
          <h4 className="text-md font-medium text-gray-800 mb-2">2. Tailor to the Job</h4>
          <p className="text-gray-700 leading-relaxed">
            Customize your resume for each position. Analyze the job description and include relevant keywords and skills. The job targeting feature in our builder can help optimize your resume for specific positions.
          </p>
        </section>
  
        <section>
          <h4 className="text-md font-medium text-gray-800 mb-2">3. Use Action Verbs</h4>
          <p className="text-gray-700 leading-relaxed mb-2">
            Begin bullet points with strong action verbs (managed, developed, created, implemented) to convey your accomplishments effectively. Avoid passive voice and phrases like "responsible for."
          </p>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="font-medium text-gray-800 mb-1">Examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Weak:</p>
                <p className="text-sm text-gray-700">"Responsible for managing a team of five"</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Strong:</p>
                <p className="text-sm text-gray-700">"Led a five-person team, increasing productivity by 25%"</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Weak:</p>
                <p className="text-sm text-gray-700">"Duties included customer service"</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Strong:</p>
                <p className="text-sm text-gray-700">"Resolved 50+ customer inquiries daily, maintaining 98% satisfaction rate"</p>
              </div>
            </div>
          </div>
        </section>
  
        <section>
          <h4 className="text-md font-medium text-gray-800 mb-2">4. Quantify Achievements</h4>
          <p className="text-gray-700 leading-relaxed mb-2">
            Use numbers, percentages, and metrics to demonstrate your impact. Quantified achievements are more compelling than general statements about your responsibilities.
          </p>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="font-medium text-gray-800 mb-2">Examples:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li className="text-sm text-gray-700">• Increased sales by 35% over 12 months</li>
              <li className="text-sm text-gray-700">• Reduced operational costs by $50,000 annually</li>
              <li className="text-sm text-gray-700">• Managed a $500,000 budget for marketing campaigns</li>
              <li className="text-sm text-gray-700">• Improved process efficiency by 20%, saving 15 hours weekly</li>
            </ul>
          </div>
        </section>
  
        <section>
          <h4 className="text-md font-medium text-gray-800 mb-2">5. Essential Sections</h4>
          <div className="grid gap-3">
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="font-medium text-gray-800">Contact Information</p>
              <p className="text-sm text-gray-700">Include name, phone, email, and LinkedIn profile (optional: location, portfolio website)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="font-medium text-gray-800">Professional Summary</p>
              <p className="text-sm text-gray-700">2-4 sentences highlighting your experience, key skills, and notable achievements</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="font-medium text-gray-800">Work Experience</p>
              <p className="text-sm text-gray-700">List relevant positions in reverse chronological order with company, title, dates, and accomplishments</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="font-medium text-gray-800">Education</p>
              <p className="text-sm text-gray-700">List degrees, institutions, graduation dates, and relevant coursework or honors</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResumeGuide;