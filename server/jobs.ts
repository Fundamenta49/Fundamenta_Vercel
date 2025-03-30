import axios from "axios";

interface JobSearchParams {
  query: string;
  location: string;
  sources: string[];
}

// Adzuna API configuration
const ADZUNA_APP_ID = "7ba9c479";
const ADZUNA_API_KEY = "c894381ecbd744724a26d3bcecc849d7";
const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs";

// Debug log for API credentials
console.log("Adzuna API credentials:", {
  appId: ADZUNA_APP_ID ? "[set]" : "[not set]",
  apiKey: ADZUNA_API_KEY ? "[set]" : "[not set]",
});

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

/**
 * Search for jobs using the Adzuna API
 * @param query Job title or keywords
 * @param location Location for the job search
 * @returns List of job listings from Adzuna
 */
async function searchAdzuna(query: string, location: string): Promise<JobListing[]> {
  try {
    if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
      console.error("Adzuna API credentials not found. Please check your environment variables.");
      return [];
    }

    // Determine country code for API URL (default to 'us')
    let countryCode = 'us';
    // Map common locations to country codes
    const locationLower = location.toLowerCase();
    if (locationLower.includes('uk') || locationLower.includes('united kingdom') || locationLower.includes('england') || 
        locationLower.includes('scotland') || locationLower.includes('wales') || locationLower.includes('london')) {
      countryCode = 'gb';
    } else if (locationLower.includes('canada') || locationLower.includes('toronto') || locationLower.includes('vancouver')) {
      countryCode = 'ca';
    } else if (locationLower.includes('australia') || locationLower.includes('sydney') || locationLower.includes('melbourne')) {
      countryCode = 'au';
    } else if (locationLower.includes('germany') || locationLower.includes('berlin') || locationLower.includes('munich')) {
      countryCode = 'de';
    } else if (locationLower.includes('france') || locationLower.includes('paris') || locationLower.includes('lyon')) {
      countryCode = 'fr';
    }
    
    // Construct the API URL
    const url = `${ADZUNA_BASE_URL}/${countryCode}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=10&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`;
    
    const response = await axios.get(url);
    
    if (response.status !== 200) {
      throw new Error(`Adzuna API returned status ${response.status}`);
    }
    
    const data = response.data;
    
    if (!data.results || !Array.isArray(data.results)) {
      console.warn("Adzuna API returned unexpected data format:", data);
      return [];
    }
    
    // Map Adzuna job data to our JobListing interface
    return data.results.map((job: any) => {
      // Format date (Adzuna provides date in ISO format)
      const postedDate = new Date(job.created);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - postedDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      let formattedDate = 'Today';
      if (diffDays === 1) {
        formattedDate = 'Yesterday';
      } else if (diffDays > 1) {
        formattedDate = `${diffDays} days ago`;
      }
      
      // Format salary if available
      let formattedSalary: string | undefined = undefined;
      if (job.salary_min && job.salary_max) {
        const currencySymbol = job.salary_is_predicted === 1 ? 'Est. ' : '';
        formattedSalary = `${currencySymbol}${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.salary_is_predicted === 1 ? '(predicted)' : ''}`;
      }
      
      return {
        id: job.id,
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        salary: formattedSalary,
        url: job.redirect_url,
        source: 'Adzuna',
        postedDate: formattedDate
      };
    });
  } catch (error) {
    console.error("Error searching Adzuna:", error);
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
  if (sources.includes('adzuna')) {
    searchPromises.push(searchAdzuna(query, location));
  }

  const results = await Promise.allSettled(searchPromises);
  const jobs = results
    .filter((result): result is PromiseFulfilledResult<JobListing[]> => result.status === 'fulfilled')
    .map(result => result.value)
    .flat();

  return jobs;
}