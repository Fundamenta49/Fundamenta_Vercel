import axios from 'axios';

// FRED API configuration
const FRED_API_KEY = import.meta.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

/**
 * Get state tax rates from FRED API
 * This function fetches the most recent state tax rate data from the 
 * Federal Reserve Economic Data (FRED)
 */
export async function getStateTaxRates() {
  try {
    // For state income tax rates, we use the FRED series "TAXRATE" with state code
    const response = await axios.get(`${FRED_BASE_URL}/series/search`, {
      params: {
        api_key: FRED_API_KEY,
        search_text: 'state individual income tax rate',
        file_type: 'json'
      }
    });

    if (response.data && response.data.seriess) {
      return response.data.seriess;
    }
    return null;
  } catch (error) {
    console.error('Error fetching state tax data from FRED:', error);
    return null;
  }
}

/**
 * Get state sales tax rates from FRED API
 */
export async function getStateSalesTaxRates() {
  try {
    const response = await axios.get(`${FRED_BASE_URL}/series/search`, {
      params: {
        api_key: FRED_API_KEY,
        search_text: 'state sales tax rate',
        file_type: 'json'
      }
    });

    if (response.data && response.data.seriess) {
      return response.data.seriess;
    }
    return null;
  } catch (error) {
    console.error('Error fetching state sales tax data from FRED:', error);
    return null;
  }
}

/**
 * Get latest value for a specific FRED series
 */
export async function getSeriesLatestValue(seriesId: string) {
  try {
    const response = await axios.get(`${FRED_BASE_URL}/series/observations`, {
      params: {
        api_key: FRED_API_KEY,
        series_id: seriesId,
        sort_order: 'desc',
        limit: 1,
        file_type: 'json'
      }
    });

    if (response.data && response.data.observations && response.data.observations.length > 0) {
      return response.data.observations[0].value;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching latest value for series ${seriesId}:`, error);
    return null;
  }
}