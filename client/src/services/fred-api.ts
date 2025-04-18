import axios from 'axios';

// FRED API configuration
const FRED_API_KEY = import.meta.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

// FRED Series IDs for mortgage rates
const MORTGAGE_SERIES = {
  thirtyYearFixed: 'MORTGAGE30US',
  fifteenYearFixed: 'MORTGAGE15US'
};

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

/**
 * Get current mortgage rates from FRED API
 * Returns the latest 30-year and 15-year fixed mortgage rates
 */
export async function getMortgageRates() {
  try {
    // Get the 30-year fixed mortgage rate
    const thirtyYearResponse = await axios.get(`${FRED_BASE_URL}/series/observations`, {
      params: {
        api_key: FRED_API_KEY,
        series_id: MORTGAGE_SERIES.thirtyYearFixed,
        sort_order: 'desc',
        limit: 1,
        file_type: 'json'
      }
    });
    
    // Get the 15-year fixed mortgage rate
    const fifteenYearResponse = await axios.get(`${FRED_BASE_URL}/series/observations`, {
      params: {
        api_key: FRED_API_KEY,
        series_id: MORTGAGE_SERIES.fifteenYearFixed,
        sort_order: 'desc',
        limit: 1,
        file_type: 'json'
      }
    });
    
    // Extract rates from responses
    const thirtyYearRate = thirtyYearResponse.data.observations?.[0]?.value;
    const fifteenYearRate = fifteenYearResponse.data.observations?.[0]?.value;
    
    return {
      thirtyYearFixed: {
        rate: thirtyYearRate ? parseFloat(thirtyYearRate) : 6.5,
        date: thirtyYearResponse.data.observations?.[0]?.date || new Date().toISOString().split('T')[0]
      },
      fifteenYearFixed: {
        rate: fifteenYearRate ? parseFloat(fifteenYearRate) : 5.75,
        date: fifteenYearResponse.data.observations?.[0]?.date || new Date().toISOString().split('T')[0]
      }
    };
  } catch (error) {
    console.error('Error fetching mortgage rates from FRED:', error);
    // Return fallback rates if API fails
    return {
      thirtyYearFixed: {
        rate: 6.5,
        date: new Date().toISOString().split('T')[0]
      },
      fifteenYearFixed: {
        rate: 5.75,
        date: new Date().toISOString().split('T')[0]
      }
    };
  }
}