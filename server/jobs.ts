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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    $('.job_seen_beacon').each((i: number, element: cheerio.Element) => {
      const title = $(element).find('.jobTitle').text().trim();
      const company = $(element).find('.companyName').text().trim();
      const location = $(element).find('.companyLocation').text().trim();
      const description = $(element).find('.job-snippet').text().trim();
      const salary = $(element).find('.salary-snippet').text().trim();
      const url = 'https://www.indeed.com' + $(element).find('a').attr('href');
      const postedDate = $(element).find('.date').text().trim();

      jobs.push({
        id: `indeed-${i}`,
        title,
        company,
        location,
        description,
        salary: salary || undefined,
        url,
        source: 'Indeed',
        postedDate: postedDate || new Date().toLocaleDateString()
      });
    });

    return jobs;
  } catch (error) {
    console.error("Error searching Indeed:", error);
    return [];
  }
}

async function searchLinkedIn(query: string, location: string): Promise<JobListing[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const encodedLocation = encodeURIComponent(location);
    const url = `https://www.linkedin.com/jobs/search?keywords=${encodedQuery}&location=${encodedLocation}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    $('.jobs-search__results-list li').each((i: number, element: cheerio.Element) => {
      const title = $(element).find('.base-search-card__title').text().trim();
      const company = $(element).find('.base-search-card__subtitle').text().trim();
      const location = $(element).find('.job-search-card__location').text().trim();
      const description = $(element).find('.base-search-card__metadata').text().trim();
      const url = $(element).find('a').attr('href') || '';
      const postedDate = $(element).find('time').text().trim();

      jobs.push({
        id: `linkedin-${i}`,
        title,
        company,
        location,
        description,
        url,
        source: 'LinkedIn',
        postedDate: postedDate || new Date().toLocaleDateString()
      });
    });

    return jobs;
  } catch (error) {
    console.error("Error searching LinkedIn:", error);
    return [];
  }
}

async function searchZipRecruiter(query: string, location: string): Promise<JobListing[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const encodedLocation = encodeURIComponent(location);
    const url = `https://www.ziprecruiter.com/jobs-search?q=${encodedQuery}&l=${encodedLocation}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const jobs: JobListing[] = [];

    $('.job_content').each((i: number, element: cheerio.Element) => {
      const title = $(element).find('.job_title').text().trim();
      const company = $(element).find('.hiring_company').text().trim();
      const location = $(element).find('.location').text().trim();
      const description = $(element).find('.job_description').text().trim();
      const url = $(element).find('a.job_link').attr('href') || '';
      const postedDate = $(element).find('.posted_date').text().trim();

      jobs.push({
        id: `ziprecruiter-${i}`,
        title,
        company,
        location,
        description,
        url,
        source: 'ZipRecruiter',
        postedDate: postedDate || new Date().toLocaleDateString()
      });
    });

    return jobs;
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