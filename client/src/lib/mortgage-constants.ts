// Default values for mortgage calculations
export const DEFAULT_HOME_PRICE = 400000;
export const DEFAULT_DOWN_PAYMENT_PERCENT = 20;
export const DEFAULT_INTEREST_RATE = 6.5;
export const DEFAULT_LOAN_TERM = 30;
export const DEFAULT_PMI_RATE = 0.5;
export const DEFAULT_HOME_INSURANCE_RATE = 0.35;
export const DEFAULT_HOME_MAINTENANCE = 1;
export const DEFAULT_HOA_MONTHLY = 0;
export const DEFAULT_UTILITIES = 300;
export const DEFAULT_STATE = "CA";

// State data interface
export interface StateData {
  name: string;
  propertyTaxRate: number; // percentage annually
  transferTaxRate: number; // percentage of home price
  recordingFees: number; // flat fee
  abbreviation: string;
}

// State data for all 50 states + DC
export const STATE_DATA: { [key: string]: StateData } = {
  "AL": { name: "Alabama", propertyTaxRate: 0.41, transferTaxRate: 0.1, recordingFees: 100, abbreviation: "AL" },
  "AK": { name: "Alaska", propertyTaxRate: 1.19, transferTaxRate: 0, recordingFees: 150, abbreviation: "AK" },
  "AZ": { name: "Arizona", propertyTaxRate: 0.62, transferTaxRate: 0, recordingFees: 100, abbreviation: "AZ" },
  "AR": { name: "Arkansas", propertyTaxRate: 0.62, transferTaxRate: 0.33, recordingFees: 75, abbreviation: "AR" },
  "CA": { name: "California", propertyTaxRate: 0.73, transferTaxRate: 0.11, recordingFees: 225, abbreviation: "CA" },
  "CO": { name: "Colorado", propertyTaxRate: 0.51, transferTaxRate: 0.01, recordingFees: 125, abbreviation: "CO" },
  "CT": { name: "Connecticut", propertyTaxRate: 2.14, transferTaxRate: 1.25, recordingFees: 175, abbreviation: "CT" },
  "DE": { name: "Delaware", propertyTaxRate: 0.57, transferTaxRate: 1.5, recordingFees: 100, abbreviation: "DE" },
  "FL": { name: "Florida", propertyTaxRate: 0.89, transferTaxRate: 0.7, recordingFees: 125, abbreviation: "FL" },
  "GA": { name: "Georgia", propertyTaxRate: 0.92, transferTaxRate: 0.1, recordingFees: 100, abbreviation: "GA" },
  "HI": { name: "Hawaii", propertyTaxRate: 0.28, transferTaxRate: 0.1, recordingFees: 125, abbreviation: "HI" },
  "ID": { name: "Idaho", propertyTaxRate: 0.69, transferTaxRate: 0, recordingFees: 100, abbreviation: "ID" },
  "IL": { name: "Illinois", propertyTaxRate: 2.27, transferTaxRate: 0.1, recordingFees: 150, abbreviation: "IL" },
  "IN": { name: "Indiana", propertyTaxRate: 0.85, transferTaxRate: 0, recordingFees: 100, abbreviation: "IN" },
  "IA": { name: "Iowa", propertyTaxRate: 1.53, transferTaxRate: 0.16, recordingFees: 100, abbreviation: "IA" },
  "KS": { name: "Kansas", propertyTaxRate: 1.41, transferTaxRate: 0, recordingFees: 125, abbreviation: "KS" },
  "KY": { name: "Kentucky", propertyTaxRate: 0.86, transferTaxRate: 0.1, recordingFees: 100, abbreviation: "KY" },
  "LA": { name: "Louisiana", propertyTaxRate: 0.55, transferTaxRate: 0, recordingFees: 125, abbreviation: "LA" },
  "ME": { name: "Maine", propertyTaxRate: 1.3, transferTaxRate: 0.44, recordingFees: 100, abbreviation: "ME" },
  "MD": { name: "Maryland", propertyTaxRate: 1.09, transferTaxRate: 0.5, recordingFees: 150, abbreviation: "MD" },
  "MA": { name: "Massachusetts", propertyTaxRate: 1.17, transferTaxRate: 0.46, recordingFees: 175, abbreviation: "MA" },
  "MI": { name: "Michigan", propertyTaxRate: 1.54, transferTaxRate: 0.86, recordingFees: 100, abbreviation: "MI" },
  "MN": { name: "Minnesota", propertyTaxRate: 1.12, transferTaxRate: 0.33, recordingFees: 100, abbreviation: "MN" },
  "MS": { name: "Mississippi", propertyTaxRate: 0.8, transferTaxRate: 0, recordingFees: 100, abbreviation: "MS" },
  "MO": { name: "Missouri", propertyTaxRate: 0.97, transferTaxRate: 0, recordingFees: 125, abbreviation: "MO" },
  "MT": { name: "Montana", propertyTaxRate: 0.84, transferTaxRate: 0, recordingFees: 100, abbreviation: "MT" },
  "NE": { name: "Nebraska", propertyTaxRate: 1.73, transferTaxRate: 0.23, recordingFees: 100, abbreviation: "NE" },
  "NV": { name: "Nevada", propertyTaxRate: 0.69, transferTaxRate: 0.25, recordingFees: 125, abbreviation: "NV" },
  "NH": { name: "New Hampshire", propertyTaxRate: 2.18, transferTaxRate: 0.75, recordingFees: 125, abbreviation: "NH" },
  "NJ": { name: "New Jersey", propertyTaxRate: 2.49, transferTaxRate: 1, recordingFees: 150, abbreviation: "NJ" },
  "NM": { name: "New Mexico", propertyTaxRate: 0.78, transferTaxRate: 0, recordingFees: 100, abbreviation: "NM" },
  "NY": { name: "New York", propertyTaxRate: 1.72, transferTaxRate: 0.4, recordingFees: 200, abbreviation: "NY" },
  "NC": { name: "North Carolina", propertyTaxRate: 0.84, transferTaxRate: 0.2, recordingFees: 125, abbreviation: "NC" },
  "ND": { name: "North Dakota", propertyTaxRate: 0.98, transferTaxRate: 0, recordingFees: 100, abbreviation: "ND" },
  "OH": { name: "Ohio", propertyTaxRate: 1.56, transferTaxRate: 0.1, recordingFees: 125, abbreviation: "OH" },
  "OK": { name: "Oklahoma", propertyTaxRate: 0.9, transferTaxRate: 0, recordingFees: 100, abbreviation: "OK" },
  "OR": { name: "Oregon", propertyTaxRate: 1.04, transferTaxRate: 0.1, recordingFees: 125, abbreviation: "OR" },
  "PA": { name: "Pennsylvania", propertyTaxRate: 1.58, transferTaxRate: 1, recordingFees: 150, abbreviation: "PA" },
  "RI": { name: "Rhode Island", propertyTaxRate: 1.63, transferTaxRate: 0.46, recordingFees: 125, abbreviation: "RI" },
  "SC": { name: "South Carolina", propertyTaxRate: 0.57, transferTaxRate: 0.37, recordingFees: 100, abbreviation: "SC" },
  "SD": { name: "South Dakota", propertyTaxRate: 1.22, transferTaxRate: 0.1, recordingFees: 100, abbreviation: "SD" },
  "TN": { name: "Tennessee", propertyTaxRate: 0.72, transferTaxRate: 0.37, recordingFees: 100, abbreviation: "TN" },
  "TX": { name: "Texas", propertyTaxRate: 1.8, transferTaxRate: 0, recordingFees: 125, abbreviation: "TX" },
  "UT": { name: "Utah", propertyTaxRate: 0.66, transferTaxRate: 0, recordingFees: 100, abbreviation: "UT" },
  "VT": { name: "Vermont", propertyTaxRate: 1.9, transferTaxRate: 0.5, recordingFees: 125, abbreviation: "VT" },
  "VA": { name: "Virginia", propertyTaxRate: 0.8, transferTaxRate: 0.33, recordingFees: 150, abbreviation: "VA" },
  "WA": { name: "Washington", propertyTaxRate: 0.98, transferTaxRate: 1.28, recordingFees: 175, abbreviation: "WA" },
  "WV": { name: "West Virginia", propertyTaxRate: 0.59, transferTaxRate: 0.22, recordingFees: 100, abbreviation: "WV" },
  "WI": { name: "Wisconsin", propertyTaxRate: 1.76, transferTaxRate: 0.3, recordingFees: 125, abbreviation: "WI" },
  "WY": { name: "Wyoming", propertyTaxRate: 0.61, transferTaxRate: 0, recordingFees: 100, abbreviation: "WY" },
  "DC": { name: "District of Columbia", propertyTaxRate: 0.56, transferTaxRate: 1.1, recordingFees: 200, abbreviation: "DC" }
};