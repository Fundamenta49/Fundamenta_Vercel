import { useState, useEffect } from 'react';
import { getStateTaxRates, getStateSalesTaxRates } from '@/services/fred-api';

// Define the structure of our tax data
interface StateTaxData {
  stateCode: string;
  stateName: string;
  incomeTaxRate: number | null;
  salesTaxRate: number | null;
  hasIncomeTax: boolean;
}

// Map of state codes to state names
const stateNames: Record<string, string> = {
  'al': 'Alabama',
  'ak': 'Alaska',
  'az': 'Arizona',
  'ar': 'Arkansas',
  'ca': 'California',
  'co': 'Colorado',
  'ct': 'Connecticut',
  'de': 'Delaware',
  'fl': 'Florida',
  'ga': 'Georgia',
  'hi': 'Hawaii',
  'id': 'Idaho',
  'il': 'Illinois',
  'in': 'Indiana',
  'ia': 'Iowa',
  'ks': 'Kansas',
  'ky': 'Kentucky',
  'la': 'Louisiana',
  'me': 'Maine',
  'md': 'Maryland',
  'ma': 'Massachusetts',
  'mi': 'Michigan',
  'mn': 'Minnesota',
  'ms': 'Mississippi',
  'mo': 'Missouri',
  'mt': 'Montana',
  'ne': 'Nebraska',
  'nv': 'Nevada',
  'nh': 'New Hampshire',
  'nj': 'New Jersey',
  'nm': 'New Mexico',
  'ny': 'New York',
  'nc': 'North Carolina',
  'nd': 'North Dakota',
  'oh': 'Ohio',
  'ok': 'Oklahoma',
  'or': 'Oregon',
  'pa': 'Pennsylvania',
  'ri': 'Rhode Island',
  'sc': 'South Carolina',
  'sd': 'South Dakota',
  'tn': 'Tennessee',
  'tx': 'Texas',
  'ut': 'Utah',
  'vt': 'Vermont',
  'va': 'Virginia',
  'wa': 'Washington',
  'wv': 'West Virginia',
  'wi': 'Wisconsin',
  'wy': 'Wyoming',
  'dc': 'District of Columbia'
};

// States known to have no income tax
const noIncomeTaxStates = ['ak', 'fl', 'nv', 'sd', 'tx', 'wa', 'wy'];

export function useStateTaxData() {
  const [stateData, setStateData] = useState<Record<string, StateTaxData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTaxData() {
      try {
        setLoading(true);
        
        // Initialize data with default values for all states
        const initialData: Record<string, StateTaxData> = {};
        
        // Initialize all states with default data
        Object.entries(stateNames).forEach(([code, name]) => {
          initialData[code] = {
            stateCode: code,
            stateName: name,
            incomeTaxRate: null,
            salesTaxRate: null,
            hasIncomeTax: !noIncomeTaxStates.includes(code)
          };
        });

        // Get FRED data for state income tax rates
        const incomeTaxData = await getStateTaxRates();
        const salesTaxData = await getStateSalesTaxRates();
        
        // We will process the actual data here when available

        setStateData(initialData);
        setLoading(false);
      } catch (err) {
        console.error('Error in useStateTaxData:', err);
        setError('Failed to load state tax data');
        setLoading(false);
      }
    }

    fetchTaxData();
  }, []);

  // If we haven't loaded data yet, fall back to our existing data
  if (loading && Object.keys(stateData).length === 0) {
    // Return default data for the main states we care about
    const defaultData: Record<string, StateTaxData> = {
      ny: {
        stateCode: 'ny',
        stateName: 'New York',
        incomeTaxRate: 6.85,
        salesTaxRate: 4.0,
        hasIncomeTax: true
      },
      ca: {
        stateCode: 'ca',
        stateName: 'California',
        incomeTaxRate: 9.3,
        salesTaxRate: 7.25,
        hasIncomeTax: true
      },
      tx: {
        stateCode: 'tx',
        stateName: 'Texas',
        incomeTaxRate: 0,
        salesTaxRate: 6.25,
        hasIncomeTax: false
      },
      fl: {
        stateCode: 'fl',
        stateName: 'Florida',
        incomeTaxRate: 0,
        salesTaxRate: 6.0,
        hasIncomeTax: false
      }
    };
    return { stateData: defaultData, loading, error };
  }

  return { stateData, loading, error };
}