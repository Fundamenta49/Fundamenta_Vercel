import axios from "axios";
import * as cheerio from "cheerio";

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
    const encodedQuery = encodeURIComponent(query);
    const encodedLocation = encodeURIComponent(location);
    const url = `https://www.indeed.com/jobs?q=${encodedQuery}&l=${encodedLocation}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.indeed.com',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    // Updated selector based on Indeed's current HTML structure
    $('.job_seen_beacon, .jobsearch-ResultsList .result').each((i: number, element: cheerio.Element) => {
      try {
        const title = $(element).find('[class*="jobTitle"], .title').text().trim();
        const company = $(element).find('[class*="companyName"], .company').text().trim();
        const location = $(element).find('[class*="companyLocation"], .location').text().trim();
        const description = $(element).find('[class*="job-snippet"], .summary').text().trim();
        const salary = $(element).find('[class*="salary-snippet"], .salaryText').text().trim();
        const url = $(element).find('a[class*="jcs-JobTitle"], a.jobtitle').attr('href');
        const postedDate = $(element).find('[class*="date"], .date').text().trim();

        if (title && company) {
          jobs.push({
            id: `indeed-${i}`,
            title,
            company,
            location,
            description,
            salary: salary || undefined,
            url: url ? `https://www.indeed.com${url}` : `https://www.indeed.com/jobs?q=${encodedQuery}&l=${encodedLocation}`,
            source: 'Indeed',
            postedDate: postedDate || 'Recently posted'
          });
        }
      } catch (err) {
        console.error(`Error parsing Indeed job listing ${i}:`, err);
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error searching Indeed:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response headers:", error.response?.headers);
    }
    return [];
  }
}

async function searchLinkedIn(query: string, location: string): Promise<JobListing[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const encodedLocation = encodeURIComponent(location);
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodedQuery}&location=${encodedLocation}&position=1&pageNum=0`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.linkedin.com/jobs',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    $('.job-search-card').each((i: number, element: cheerio.Element) => {
      try {
        const title = $(element).find('.job-search-card__title').text().trim();
        const company = $(element).find('.job-search-card__company-name').text().trim();
        const location = $(element).find('.job-search-card__location').text().trim();
        const description = $(element).find('.job-search-card__snippet').text().trim();
        const url = $(element).find('a.job-search-card__link').attr('href');
        const postedDate = $(element).find('time').text().trim();

        if (title && company) {
          jobs.push({
            id: `linkedin-${i}`,
            title,
            company,
            location,
            description,
            url: url || `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=${encodedLocation}`,
            source: 'LinkedIn',
            postedDate: postedDate || 'Recently posted'
          });
        }
      } catch (err) {
        console.error(`Error parsing LinkedIn job listing ${i}:`, err);
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error searching LinkedIn:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response headers:", error.response?.headers);
    }
    return [];
  }
}

async function searchZipRecruiter(query: string, location: string): Promise<JobListing[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const encodedLocation = encodeURIComponent(location);
    const url = `https://www.ziprecruiter.com/candidate/search?search=${encodedQuery}&location=${encodedLocation}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.ziprecruiter.com',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    $('.job_result').each((i: number, element: cheerio.Element) => {
      try {
        const title = $(element).find('.just_job_title').text().trim();
        const company = $(element).find('.hiring_company').text().trim();
        const location = $(element).find('.location').text().trim();
        const description = $(element).find('.job_description').text().trim();
        const url = $(element).find('a.job_link').attr('href');
        const postedDate = $(element).find('.job_age').text().trim();

        if (title && company) {
          jobs.push({
            id: `ziprecruiter-${i}`,
            title,
            company,
            location,
            description,
            url: url || `https://www.ziprecruiter.com/candidate/search?search=${encodedQuery}&location=${encodedLocation}`,
            source: 'ZipRecruiter',
            postedDate: postedDate || 'Recently posted'
          });
        }
      } catch (err) {
        console.error(`Error parsing ZipRecruiter job listing ${i}:`, err);
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error searching ZipRecruiter:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response headers:", error.response?.headers);
    }
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

  // Add a delay between requests to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 1000));

  return jobs;
}