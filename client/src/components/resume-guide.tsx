import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ResumeGuide() {
  return (
    <div className="space-y-6 py-2">
      <div>
        <h3 className="text-lg font-semibold">Resume Format & Structure</h3>
        <p className="text-sm text-gray-600 mt-1">
          A well-structured resume makes it easy for recruiters to find the information they need quickly.
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Keep it to one page</span>
              <p className="text-xs text-gray-600">For most professionals with less than 10 years of experience, a one-page resume is ideal.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Use a clean, professional template</span>
              <p className="text-xs text-gray-600">Avoid overly fancy designs or graphics that distract from your content.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Include clear section headings</span>
              <p className="text-xs text-gray-600">Help recruiters navigate your resume with clear sections like Experience, Education, and Skills.</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <p className="text-sm text-gray-600 mt-1">
          Make it easy for employers to contact you.
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Include your name, email, and phone number</span>
              <p className="text-xs text-gray-600">These are essential contact details for any resume.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Add your LinkedIn profile</span>
              <p className="text-xs text-gray-600">Make sure your LinkedIn profile is up-to-date before including it.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Avoid personal information</span>
              <p className="text-xs text-gray-600">Don't include age, marital status, or a photo (in the US).</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Professional Summary</h3>
        <p className="text-sm text-gray-600 mt-1">
          A strong summary grabs attention and sets the tone.
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Keep it brief (2-3 sentences)</span>
              <p className="text-xs text-gray-600">Highlight your professional identity, experience level, and top strengths.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Tailor it to each job</span>
              <p className="text-xs text-gray-600">Use keywords from the job description to make your summary relevant.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Include achievements</span>
              <p className="text-xs text-gray-600">If possible, add a notable achievement that demonstrates your value.</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <p className="text-sm text-gray-600 mt-1">
          This is the most important section of your resume.
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Use bullet points</span>
              <p className="text-xs text-gray-600">3-5 bullet points per position works best.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Start with action verbs</span>
              <p className="text-xs text-gray-600">Begin bullets with words like "Developed," "Implemented," or "Managed."</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Quantify achievements</span>
              <p className="text-xs text-gray-600">Use numbers to measure your impact (e.g., "Increased sales by 20%").</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Avoid generic responsibilities</span>
              <p className="text-xs text-gray-600">Focus on achievements rather than basic job duties.</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Education</h3>
        <p className="text-sm text-gray-600 mt-1">
          Keep this section concise unless you're a recent graduate.
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">List degrees in reverse chronological order</span>
              <p className="text-xs text-gray-600">Start with your most recent education.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Include GPA if it's above 3.5</span>
              <p className="text-xs text-gray-600">Otherwise, leave it off.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Add relevant coursework for recent grads</span>
              <p className="text-xs text-gray-600">Only include courses directly related to the job.</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Skills</h3>
        <p className="text-sm text-gray-600 mt-1">
          Highlight your relevant technical and soft skills.
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Group skills by category</span>
              <p className="text-xs text-gray-600">E.g., Technical Skills, Language Skills, Soft Skills.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Prioritize skills mentioned in the job description</span>
              <p className="text-xs text-gray-600">This helps get past ATS (Applicant Tracking Systems).</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Avoid listing basic skills</span>
              <p className="text-xs text-gray-600">Microsoft Word and email are assumed skills for most professional roles.</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Keywords & ATS Optimization</h3>
        <p className="text-sm text-gray-600 mt-1">
          Many companies use Applicant Tracking Systems to filter resumes.
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Use keywords from the job description</span>
              <p className="text-xs text-gray-600">Include exact phrases and skills mentioned in the posting.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Use standard section headings</span>
              <p className="text-xs text-gray-600">Stick with "Experience," "Education," and "Skills" instead of creative alternatives.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">Keep formatting simple</span>
              <p className="text-xs text-gray-600">Avoid tables, headers/footers, and complex formatting that ATS might not read correctly.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}