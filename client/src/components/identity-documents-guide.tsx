import { useState, useEffect } from "react";
import { 
  FileText, 
  Globe, 
  CreditCard, 
  AlertCircle, 
  ChevronRight, 
  Search,
  MapPin,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types
type DocumentTab = "passport" | "birth-certificate" | "social-security";
type StateCode = 
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA" 
  | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD" 
  | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ" 
  | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC" 
  | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY" 
  | "DC" | "default";

interface StateInfo {
  name: string;
  code: StateCode;
  vitalRecordsUrl: string;
  socialSecurityOffices?: {
    city: string;
    address: string;
    phone: string;
    url: string;
  }[];
}

// State information and resources
const STATES: Record<StateCode, StateInfo> = {
  "AL": {
    name: "Alabama",
    code: "AL",
    vitalRecordsUrl: "https://www.alabamapublichealth.gov/vitalrecords/",
    socialSecurityOffices: [
      {
        city: "Birmingham",
        address: "1200 Rev Abraham Woods Jr Blvd, Birmingham, AL 35285",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "AK": {
    name: "Alaska",
    code: "AK",
    vitalRecordsUrl: "https://dhss.alaska.gov/dph/VitalStats/",
  },
  "AZ": {
    name: "Arizona",
    code: "AZ",
    vitalRecordsUrl: "https://www.azdhs.gov/licensing/vital-records/",
  },
  "AR": {
    name: "Arkansas",
    code: "AR",
    vitalRecordsUrl: "https://www.healthy.arkansas.gov/programs-services/program/vital-records",
  },
  "CA": {
    name: "California",
    code: "CA",
    vitalRecordsUrl: "https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records.aspx",
    socialSecurityOffices: [
      {
        city: "Los Angeles",
        address: "4000 Wilshire Blvd, Los Angeles, CA 90010",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      },
      {
        city: "San Francisco",
        address: "560 Kearny St, San Francisco, CA 94108",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "CO": {
    name: "Colorado",
    code: "CO",
    vitalRecordsUrl: "https://cdphe.colorado.gov/vitalrecords",
  },
  "CT": {
    name: "Connecticut",
    code: "CT",
    vitalRecordsUrl: "https://portal.ct.gov/DPH/Vital-Records/State-Vital-Records-Office--Home",
  },
  "DE": {
    name: "Delaware",
    code: "DE",
    vitalRecordsUrl: "https://www.dhss.delaware.gov/dhss/dph/ss/vitalstats.html",
  },
  "FL": {
    name: "Florida",
    code: "FL",
    vitalRecordsUrl: "http://www.floridahealth.gov/certificates/",
    socialSecurityOffices: [
      {
        city: "Miami",
        address: "8345 Biscayne Blvd, Miami, FL 33138",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "GA": {
    name: "Georgia",
    code: "GA",
    vitalRecordsUrl: "https://dph.georgia.gov/vital-records",
  },
  "HI": {
    name: "Hawaii",
    code: "HI",
    vitalRecordsUrl: "https://health.hawaii.gov/vitalrecords/",
  },
  "ID": {
    name: "Idaho",
    code: "ID",
    vitalRecordsUrl: "https://healthandwelfare.idaho.gov/services-programs/vital-records",
  },
  "IL": {
    name: "Illinois",
    code: "IL",
    vitalRecordsUrl: "https://dph.illinois.gov/topics-services/birth-death-other-records.html",
    socialSecurityOffices: [
      {
        city: "Chicago",
        address: "77 W Jackson Blvd, Chicago, IL 60604",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "IN": {
    name: "Indiana",
    code: "IN",
    vitalRecordsUrl: "https://www.in.gov/health/vital-records/",
  },
  "IA": {
    name: "Iowa",
    code: "IA",
    vitalRecordsUrl: "https://idph.iowa.gov/health-statistics/vital-records",
  },
  "KS": {
    name: "Kansas",
    code: "KS",
    vitalRecordsUrl: "https://www.kdhe.ks.gov/1186/Vital-Statistics",
  },
  "KY": {
    name: "Kentucky",
    code: "KY",
    vitalRecordsUrl: "https://chfs.ky.gov/agencies/dph/dehp/vsb/",
  },
  "LA": {
    name: "Louisiana",
    code: "LA",
    vitalRecordsUrl: "https://ldh.la.gov/index.cfm/page/635",
  },
  "ME": {
    name: "Maine",
    code: "ME",
    vitalRecordsUrl: "https://www.maine.gov/dhhs/mecdc/public-health-systems/data-research/vital-records/",
  },
  "MD": {
    name: "Maryland",
    code: "MD",
    vitalRecordsUrl: "https://health.maryland.gov/vsa/",
  },
  "MA": {
    name: "Massachusetts",
    code: "MA",
    vitalRecordsUrl: "https://www.mass.gov/orgs/registry-of-vital-records-and-statistics",
    socialSecurityOffices: [
      {
        city: "Boston",
        address: "10 Causeway St, Boston, MA 02222",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "MI": {
    name: "Michigan",
    code: "MI",
    vitalRecordsUrl: "https://www.michigan.gov/mdhhs/inside-mdhhs/statisticsandreports/vitalrecords",
  },
  "MN": {
    name: "Minnesota",
    code: "MN",
    vitalRecordsUrl: "https://www.health.state.mn.us/people/vitalrecords/",
  },
  "MS": {
    name: "Mississippi",
    code: "MS",
    vitalRecordsUrl: "https://msdh.ms.gov/page/31,0,109.html",
  },
  "MO": {
    name: "Missouri",
    code: "MO",
    vitalRecordsUrl: "https://health.mo.gov/data/vitalrecords/",
  },
  "MT": {
    name: "Montana",
    code: "MT",
    vitalRecordsUrl: "https://dphhs.mt.gov/vitalrecords/",
  },
  "NE": {
    name: "Nebraska",
    code: "NE",
    vitalRecordsUrl: "https://dhhs.ne.gov/Pages/Vital-Records.aspx",
  },
  "NV": {
    name: "Nevada",
    code: "NV",
    vitalRecordsUrl: "https://dpbh.nv.gov/Programs/BirthDeath/Birth_and_Death_Vital_Records_-_Home/",
  },
  "NH": {
    name: "New Hampshire",
    code: "NH",
    vitalRecordsUrl: "https://www.dhhs.nh.gov/programs-services/health-care/bureau-vital-records",
  },
  "NJ": {
    name: "New Jersey",
    code: "NJ",
    vitalRecordsUrl: "https://www.state.nj.us/health/vital/",
    socialSecurityOffices: [
      {
        city: "Newark",
        address: "970 Broad St, Newark, NJ 07102",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "NM": {
    name: "New Mexico",
    code: "NM",
    vitalRecordsUrl: "https://www.nmhealth.org/about/erd/bvrhs/vrp/",
  },
  "NY": {
    name: "New York",
    code: "NY",
    vitalRecordsUrl: "https://www.health.ny.gov/vital_records/",
    socialSecurityOffices: [
      {
        city: "New York",
        address: "123 William St, New York, NY 10038",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "NC": {
    name: "North Carolina",
    code: "NC",
    vitalRecordsUrl: "https://vitalrecords.nc.gov/",
  },
  "ND": {
    name: "North Dakota",
    code: "ND",
    vitalRecordsUrl: "https://www.health.nd.gov/vital/",
  },
  "OH": {
    name: "Ohio",
    code: "OH",
    vitalRecordsUrl: "https://odh.ohio.gov/know-our-programs/vital-statistics/vital-statistics",
    socialSecurityOffices: [
      {
        city: "Cleveland",
        address: "1240 E 9th St, Cleveland, OH 44199",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "OK": {
    name: "Oklahoma",
    code: "OK",
    vitalRecordsUrl: "https://oklahoma.gov/health/birth-and-death-certificates.html",
  },
  "OR": {
    name: "Oregon",
    code: "OR",
    vitalRecordsUrl: "https://www.oregon.gov/oha/PH/BIRTHDEATHCERTIFICATES/",
  },
  "PA": {
    name: "Pennsylvania",
    code: "PA",
    vitalRecordsUrl: "https://www.health.pa.gov/topics/certificates/Pages/Vital%20Records.aspx",
    socialSecurityOffices: [
      {
        city: "Philadelphia",
        address: "1500 John F Kennedy Blvd, Philadelphia, PA 19102",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "RI": {
    name: "Rhode Island",
    code: "RI",
    vitalRecordsUrl: "https://health.ri.gov/records/",
  },
  "SC": {
    name: "South Carolina",
    code: "SC",
    vitalRecordsUrl: "https://scdhec.gov/vital-records",
  },
  "SD": {
    name: "South Dakota",
    code: "SD",
    vitalRecordsUrl: "https://doh.sd.gov/records/birth-records.aspx",
  },
  "TN": {
    name: "Tennessee",
    code: "TN",
    vitalRecordsUrl: "https://www.tn.gov/health/health-program-areas/vital-records.html",
  },
  "TX": {
    name: "Texas",
    code: "TX",
    vitalRecordsUrl: "https://www.dshs.texas.gov/vsquery",
    socialSecurityOffices: [
      {
        city: "Houston",
        address: "10330 Lake Rd, Houston, TX 77070",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      },
      {
        city: "Dallas",
        address: "10824 N Central Expy, Dallas, TX 75231",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "UT": {
    name: "Utah",
    code: "UT",
    vitalRecordsUrl: "https://vitalrecords.utah.gov/",
  },
  "VT": {
    name: "Vermont",
    code: "VT",
    vitalRecordsUrl: "https://www.healthvermont.gov/records-resources/vital-records",
  },
  "VA": {
    name: "Virginia",
    code: "VA",
    vitalRecordsUrl: "https://www.vdh.virginia.gov/vital-records/",
  },
  "WA": {
    name: "Washington",
    code: "WA",
    vitalRecordsUrl: "https://doh.wa.gov/licenses-permits-and-certificates/vital-records",
    socialSecurityOffices: [
      {
        city: "Seattle",
        address: "915 2nd Ave, Seattle, WA 98174",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "WV": {
    name: "West Virginia",
    code: "WV",
    vitalRecordsUrl: "https://dhhr.wv.gov/BPH/Pages/Vital-Records.aspx",
  },
  "WI": {
    name: "Wisconsin",
    code: "WI",
    vitalRecordsUrl: "https://www.dhs.wisconsin.gov/vitalrecords/",
  },
  "WY": {
    name: "Wyoming",
    code: "WY",
    vitalRecordsUrl: "https://health.wyo.gov/admin/vitalstatistics/",
  },
  "DC": {
    name: "District of Columbia",
    code: "DC",
    vitalRecordsUrl: "https://dchealth.dc.gov/vital-records",
    socialSecurityOffices: [
      {
        city: "Washington DC",
        address: "1300 D St SW, Washington, DC 20024",
        phone: "1-800-772-1213",
        url: "https://www.ssa.gov/locator/"
      }
    ]
  },
  "default": {
    name: "United States",
    code: "default",
    vitalRecordsUrl: "https://www.cdc.gov/nchs/w2w/index.htm",
  }
};

// Usage scenarios and document information
const DOCUMENT_INFO = {
  passport: {
    title: "U.S. Passport",
    icon: <Globe className="h-6 w-6 text-blue-500" />,
    description: "Your key to international travel and proof of U.S. citizenship",
    whatIsIt: "A U.S. passport is an official government document that certifies your identity and U.S. citizenship. It allows you to travel internationally and serves as one of the most powerful forms of identification.",
    whyItMatters: "A passport is essential for international travel, but it's also valuable as a form of identification even when you're not traveling. It's universally recognized and can be used to verify your identity and citizenship status.",
    whenToUse: [
      "International travel (required)",
      "Proving U.S. citizenship",
      "Major identification purposes",
      "Opening certain financial accounts",
      "Employment verification (as part of I-9 forms)"
    ],
    howToGet: {
      title: "How to Get a U.S. Passport",
      steps: [
        {
          title: "Complete Form DS-11 (for first-time applicants)",
          description: "Fill out the application form online at travel.state.gov and print it, or fill it out by hand."
        },
        {
          title: "Gather required documents",
          description: "You'll need proof of U.S. citizenship (such as a birth certificate), a photo ID, a passport photo, and the application fee."
        },
        {
          title: "Submit in person",
          description: "First-time applicants must submit their application in person at a passport acceptance facility or passport agency."
        },
        {
          title: "Pay the fee",
          description: "The passport book fee is $130 plus a $35 execution fee. Expedited service costs an additional $60."
        },
        {
          title: "Wait for processing",
          description: "Routine processing takes 6-8 weeks. Expedited service takes 2-3 weeks."
        }
      ],
      nationalLink: "https://travel.state.gov/content/travel/en/passports/how-apply.html",
      findLocations: "https://iafdb.travel.state.gov/"
    },
    renewalInfo: {
      title: "Passport Renewal",
      description: "If you already have a passport, you may be eligible to renew by mail using Form DS-82 if your passport:",
      eligibility: [
        "Was issued when you were 16 or older",
        "Was issued within the last 15 years",
        "Is undamaged and in your possession",
        "Was issued in your current name (or you can document your name change)"
      ],
      link: "https://travel.state.gov/content/travel/en/passports/have-passport/renew.html"
    }
  },
  "birth-certificate": {
    title: "Birth Certificate",
    icon: <FileText className="h-6 w-6 text-green-500" />,
    description: "The official record of your birth and proof of identity",
    whatIsIt: "A birth certificate is an official document issued by a government agency that documents the birth of a child. In the U.S., birth certificates are issued by vital records offices in the state where you were born.",
    whyItMatters: "Your birth certificate is the foundation document for establishing your identity. It's required to obtain other forms of identification like driver's licenses, passports, and Social Security cards.",
    whenToUse: [
      "Registering for school",
      "Obtaining a driver's license or state ID",
      "Applying for a passport",
      "Applying for government benefits",
      "Employment verification",
      "Proving age or citizenship",
      "Marriage license applications"
    ],
    howToGet: {
      title: "How to Get a Birth Certificate",
      steps: [
        {
          title: "Determine the vital records office",
          description: "Birth certificates are maintained by the state where you were born. Each state has different procedures."
        },
        {
          title: "Submit an application",
          description: "Complete the application for your state, which typically requires information about your birth (date, place, parents' names)."
        },
        {
          title: "Provide identification",
          description: "You'll need to prove your identity with a government-issued photo ID."
        },
        {
          title: "Pay the fee",
          description: "Fees vary by state but typically range from $15 to $30 per copy."
        },
        {
          title: "Receive your certificate",
          description: "Depending on the state, you may receive your certificate by mail or in person."
        }
      ],
      nationalLink: "https://www.cdc.gov/nchs/w2w/index.htm"
    },
    stateSpecific: true
  },
  "social-security": {
    title: "Social Security Card",
    icon: <CreditCard className="h-6 w-6 text-rose-500" />,
    description: "Your unique identifier for employment and benefits",
    whatIsIt: "A Social Security card shows your name and Social Security Number (SSN), a unique nine-digit number assigned to U.S. citizens, permanent residents, and temporary working residents. The SSN is issued by the Social Security Administration (SSA).",
    whyItMatters: "Your Social Security number is used to track your earnings and determine eligibility for Social Security benefits. It's also used for identification and credit purposes by financial institutions, employers, and government agencies.",
    whenToUse: [
      "Starting a new job (for W-4 forms)",
      "Opening bank accounts",
      "Applying for credit or loans",
      "Filing tax returns",
      "Applying for government benefits",
      "Enrolling in Medicare",
      "Collecting Social Security benefits"
    ],
    howToGet: {
      title: "How to Get a Social Security Card",
      steps: [
        {
          title: "Complete an application",
          description: "Fill out Form SS-5, Application for a Social Security Card. This can be downloaded from the SSA website."
        },
        {
          title: "Gather required documents",
          description: "You'll need proof of identity (driver's license, state ID, or passport), proof of U.S. citizenship (birth certificate or passport), and immigration documents for non-citizens."
        },
        {
          title: "Submit your application",
          description: "Submit your application and documents in person at a Social Security office, or mail them if you're applying for a replacement card."
        },
        {
          title: "Receive your card",
          description: "Your card will be mailed to you, typically within 2-4 weeks after your application is processed."
        }
      ],
      nationalLink: "https://www.ssa.gov/ssnumber/",
      findLocations: "https://secure.ssa.gov/ICON/main.jsp"
    },
    replacementInfo: {
      title: "Replacing a Lost or Stolen Card",
      description: "If your Social Security card is lost or stolen:",
      steps: [
        "You can request a replacement online through my Social Security account if you meet certain requirements",
        "You can visit a local Social Security office in person",
        "You can mail in an application with required documents",
        "You're limited to three replacement cards in a year and 10 in a lifetime (with some exceptions)"
      ],
      link: "https://www.ssa.gov/myaccount/replacement-card.html"
    },
    stateSpecific: true
  }
};

export default function IdentityDocumentsGuide() {
  const [activeTab, setActiveTab] = useState<DocumentTab>("passport");
  const [selectedState, setSelectedState] = useState<StateCode>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Get current document info
  const documentInfo = DOCUMENT_INFO[activeTab];
  const stateInfo = STATES[selectedState];

  // Filter states for search
  const filteredStates = Object.values(STATES)
    .filter(state => state.code !== "default")
    .filter(state => 
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      
      // Simple search logic - in a real app, this would query an API
      const results = Object.values(DOCUMENT_INFO).filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.whatIsIt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.whenToUse.some(use => use.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(results);
    }, 500);
  };

  // Handle enter key for search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <Tabs defaultValue="passport" onValueChange={value => setActiveTab(value as DocumentTab)}>
        <TabsList className="w-full mb-4 grid grid-cols-3">
          <TabsTrigger value="passport" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Passport</span>
            <span className="sm:hidden">Passport</span>
          </TabsTrigger>
          <TabsTrigger value="birth-certificate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Birth Certificate</span>
            <span className="sm:hidden">Birth Cert.</span>
          </TabsTrigger>
          <TabsTrigger value="social-security" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Social Security</span>
            <span className="sm:hidden">SSN</span>
          </TabsTrigger>
        </TabsList>

        {/* State selector (only show for state-specific documents) */}
        {documentInfo.stateSpecific && (
          <div className="mb-6">
            <Label htmlFor="state-select" className="mb-2 block">
              Select your state for specific information:
            </Label>
            <Select value={selectedState} onValueChange={value => setSelectedState(value as StateCode)}>
              <SelectTrigger id="state-select" className="w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Select State</Label>
                  <Input 
                    placeholder="Search states..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-[180px]"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <ScrollArea className="h-[300px]">
                  <SelectItem value="default">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>All States (General Info)</span>
                    </div>
                  </SelectItem>
                  {filteredStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{state.name} ({state.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            
            {selectedState !== "default" && (
              <Alert className="mt-2 bg-blue-50 text-blue-800 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription>
                  Showing specific information for {stateInfo.name}.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Document content */}
        <TabsContent value="passport" className="space-y-6">
          <DocumentOverview document={documentInfo} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                How to Get a U.S. Passport
              </CardTitle>
              <CardDescription>
                Follow these steps to apply for your U.S. passport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {documentInfo.howToGet.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800 text-sm">
                  Processing times vary. Check the current processing times on the official website.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3 pt-2">
                <h4 className="font-medium">Official Resources:</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <a href={documentInfo.howToGet.nationalLink} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2 text-blue-500" />
                      U.S. Passport Application
                      <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a href={documentInfo.howToGet.findLocations} target="_blank" rel="noopener noreferrer">
                      <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                      Find Passport Locations
                      <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Passport Renewal
              </CardTitle>
              <CardDescription>
                Information about renewing your existing passport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{documentInfo.renewalInfo.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">You can renew by mail if your passport:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {documentInfo.renewalInfo.eligibility.map((item, idx) => (
                    <li key={idx} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
              
              <Button variant="outline" className="w-full sm:w-auto mt-2 justify-start" asChild>
                <a href={documentInfo.renewalInfo.link} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2 text-blue-500" />
                  Official Renewal Information
                  <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="birth-certificate" className="space-y-6">
          <DocumentOverview document={documentInfo} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                How to Get a Birth Certificate
              </CardTitle>
              <CardDescription>
                Steps to obtain an official copy of your birth certificate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {documentInfo.howToGet.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedState !== "default" && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-800 text-sm space-y-2">
                    <p><strong>{stateInfo.name} Vital Records Office</strong></p>
                    <Button variant="outline" className="mt-1 w-full sm:w-auto justify-start" asChild>
                      <a href={stateInfo.vitalRecordsUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2 text-green-500" />
                        {stateInfo.name} Vital Records Website
                        <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                      </a>
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3 pt-2">
                <h4 className="font-medium">Official Resources:</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <a href={documentInfo.howToGet.nationalLink} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2 text-blue-500" />
                      National Birth Certificate Info
                      <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                    </a>
                  </Button>
                  {selectedState === "default" ? (
                    <Button variant="outline" className="justify-start" asChild>
                      <a href="https://www.cdc.gov/nchs/w2w/index.htm" target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                        Find Your State's Office
                        <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" className="justify-start" asChild>
                      <a href={stateInfo.vitalRecordsUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                        {stateInfo.name} Vital Records
                        <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Important Tips
              </CardTitle>
              <CardDescription>
                Helpful information about birth certificates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-sm font-medium">
                    Types of Birth Certificates
                  </AccordionTrigger>
                  <AccordionContent className="text-sm space-y-2">
                    <p>There are several types of birth certificates:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Full/Long Form:</strong> Contains the most detailed information, including parents' information.</li>
                      <li><strong>Abstract/Short Form:</strong> Contains basic information but may not be acceptable for all purposes.</li>
                      <li><strong>Certified Copy:</strong> Has an official seal and is accepted for legal purposes.</li>
                      <li><strong>Informational Copy:</strong> Not valid for official purposes.</li>
                    </ul>
                    <p className="pt-1">For most official purposes (passports, etc.), you need a certified copy of the long form birth certificate.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-sm font-medium">
                    Authorized Requestors
                  </AccordionTrigger>
                  <AccordionContent className="text-sm space-y-2">
                    <p>States have different rules about who can request a birth certificate:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>The person named on the certificate</li>
                      <li>Parents listed on the birth certificate</li>
                      <li>Legal guardians (with documentation)</li>
                      <li>Immediate family members (rules vary by state)</li>
                      <li>Legal representatives (with documentation)</li>
                    </ul>
                    <p className="pt-1">You'll need to provide valid identification to prove your relationship to the person on the certificate.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-sm font-medium">
                    Born Outside the U.S.?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm space-y-2">
                    <p>If you were born outside the United States to U.S. citizen parents:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>You may have a Consular Report of Birth Abroad (CRBA, Form FS-240)</li>
                      <li>You might have a Certification of Birth (Form DS-1350)</li>
                      <li>For citizenship purposes, these documents serve the same function as a U.S. birth certificate</li>
                    </ul>
                    <p className="pt-1">To replace these documents, contact the U.S. Department of State.</p>
                    <Button variant="outline" className="mt-2 justify-start" asChild>
                      <a href="https://travel.state.gov/content/travel/en/records/replace-or-certify-vital-documents.html" target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2 text-blue-500" />
                        Replace Documents for Births Abroad
                        <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                      </a>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social-security" className="space-y-6">
          <DocumentOverview document={documentInfo} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-rose-500" />
                How to Get a Social Security Card
              </CardTitle>
              <CardDescription>
                Steps to obtain or replace your Social Security card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {documentInfo.howToGet.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedState !== "default" && stateInfo.socialSecurityOffices && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <div className="space-y-3">
                      <p><strong>{stateInfo.name} Social Security Offices</strong></p>
                      {stateInfo.socialSecurityOffices.map((office, idx) => (
                        <div key={idx} className="text-sm pb-2">
                          <p><strong>{office.city}</strong></p>
                          <p>{office.address}</p>
                          <p>Phone: {office.phone}</p>
                        </div>
                      ))}
                      <Button variant="outline" className="mt-1 justify-start" asChild>
                        <a href="https://secure.ssa.gov/ICON/main.jsp" target="_blank" rel="noopener noreferrer">
                          <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                          Find More {stateInfo.name} Offices
                          <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                        </a>
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3 pt-2">
                <h4 className="font-medium">Official Resources:</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <a href={documentInfo.howToGet.nationalLink} target="_blank" rel="noopener noreferrer">
                      <CreditCard className="h-4 w-4 mr-2 text-rose-500" />
                      Social Security Card Application
                      <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a href={documentInfo.howToGet.findLocations} target="_blank" rel="noopener noreferrer">
                      <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                      Find Social Security Offices
                      <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Replacing a Lost or Stolen Card
              </CardTitle>
              <CardDescription>
                What to do if your Social Security card is lost or stolen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{documentInfo.replacementInfo.description}</p>
              
              <div className="space-y-2">
                <ul className="list-disc pl-6 space-y-1">
                  {documentInfo.replacementInfo.steps.map((item, idx) => (
                    <li key={idx} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
              
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800 text-sm">
                  If your Social Security card is lost or stolen, you should monitor your credit reports for signs of identity theft.
                </AlertDescription>
              </Alert>
              
              <Button variant="outline" className="w-full sm:w-auto mt-2 justify-start" asChild>
                <a href={documentInfo.replacementInfo.link} target="_blank" rel="noopener noreferrer">
                  <CreditCard className="h-4 w-4 mr-2 text-rose-500" />
                  Replace Your Card Online
                  <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Document Overview Component
function DocumentOverview({ document }: { document: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {document.icon}
          {document.title}
          {document.title === "U.S. Passport" && (
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">Federal</Badge>
          )}
          {document.title === "Birth Certificate" && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">State</Badge>
          )}
          {document.title === "Social Security Card" && (
            <Badge variant="outline" className="ml-2 bg-rose-50 text-rose-700 border-rose-200">Federal</Badge>
          )}
        </CardTitle>
        <CardDescription>{document.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium">What is it?</h3>
            <p className="text-sm text-muted-foreground">{document.whatIsIt}</p>
          </div>
          
          <div>
            <h3 className="text-base font-medium">Why it matters</h3>
            <p className="text-sm text-muted-foreground">{document.whyItMatters}</p>
          </div>
          
          <div>
            <h3 className="text-base font-medium">When to use it</h3>
            <ul className="grid gap-1.5 mt-2">
              {document.whenToUse.map((use: string, idx: number) => (
                <li key={idx} className="flex items-baseline gap-2">
                  <ChevronRight className="h-3 w-3 text-primary flex-shrink-0 mt-1" />
                  <span className="text-sm">{use}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}