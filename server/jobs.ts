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

async function searchIndeed(query: string, location: string): Promise<JobListing[]> {
  try {
    // For demonstration, return sample jobs until we implement proper API access
    return [
      {
        id: 'indeed-1',
        title: 'Software Developer',
        company: 'Tech Corp',
        location: location,
        description: 'Looking for an experienced software developer...',
        salary: '$80,000 - $120,000',
        url: `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`,
        source: 'Indeed',
        postedDate: 'Just posted'
      },
      {
        id: 'indeed-2',
        title: 'Senior Engineer',
        company: 'Innovation Labs',
        location: location,
        description: 'Senior position for an experienced engineer...',
        salary: '$100,000 - $150,000',
        url: `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`,
        source: 'Indeed',
        postedDate: '2 days ago'
      }
    ];
  } catch (error) {
    console.error("Error searching Indeed:", error);
    return [];
  }
}

async function searchLinkedIn(query: string, location: string): Promise<JobListing[]> {
  try {
    // For demonstration, return sample jobs until we implement proper API access
    return [
      {
        id: 'linkedin-1',
        title: 'Product Manager',
        company: 'StartUp Inc',
        location: location,
        description: 'Seeking an experienced product manager...',
        salary: '$90,000 - $130,000',
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`,
        source: 'LinkedIn',
        postedDate: '1 day ago'
      },
      {
        id: 'linkedin-2',
        title: 'UX Designer',
        company: 'Design Studio',
        location: location,
        description: 'Looking for a creative UX designer...',
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`,
        source: 'LinkedIn',
        postedDate: '3 days ago'
      }
    ];
  } catch (error) {
    console.error("Error searching LinkedIn:", error);
    return [];
  }
}

async function searchZipRecruiter(query: string, location: string): Promise<JobListing[]> {
  try {
    // For demonstration, return sample jobs until we implement proper API access
    return [
      {
        id: 'ziprecruiter-1',
        title: 'Marketing Manager',
        company: 'Marketing Pro',
        location: location,
        description: 'Experienced marketing manager needed...',
        salary: '$70,000 - $100,000',
        url: `https://www.ziprecruiter.com/candidate/search?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`,
        source: 'ZipRecruiter',
        postedDate: 'Today'
      },
      {
        id: 'ziprecruiter-2',
        title: 'Sales Representative',
        company: 'Sales Corp',
        location: location,
        description: 'Join our growing sales team...',
        url: `https://www.ziprecruiter.com/candidate/search?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`,
        source: 'ZipRecruiter',
        postedDate: '1 week ago'
      }
    ];
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