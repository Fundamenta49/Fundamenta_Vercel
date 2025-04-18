// FRED API service for fetching economic data

// Base URL for the FRED API
const API_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

// Function to get the latest value for any FRED series
export const getSeriesLatestValue = async (seriesId: string): Promise<number> => {
  try {
    const result = await fetchFREDData(seriesId);
    return parseFloat(result) || 0;
  } catch (error) {
    console.error(`Error fetching latest value for ${seriesId}:`, error);
    return 0;
  }
};

// Helper function to fetch data from FRED API
const fetchFREDData = async (seriesId: string) => {
  // We're using environment variable for the API key
  const apiKey = process.env.FRED_API_KEY || import.meta.env.VITE_FRED_API_KEY;
  
  if (!apiKey) {
    throw new Error('FRED API key is not configured.');
  }
  
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
    sort_order: 'desc',
    limit: '1'  // Just get the most recent value
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`FRED API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.observations?.[0]?.value || null;
  } catch (error) {
    console.error('Error fetching FRED data:', error);
    throw error;
  }
};

// Series IDs for different economic indicators
// Tax rate series IDs
const SERIES_IDS = {
  // Federal tax rates
  FEDERAL_INCOME_TAX: 'FEDFUNDS', // Using fed funds rate as placeholder, would need actual tax rate series
  
  // Mortgage rates
  MORTGAGE_30YR: 'MORTGAGE30US',
  MORTGAGE_15YR: 'MORTGAGE15US',
  
  // State-specific tax rates would be specific to each state
  // Currently FRED doesn't have direct state tax rate data in an easily accessible format
};

// Function to get federal tax rates
export const getFederalTaxRates = async () => {
  try {
    const federalRate = await fetchFREDData(SERIES_IDS.FEDERAL_INCOME_TAX);
    return parseFloat(federalRate) || 0;
  } catch (error) {
    console.error('Error fetching federal tax rates:', error);
    return 0; // Return 0 if unable to fetch
  }
};

// Function to get current mortgage rates
export const getMortgageRates = async () => {
  try {
    const [thirtyYearRate, fifteenYearRate] = await Promise.all([
      fetchFREDData(SERIES_IDS.MORTGAGE_30YR),
      fetchFREDData(SERIES_IDS.MORTGAGE_15YR)
    ]);
    
    return {
      thirtyYearFixed: {
        rate: parseFloat(thirtyYearRate) || 6.5, // Default to 6.5% if unable to fetch
        lastUpdated: new Date().toISOString()
      },
      fifteenYearFixed: {
        rate: parseFloat(fifteenYearRate) || 5.75, // Default to 5.75% if unable to fetch
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching mortgage rates:', error);
    // Return reasonable defaults if unable to fetch
    return {
      thirtyYearFixed: {
        rate: 6.5,
        lastUpdated: new Date().toISOString()
      },
      fifteenYearFixed: {
        rate: 5.75,
        lastUpdated: new Date().toISOString()
      }
    };
  }
};

// Function to get state tax rates
// This would be incomplete since FRED doesn't have comprehensive state tax data
export const getStateTaxRates = async () => {
  // In a real implementation, this would fetch state-specific tax data
  // Since we can't easily get tax data from FRED, we'll return an empty array
  // Real implementation would need to use a different data source or specific FRED series for each state
  
  try {
    // Return an empty array as if we queried the API and found no series
    return [];
  } catch (error) {
    console.error(`Error fetching tax rates:`, error);
    return [];
  }
};

// Function to get state sales tax rates
export const getStateSalesTaxRates = async () => {
  // Similar to income tax, return an empty array as placeholder
  try {
    // Return an empty array as if we queried the API and found no series
    return [];
  } catch (error) {
    console.error(`Error fetching sales tax rates:`, error);
    return [];
  }
};