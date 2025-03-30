import axios from "axios";

interface JobSearchParams {
  query: string;
  location: string;
  industry?: string;
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

// Sample job data for when Adzuna API is not available
const sampleJobs = [
  {
    title: "Software Engineer",
    company: "Tech Solutions Inc",
    description: "We're looking for a talented software engineer to join our growing team. You'll work on cutting-edge projects using modern technologies including React, Node.js, and cloud services.",
    salary: "$90,000 - $130,000"
  },
  {
    title: "Frontend Developer",
    company: "Web Innovations",
    description: "Join our team building modern web applications. Strong knowledge of JavaScript, React, and CSS required. Experience with TypeScript and testing frameworks is a plus.",
    salary: "$85,000 - $120,000"
  },
  {
    title: "Full Stack Engineer",
    company: "Digital Products Co",
    description: "Full stack developer needed for a fast-growing startup. You'll be responsible for developing and maintaining web applications from front to back. Experience with JavaScript, React, Node.js, and databases required.",
    salary: "$95,000 - $140,000"
  },
  {
    title: "UI/UX Designer",
    company: "Creative Solutions",
    description: "Looking for a talented UI/UX designer to create beautiful and intuitive user interfaces for our digital products. Proficiency with design tools and understanding of user experience principles required.",
    salary: "$80,000 - $110,000"
  },
  {
    title: "Product Manager",
    company: "Innovate Inc",
    description: "Experienced product manager needed to lead product development from conception to launch. You'll work closely with engineering, design, and marketing teams to deliver outstanding products.",
    salary: "$100,000 - $150,000"
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

// Function to get sample job data
async function getSampleJobs(query: string, location: string, source: string): Promise<JobListing[]> {
  try {
    return sampleJobs.map((job, index) => ({
      id: `sample-${index}`,
      title: job.title,
      company: job.company,
      location: location, // Use the provided location
      description: job.description,
      salary: job.salary,
      url: `https://www.google.com/search?q=${encodeURIComponent(job.title)}+jobs+in+${encodeURIComponent(location)}`,
      source: source,
      postedDate: ['Just posted', '1 day ago', '2 days ago', '3 days ago'][Math.floor(Math.random() * 4)]
    }));
  } catch (error) {
    console.error("Error getting sample jobs:", error);
    return [];
  }
}

async function searchIndeed(query: string, location: string): Promise<JobListing[]> {
  return getSampleJobs(query, location, 'Sample');
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
  const { query, location, industry, sources } = params;
  const searchPromises: Promise<JobListing[]>[] = [];

  if (sources.includes('indeed')) {
    searchPromises.push(getSampleJobs(query, location, 'Sample'));
  }
  if (sources.includes('adzuna')) {
    searchPromises.push(searchAdzuna(query, location));
  }

  const results = await Promise.allSettled(searchPromises);
  let jobs = results
    .filter((result): result is PromiseFulfilledResult<JobListing[]> => result.status === 'fulfilled')
    .map(result => result.value)
    .flat();

  // Filter by industry if specified (and not "all")
  if (industry && industry !== 'all') {
    jobs = jobs.filter(job => {
      const jobText = `${job.title} ${job.description}`.toLowerCase();
      
      // Map industry values to keywords to search for
      const industryKeywords: Record<string, string[]> = {
        'technology': ['tech', 'software', 'developer', 'engineer', 'programming', 'IT', 'web', 'computer', 'digital'],
        'healthcare': ['health', 'medical', 'doctor', 'nurse', 'patient', 'hospital', 'care', 'clinic'],
        'finance': ['finance', 'banking', 'investment', 'financial', 'accountant', 'accounting', 'bank'],
        'education': ['education', 'teaching', 'teacher', 'school', 'university', 'college', 'professor', 'academic'],
        'retail': ['retail', 'store', 'sales', 'customer', 'shop', 'merchandise'],
        'manufacturing': ['manufacturing', 'factory', 'production', 'assembly', 'industrial', 'fabrication'],
        'hospitality': ['hospitality', 'hotel', 'restaurant', 'tourism', 'travel', 'guest', 'foodservice'],
        'marketing': ['marketing', 'media', 'advertising', 'PR', 'content', 'brand', 'social media'],
        'government': ['government', 'public sector', 'policy', 'federal', 'state', 'municipal', 'administration'],
        'nonprofit': ['nonprofit', 'charity', 'foundation', 'NGO', 'mission', 'community']
      };
      
      // Check if job text contains any of the industry keywords
      return industryKeywords[industry]?.some(keyword => jobText.includes(keyword)) || false;
    });
  }

  return jobs;
}