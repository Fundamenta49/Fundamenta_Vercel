import { ResumeAnalysis } from './resume-analysis';

// Sample structured resume data for demonstration purposes
export const sampleResumeStructured = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "(555) 123-4567",
  summary: "Detail-oriented Full Stack Developer with 4+ years of experience building responsive web applications using React, Node.js, and TypeScript. Passionate about clean code, user experience, and solving complex problems with elegant solutions.",
  education: `Bachelor of Science in Computer Science
University of Technology, 2015-2019
• GPA: 3.8/4.0
• Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems`,
  experience: `Senior Frontend Developer | TechCorp Inc. | 2021-Present
• Led development of customer portal that improved client retention by 25%
• Refactored legacy code base reducing load time by 40% and improving maintainability
• Mentored 3 junior developers through code reviews and pair programming
• Implemented CI/CD pipeline reducing deployment time by 65%

Web Developer | InnovateSoft | 2019-2021
• Developed responsive web applications for clients across financial and healthcare sectors
• Built RESTful APIs with Node.js and Express to power data-driven applications
• Collaborated with UX team to implement pixel-perfect designs with high accessibility standards`,
  skills: `• Languages: JavaScript, TypeScript, HTML5, CSS3, SQL
• Frameworks & Libraries: React, Redux, Node.js, Express, Jest, React Testing Library
• Tools & Platforms: Git, AWS, Docker, Webpack, Figma
• Soft Skills: Problem Solving, Team Leadership, Agile Methodologies, Technical Writing`,
  projects: `E-commerce Platform Redesign | 2021
• Architected and implemented scalable front-end using React and Redux
• Achieved 99/100 Lighthouse performance score through optimizations
• Integrated payment processing with Stripe API

Community Health Tracker | 2020
• Created mobile-responsive dashboard to visualize public health data
• Implemented data visualization using D3.js
• Open-source project with 500+ GitHub stars`,
  certifications: `• AWS Certified Developer – Associate | 2022
• Google Professional Cloud Developer | 2021
• MongoDB Certified Developer | 2020`,
  resumeText: `Alex Johnson
alex.johnson@example.com | (555) 123-4567 | linkedin.com/in/alexjohnson

PROFESSIONAL SUMMARY
Detail-oriented Full Stack Developer with 4+ years of experience building responsive web applications using React, Node.js, and TypeScript. Passionate about clean code, user experience, and solving complex problems with elegant solutions.

WORK EXPERIENCE
Senior Frontend Developer | TechCorp Inc. | 2021-Present
• Led development of customer portal that improved client retention by 25%
• Refactored legacy code base reducing load time by 40% and improving maintainability
• Mentored 3 junior developers through code reviews and pair programming
• Implemented CI/CD pipeline reducing deployment time by 65%

Web Developer | InnovateSoft | 2019-2021
• Developed responsive web applications for clients across financial and healthcare sectors
• Built RESTful APIs with Node.js and Express to power data-driven applications
• Collaborated with UX team to implement pixel-perfect designs with high accessibility standards
• Participated in Agile development process including daily stand-ups and sprint planning

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2015-2019
• GPA: 3.8/4.0
• Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems

SKILLS
• Languages: JavaScript, TypeScript, HTML5, CSS3, SQL
• Frameworks & Libraries: React, Redux, Node.js, Express, Jest, React Testing Library
• Tools & Platforms: Git, AWS, Docker, Webpack, Figma
• Soft Skills: Problem Solving, Team Leadership, Agile Methodologies, Technical Writing

PROJECTS
E-commerce Platform Redesign | 2021
• Architected and implemented scalable front-end using React and Redux
• Achieved 99/100 Lighthouse performance score through optimizations
• Integrated payment processing with Stripe API

Community Health Tracker | 2020
• Created mobile-responsive dashboard to visualize public health data
• Implemented data visualization using D3.js
• Open-source project with 500+ GitHub stars

CERTIFICATIONS
• AWS Certified Developer – Associate | 2022
• Google Professional Cloud Developer | 2021
• MongoDB Certified Developer | 2020
`
};

// Sample job position for optimization
export const sampleJobPosition = {
  title: "Senior Frontend Developer",
  description: `
  We are seeking an experienced Senior Frontend Developer to join our team. The ideal candidate will have strong experience with React, state management, and modern JavaScript practices.
  
  Responsibilities:
  - Develop new user-facing features using React.js
  - Build reusable components and front-end libraries for future use
  - Translate designs and wireframes into high-quality code
  - Optimize components for maximum performance
  - Coordinate with various stakeholders in the product development process
  
  Requirements:
  - 3+ years experience with React.js
  - Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model
  - Thorough understanding of React.js and its core principles
  - Experience with popular React workflows (such as Redux)
  - Familiarity with RESTful APIs and modern authorization mechanisms
  - Knowledge of modern front-end build pipelines and tools
  - Experience with common front-end development tools such as Babel, Webpack, npm, etc.
  - Good understanding of asynchronous request handling and partial page updates
  
  Nice to have:
  - Experience with TypeScript
  - Knowledge of isomorphic React
  - Familiarity with modern front-end testing libraries
  - Understanding of CI/CD principles
  - Experience with AWS or other cloud platforms
  `
};

// Import sample analysis from resume-analysis.ts
export { sampleAnalysis } from './resume-analysis';