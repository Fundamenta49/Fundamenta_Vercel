import axios from "axios";

interface JobSearchParams {
  query: string;
  location: string;
  sources: string[];
}

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  source: string;
  postedDate: string;
}

// Sample job database with various categories
const sampleJobs = [
  // Tech Jobs
  {
    category: "software",
    jobs: [
      {
        title: "Full Stack Developer",
        company: "Tech Solutions Inc",
        description: "Looking for a full stack developer with experience in React and Node.js...",
        salary: "$90,000 - $130,000"
      },
      {
        title: "Frontend Engineer",
        company: "Web Innovations",
        description: "Join our team building modern web applications...",
        salary: "$85,000 - $120,000"
      }
    ]
  },
  // Chef Jobs
  {
    category: "chef",
    jobs: [
      {
        title: "Executive Chef",
        company: "Gourmet Restaurant Group",
        description: "Leading kitchen operations and menu development...",
        salary: "$65,000 - $85,000"
      },
      {
        title: "Sous Chef",
        company: "Fine Dining Co",
        description: "Assisting in kitchen management and food preparation...",
        salary: "$45,000 - $60,000"
      }
    ]
  },
  // Marketing Jobs
  {
    category: "marketing",
    jobs: [
      {
        title: "Digital Marketing Manager",
        company: "Brand Solutions",
        description: "Managing digital marketing campaigns and strategy...",
        salary: "$70,000 - $95,000"
      },
      {
        title: "Content Strategist",
        company: "Media Group",
        description: "Developing and executing content marketing strategies...",
        salary: "$60,000 - $80,000"
      }
    ]
  }
];

function matchJobToSearch(searchQuery: string): string {
  // Normalize search query
  const query = searchQuery.toLowerCase();

  // Map common search terms to job categories
  if (query.includes("chef") || query.includes("cook") || query.includes("kitchen")) {
    return "chef";
  }
  if (query.includes("dev") || query.includes("software") || query.includes("engineer") || query.includes("programming")) {
    return "software";
  }
  if (query.includes("market") || query.includes("content") || query.includes("brand")) {
    return "marketing";
  }

  // Default to software if no match found
  return "software";
}

async function searchIndeed(query: string, location: string): Promise<JobListing[]> {
  try {
    const category = matchJobToSearch(query);
    const categoryJobs = sampleJobs.find(c => c.category === category)?.jobs || [];

    return categoryJobs.map((job, index) => ({
      id: `indeed-${index}`,
      title: job.title,
      company: job.company,
      location: location, // Use the provided location
      description: job.description,
      salary: job.salary,
      url: `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`,
      source: 'Indeed',
      postedDate: ['Just posted', '1 day ago', '2 days ago', '3 days ago'][Math.floor(Math.random() * 4)]
    }));
  } catch (error) {
    console.error("Error searching Indeed:", error);
    return [];
  }
}

async function searchLinkedIn(query: string, location: string): Promise<JobListing[]> {
  try {
    const category = matchJobToSearch(query);
    const categoryJobs = sampleJobs.find(c => c.category === category)?.jobs || [];

    return categoryJobs.map((job, index) => ({
      id: `linkedin-${index}`,
      title: job.title,
      company: job.company,
      location: location,
      description: job.description,
      salary: job.salary,
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`,
      source: 'LinkedIn',
      postedDate: ['Today', '2 days ago', '3 days ago', '4 days ago'][Math.floor(Math.random() * 4)]
    }));
  } catch (error) {
    console.error("Error searching LinkedIn:", error);
    return [];
  }
}

async function searchZipRecruiter(query: string, location: string): Promise<JobListing[]> {
  try {
    const category = matchJobToSearch(query);
    const categoryJobs = sampleJobs.find(c => c.category === category)?.jobs || [];

    return categoryJobs.map((job, index) => ({
      id: `ziprecruiter-${index}`,
      title: job.title,
      company: job.company,
      location: location,
      description: job.description,
      salary: job.salary,
      url: `https://www.ziprecruiter.com/candidate/search?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`,
      source: 'ZipRecruiter',
      postedDate: ['Today', '1 week ago', '2 weeks ago', '3 weeks ago'][Math.floor(Math.random() * 4)]
    }));
  } catch (error) {
    console.error("Error searching ZipRecruiter:", error);
    return [];
  }
}

export async function searchJobs(params: JobSearchParams): Promise<JobListing[]> {
  const { query, location, sources } = params;
  const searchPromises: Promise<JobListing[]>[] = [];

  if (sources.includes('indeed')) {
    searchPromises.push(searchIndeed(query, location));
  }
  if (sources.includes('linkedin')) {
    searchPromises.push(searchLinkedIn(query, location));
  }
  if (sources.includes('ziprecruiter')) {
    searchPromises.push(searchZipRecruiter(query, location));
  }

  const results = await Promise.allSettled(searchPromises);
  const jobs = results
    .filter((result): result is PromiseFulfilledResult<JobListing[]> => result.status === 'fulfilled')
    .map(result => result.value)
    .flat();

  return jobs;
}