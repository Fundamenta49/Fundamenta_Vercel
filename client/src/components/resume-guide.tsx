import React from "react";

export function ResumeGuide() {
  return (
    <div className="space-y-4 p-2">
      <section>
        <h3 className="text-lg font-semibold text-blue-600 mb-2">Resume Writing Fundamentals</h3>
        <p className="text-sm text-gray-700 mb-2">
          A well-crafted resume is your personal marketing document that showcases your skills, experiences, 
          and achievements to potential employers. Follow these guidelines to create an effective resume.
        </p>
      </section>

      <section>
        <h3 className="text-md font-medium mb-1">1. Keep it Concise</h3>
        <p className="text-sm text-gray-700 mb-2">
          Most employers spend less than 30 seconds reviewing a resume initially. Limit your resume to 1-2 pages, 
          focusing on the most relevant information. Use bullet points and concise language to maximize impact.
        </p>
      </section>

      <section>
        <h3 className="text-md font-medium mb-1">2. Tailor to the Job</h3>
        <p className="text-sm text-gray-700 mb-2">
          Customize your resume for each position. Analyze the job description and include relevant keywords 
          and skills. The job targeting feature in our builder can help optimize your resume for specific positions.
        </p>
      </section>

      <section>
        <h3 className="text-md font-medium mb-1">3. Use Action Verbs</h3>
        <p className="text-sm text-gray-700 mb-2">
          Begin bullet points with strong action verbs (managed, developed, created, implemented) to convey 
          your accomplishments effectively. Avoid passive voice and phrases like "responsible for."
        </p>
        <div className="bg-blue-50 p-2 rounded text-sm">
          <p className="font-medium text-blue-700">Examples:</p>
          <ul className="list-disc list-inside text-gray-700 text-xs space-y-1 mt-1">
            <li>Weak: "Responsible for managing a team of five"</li>
            <li>Strong: "Led a five-person team, increasing productivity by 25%"</li>
            <li>Weak: "Duties included customer service"</li>
            <li>Strong: "Resolved 50+ customer inquiries daily, maintaining 98% satisfaction rate"</li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="text-md font-medium mb-1">4. Quantify Achievements</h3>
        <p className="text-sm text-gray-700 mb-2">
          Use numbers, percentages, and metrics to demonstrate your impact. Quantified achievements are more 
          compelling than general statements about your responsibilities.
        </p>
        <div className="bg-blue-50 p-2 rounded text-sm">
          <p className="font-medium text-blue-700">Examples:</p>
          <ul className="list-disc list-inside text-gray-700 text-xs space-y-1 mt-1">
            <li>Increased sales by 35% over 12 months</li>
            <li>Reduced operational costs by $50,000 annually</li>
            <li>Managed a $500,000 budget for marketing campaigns</li>
            <li>Improved process efficiency by 20%, saving 15 hours weekly</li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="text-md font-medium mb-1">5. Essential Sections</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 ml-2">
          <li><span className="font-medium">Contact Information:</span> Include name, phone, email, and LinkedIn profile (optional: location, portfolio website)</li>
          <li><span className="font-medium">Professional Summary:</span> 2-4 sentences highlighting your experience, key skills, and notable achievements</li>
          <li><span className="font-medium">Work Experience:</span> List relevant positions in reverse chronological order with company, title, dates, and accomplishments</li>
          <li><span className="font-medium">Education:</span> List degrees, institutions, graduation dates, and relevant coursework or honors</li>
          <li><span className="font-medium">Skills:</span> Include technical, professional, and soft skills relevant to the position</li>
          <li><span className="font-medium">Optional Sections:</span> Certifications, projects, languages, volunteer work (if relevant to your target role)</li>
        </ul>
      </section>

      <section>
        <h3 className="text-md font-medium mb-1">6. Formatting Tips</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
          <li>Use a clean, professional font (Arial, Calibri, Helvetica)</li>
          <li>Maintain consistent formatting for headings, dates, and bullet points</li>
          <li>Use 10-12 point font size for body text, slightly larger for headings</li>
          <li>Include sufficient white space to improve readability</li>
          <li>Save and send as a PDF to preserve formatting</li>
        </ul>
      </section>

      <section>
        <h3 className="text-md font-medium mb-1">7. Avoid Common Mistakes</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
          <li>Spelling and grammar errors (proofread multiple times)</li>
          <li>Including personal information (age, marital status, photo)</li>
          <li>Using generic objectives or summaries</li>
          <li>Including irrelevant experience or outdated information</li>
          <li>Using overly complex language or industry jargon</li>
        </ul>
      </section>

      <div className="mt-6 bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-700 font-medium">Pro Tip:</p>
        <p className="text-sm text-gray-700">
          After creating your resume, have at least one other person review it for clarity, 
          impact, and errors. Consider the feedback and make necessary adjustments.
        </p>
      </div>
    </div>
  );
}

export default ResumeGuide;