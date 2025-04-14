import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Lightbulb, WifiIcon, Smartphone, Activity, Droplets, X, MapPin, Search, Navigation, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SimpleResourceLinks from '@/components/simple-resource-links';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import QuizComponent from '@/components/quiz-component';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import {
  FullScreenDialog,
  FullScreenDialogTrigger,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
  FullScreenDialogClose,
} from "@/components/ui/full-screen-dialog";

export default function UtilitiesGuideCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [showChat, setShowChat] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [cityInput, setCityInput] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocalResources, setShowLocalResources] = useState<boolean>(false);
  const [locationMethod, setLocationMethod] = useState<'manual' | 'gps' | 'zip'>('manual');

  // Course modules as cards
  const COURSE_MODULES = [
    {
      id: 'internet',
      title: 'Internet & WiFi',
      description: 'How to research, select, and set up reliable internet service',
      icon: WifiIcon,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            In today's connected world, setting up reliable internet is essential. This module helps you understand different internet options, compare providers, and set up your home network for optimal performance.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Understanding Internet Types (Fiber, Cable, DSL)', length: '8 min', completed: false },
              { title: 'Comparing Local Providers and Plans', length: '10 min', completed: false },
              { title: 'Setting Up Your Home WiFi Network', length: '7 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'mobile',
      title: 'Mobile Service',
      description: 'Find the right mobile phone plan for your needs and budget',
      icon: Smartphone,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Mobile phone service is essential for staying connected on the go. This module helps you navigate the often confusing world of mobile carriers, plans, and features to find the best value for your specific needs.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Comparing Major Carriers vs. MVNOs', length: '9 min', completed: false },
              { title: 'Understanding Data Plans and Features', length: '7 min', completed: false },
              { title: 'Family Plans vs. Individual Plans', length: '8 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'power',
      title: 'Electricity & Gas',
      description: 'Setting up utilities and managing energy costs efficiently',
      icon: Activity,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Setting up electricity and gas service is a critical step when moving into a new home. This module explains how to choose providers, understand billing options, and implement energy-saving strategies to reduce your bills.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Choosing Electricity Providers', length: '12 min', completed: false },
              { title: 'Understanding Billing Options', length: '8 min', completed: false },
              { title: 'Energy Saving Strategies', length: '10 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'water',
      title: 'Water & Sewer',
      description: 'Setting up water service and understanding your usage',
      icon: Droplets,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Water and sewer service is typically managed by your local municipality. This module explains the process for establishing service, understanding your bill, and implementing water conservation practices to save money and resources.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Establishing Water & Sewer Service', length: '8 min', completed: false },
              { title: 'Understanding Your Water Bill', length: '7 min', completed: false },
              { title: 'Water Conservation Practices', length: '9 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  // Quiz questions
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "Which type of internet service typically offers the fastest speeds?",
      options: [
        "DSL", 
        "Fiber optic", 
        "Satellite", 
        "Dial-up"
      ],
      correctAnswer: 1,
      explanation: "Fiber optic internet uses light signals transmitted through glass or plastic cables, offering the fastest and most reliable internet speeds currently available to residential customers."
    },
    {
      id: 2,
      question: "What is an MVNO in mobile phone service?",
      options: [
        "Mobile Virtual Network Operator - a company that offers service using another carrier's network", 
        "Mobile Verified Network Option - a premium tier of service", 
        "Mobile Voice & Network Operator - a standard cellular carrier", 
        "Mobile Voice Navigation Option - a GPS feature"
      ],
      correctAnswer: 0,
      explanation: "Mobile Virtual Network Operators (MVNOs) are companies that don't own the wireless infrastructure they use to provide service to customers. Instead, they purchase network access at wholesale rates from major carriers and can often offer lower prices."
    },
    {
      id: 3,
      question: "When is the best time to set up utilities for a new home?",
      options: [
        "The day you move in", 
        "1-2 weeks before your move-in date", 
        "After you've lived there for a week to assess needs", 
        "Only after receiving the first bill from the previous tenant"
      ],
      correctAnswer: 1,
      explanation: "It's best to contact utility companies 1-2 weeks before your move-in date. This gives them enough time to process your request and ensures services are active when you arrive."
    },
    {
      id: 4,
      question: "What factor impacts your water bill the most?",
      options: [
        "The number of people in your household", 
        "The age of your home", 
        "Your ZIP code", 
        "The time of year you establish service"
      ],
      correctAnswer: 0,
      explanation: "The number of people in your household is typically the biggest factor affecting water usage and your resulting bill. Each person uses water for bathing, cooking, cleaning, and other daily activities."
    },
    {
      id: 5,
      question: "Which of these is NOT typically considered when comparing internet service providers?",
      options: [
        "Download and upload speeds", 
        "Monthly data caps", 
        "Contract length", 
        "Your education level"
      ],
      correctAnswer: 3,
      explanation: "Internet service providers typically consider factors like desired speeds, data usage, contract terms, and available promotions when setting up service - not personal factors like education level."
    }
  ];

  // Course resources
  const RESOURCES = [
    {
      title: 'FCC Broadband Speed Guide',
      url: 'https://www.fcc.gov/consumers/guides/broadband-speed-guide',
      description: 'Official guide to understanding internet speeds'
    },
    {
      title: 'Energy Star Home Energy Yardstick',
      url: 'https://www.energystar.gov/index.cfm?fuseaction=HOME_ENERGY_YARDSTICK.showGetStarted',
      description: "Compare your home's energy use to similar homes"
    },
    {
      title: 'EPA WaterSense Program',
      url: 'https://www.epa.gov/watersense',
      description: 'Resources for water conservation'
    },
    {
      title: 'Consumer Cellular Coverage Map',
      url: 'https://www.consumercellular.com/coverage',
      description: 'Example of a mobile coverage comparison tool'
    }
  ];
  
  // State-specific utility provider data
  const STATE_UTILITIES = {
    "California": {
      internet: [
        { name: "AT&T", url: "https://www.att.com/internet/", description: "DSL and fiber internet service" },
        { name: "Comcast Xfinity", url: "https://www.xfinity.com/", description: "Cable internet provider" },
        { name: "Spectrum", url: "https://www.spectrum.com/", description: "Cable internet provider" },
        { name: "Frontier", url: "https://frontier.com/", description: "DSL and fiber internet service" }
      ],
      electricity: [
        { name: "Pacific Gas & Electric (PG&E)", url: "https://www.pge.com/", description: "Northern California electricity provider" },
        { name: "Southern California Edison (SCE)", url: "https://www.sce.com/", description: "Southern California electricity provider" },
        { name: "San Diego Gas & Electric (SDG&E)", url: "https://www.sdge.com/", description: "San Diego area electricity provider" }
      ],
      water: [
        { name: "California Water Service", url: "https://www.calwater.com/", description: "Water provider for multiple California areas" },
        { name: "Metropolitan Water District", url: "https://www.mwdh2o.com/", description: "Southern California water supplier" }
      ],
      city_specific: {
        "Los Angeles": {
          water: { name: "LADWP", url: "https://www.ladwp.com/", description: "Los Angeles Department of Water and Power" },
          electricity: { name: "LADWP", url: "https://www.ladwp.com/", description: "Los Angeles Department of Water and Power" }
        },
        "San Francisco": {
          water: { name: "SFPUC", url: "https://www.sfpuc.org/", description: "San Francisco Public Utilities Commission" },
          electricity: { name: "PG&E", url: "https://www.pge.com/", description: "Pacific Gas & Electric" }
        },
        "San Diego": {
          water: { name: "City of San Diego Public Utilities", url: "https://www.sandiego.gov/public-utilities", description: "San Diego water and wastewater services" },
          electricity: { name: "SDG&E", url: "https://www.sdge.com/", description: "San Diego Gas & Electric" }
        }
      }
    },
    "Texas": {
      internet: [
        { name: "AT&T", url: "https://www.att.com/internet/", description: "DSL and fiber internet service" },
        { name: "Spectrum", url: "https://www.spectrum.com/", description: "Cable internet provider" },
        { name: "Xfinity", url: "https://www.xfinity.com/", description: "Cable internet provider" },
        { name: "Frontier", url: "https://frontier.com/", description: "DSL and fiber internet service" }
      ],
      electricity: [
        { name: "Power To Choose", url: "https://www.powertochoose.org/", description: "Compare electricity providers in Texas" },
        { name: "TXU Energy", url: "https://www.txu.com/", description: "Major Texas electricity provider" },
        { name: "Reliant", url: "https://www.reliant.com/", description: "Major Texas electricity provider" }
      ],
      water: [
        { name: "Texas Water Development Board", url: "https://www.twdb.texas.gov/", description: "State water planning and financing" }
      ],
      city_specific: {
        "Houston": {
          water: { name: "City of Houston Water", url: "https://www.houstonpublicworks.org/", description: "Houston water utility services" }
        },
        "Dallas": {
          water: { name: "Dallas Water Utilities", url: "https://dallascityhall.com/departments/waterutilities/", description: "Dallas water and wastewater services" }
        },
        "Austin": {
          water: { name: "Austin Water", url: "https://www.austintexas.gov/department/water", description: "Austin water utility services" },
          electricity: { name: "Austin Energy", url: "https://austinenergy.com/", description: "Austin municipal utility" }
        }
      }
    },
    "New York": {
      internet: [
        { name: "Spectrum", url: "https://www.spectrum.com/", description: "Cable internet provider" },
        { name: "Verizon Fios", url: "https://www.verizon.com/home/fios/", description: "Fiber optic internet service" },
        { name: "Optimum", url: "https://www.optimum.com/", description: "Cable internet provider" }
      ],
      electricity: [
        { name: "Con Edison", url: "https://www.coned.com/", description: "New York City electricity provider" },
        { name: "National Grid", url: "https://www.nationalgridus.com/", description: "Upstate New York electricity provider" },
        { name: "PSEG Long Island", url: "https://www.psegliny.com/", description: "Long Island electricity provider" }
      ],
      water: [
        { name: "New York City Water Board", url: "https://www1.nyc.gov/site/dep/water/water-rates.page", description: "NYC water service" }
      ],
      city_specific: {
        "New York City": {
          water: { name: "NYC Environmental Protection", url: "https://www1.nyc.gov/site/dep/index.page", description: "NYC water and wastewater services" },
          electricity: { name: "Con Edison", url: "https://www.coned.com/", description: "NYC electricity provider" }
        },
        "Buffalo": {
          water: { name: "Buffalo Water", url: "https://www.buffalowaterauthority.com/", description: "Buffalo water service" },
          electricity: { name: "National Grid", url: "https://www.nationalgridus.com/", description: "Buffalo electricity provider" }
        }
      }
    },
    "Florida": {
      internet: [
        { name: "AT&T", url: "https://www.att.com/internet/", description: "DSL and fiber internet service" },
        { name: "Xfinity", url: "https://www.xfinity.com/", description: "Cable internet provider" },
        { name: "Spectrum", url: "https://www.spectrum.com/", description: "Cable internet provider" },
        { name: "CenturyLink", url: "https://www.centurylink.com/", description: "DSL and fiber internet service" }
      ],
      electricity: [
        { name: "Florida Power & Light (FPL)", url: "https://www.fpl.com/", description: "Largest Florida electricity provider" },
        { name: "Duke Energy", url: "https://www.duke-energy.com/home", description: "Florida electricity provider" },
        { name: "Tampa Electric (TECO)", url: "https://www.tampaelectric.com/", description: "Tampa area electricity provider" }
      ],
      water: [
        { name: "Florida Government Utility Information", url: "https://www.floridajobs.org/community-planning-and-development/assistance-for-governments-and-organizations/florida-public-utilities-information", description: "Information on Florida water utilities" }
      ],
      city_specific: {
        "Miami": {
          water: { name: "Miami-Dade Water and Sewer", url: "https://www.miamidade.gov/water/", description: "Miami water utility services" },
          electricity: { name: "FPL", url: "https://www.fpl.com/", description: "Florida Power & Light" }
        },
        "Orlando": {
          water: { name: "Orlando Utilities Commission", url: "https://www.ouc.com/", description: "Orlando water services" },
          electricity: { name: "Orlando Utilities Commission", url: "https://www.ouc.com/", description: "Orlando electricity provider" }
        },
        "Tampa": {
          water: { name: "City of Tampa Water", url: "https://www.tampa.gov/water", description: "Tampa water utility services" },
          electricity: { name: "Tampa Electric", url: "https://www.tampaelectric.com/", description: "Tampa electricity provider" }
        }
      }
    },
    "Illinois": {
      internet: [
        { name: "AT&T", url: "https://www.att.com/internet/", description: "DSL and fiber internet service" },
        { name: "Xfinity", url: "https://www.xfinity.com/", description: "Cable internet provider" },
        { name: "WOW!", url: "https://www.wowway.com/", description: "Cable internet provider" },
        { name: "Mediacom", url: "https://mediacomcable.com/", description: "Cable internet provider" }
      ],
      electricity: [
        { name: "ComEd", url: "https://www.comed.com/", description: "Northern Illinois electricity provider" },
        { name: "Ameren Illinois", url: "https://www.ameren.com/illinois", description: "Central and Southern Illinois electricity provider" }
      ],
      water: [
        { name: "Illinois American Water", url: "https://www.amwater.com/ilaw/", description: "Water service for many Illinois communities" }
      ],
      city_specific: {
        "Chicago": {
          water: { name: "City of Chicago Water Management", url: "https://www.chicago.gov/city/en/depts/water.html", description: "Chicago water services" },
          electricity: { name: "ComEd", url: "https://www.comed.com/", description: "Chicago electricity provider" }
        },
        "Springfield": {
          water: { name: "City Water, Light & Power", url: "https://www.cwlp.com/", description: "Springfield municipal utility" },
          electricity: { name: "City Water, Light & Power", url: "https://www.cwlp.com/", description: "Springfield municipal utility" }
        }
      }
    }
  };
  
  // List of US states for the dropdown
  const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];
  
  // City suggestions for selected states
  const getCitySuggestions = (state: string): string[] => {
    switch(state) {
      case "California":
        return ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose", "Fresno", "Oakland"];
      case "Texas":
        return ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso", "Arlington"];
      case "New York":
        return ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"];
      case "Florida":
        return ["Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg", "Hialeah", "Fort Lauderdale"];
      case "Illinois":
        return ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford", "Springfield", "Peoria"];
      default:
        return [];
    }
  };
  
  // Handler for state selection
  // Safely get utilities for a state
  const getStateUtilities = (state: string) => {
    if (state in STATE_UTILITIES) {
      return STATE_UTILITIES[state as keyof typeof STATE_UTILITIES];
    }
    return null;
  };

  // Safely get city-specific utilities
  const getCityUtilities = (state: string, city: string) => {
    const stateData = getStateUtilities(state);
    if (stateData && 'city_specific' in stateData) {
      const cityData = stateData.city_specific as Record<string, any>;
      if (city in cityData) {
        return cityData[city];
      }
    }
    return null;
  };
  
  // ZIP code to state mapping (simplified - in a real app would use a more comprehensive database)
  const ZIP_TO_STATE: Record<string, { state: string, city?: string }> = {
    // California
    "90001": { state: "California", city: "Los Angeles" },
    "90210": { state: "California", city: "Beverly Hills" },
    "94016": { state: "California", city: "San Francisco" },
    "95814": { state: "California", city: "Sacramento" },
    // Texas
    "75001": { state: "Texas", city: "Dallas" },
    "77001": { state: "Texas", city: "Houston" },
    "78701": { state: "Texas", city: "Austin" },
    // New York
    "10001": { state: "New York", city: "New York City" },
    "14201": { state: "New York", city: "Buffalo" },
    // Florida
    "33101": { state: "Florida", city: "Miami" },
    "32801": { state: "Florida", city: "Orlando" },
    // Illinois
    "60601": { state: "Illinois", city: "Chicago" },
    "60505": { state: "Illinois", city: "Aurora" }
  };
  
  // Look up a location by ZIP code
  const lookupZipCode = (zip: string) => {
    setLocationError(null);
    
    if (zip.length !== 5 || !/^\d+$/.test(zip)) {
      setLocationError("Please enter a valid 5-digit ZIP code");
      return;
    }
    
    const location = ZIP_TO_STATE[zip];
    if (location) {
      setSelectedState(location.state);
      if (location.city) {
        setSelectedCity(location.city);
        setCityInput(location.city);
      } else {
        setSelectedCity("");
        setCityInput("");
      }
      setShowLocalResources(!!getStateUtilities(location.state));
    } else {
      setLocationError("ZIP code not found in our database");
    }
  };
  
  // Use geolocation to detect user's location
  const detectLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you would use a geocoding service to convert coordinates to address
        // For this demo, we'll simulate a location in San Francisco
        setSelectedState("California");
        setSelectedCity("San Francisco");
        setCityInput("San Francisco");
        setShowLocalResources(true);
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "Failed to detect location";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please allow location access or enter your location manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please enter your location manually.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or enter your location manually.";
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      { maximumAge: 60000, timeout: 10000, enableHighAccuracy: true }
    );
  };
  
  // Reset all location states
  const resetLocation = () => {
    setSelectedState("");
    setSelectedCity("");
    setCityInput("");
    setZipCode("");
    setLocationError(null);
    setShowLocalResources(false);
    setLocationMethod('manual');
  };

  // Handler for state selection
  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity("");
    setCityInput("");
    setShowLocalResources(!!getStateUtilities(value));
  };
  
  // Handler for city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCityInput(city);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <Lightbulb className="h-6 w-6 mr-2 text-orange-500" />
          Utilities Setup Guide
        </h1>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 p-1 rounded-lg">
          <div className="flex items-center justify-between">
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'learn' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('learn')}
            >
              <span className="text-sm font-medium">Learn</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'practice' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('practice')}
            >
              <span className="text-sm font-medium">Practice</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'resources' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('resources')}
            >
              <span className="text-sm font-medium">Resources</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'learn' && (
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Setting Up Essential Home Utilities</CardTitle>
              <CardDescription>
                Learn how to efficiently set up and manage essential services for your home.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Setting up utilities is an important part of moving into a new home or apartment. This guide helps you navigate the process of researching, selecting, and establishing essential services like internet, mobile phone, electricity, and water.
              </p>
              <p className="mb-4">
                You'll learn how to compare providers, understand billing options, and implement strategies to save money while ensuring reliable service for all your household needs.
              </p>
            </CardContent>
          </Card>
          
          {/* Course modules as cards with dialogs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COURSE_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <FullScreenDialog key={module.id}>
                  <FullScreenDialogTrigger asChild>
                    <Card className="border-2 border-orange-100 shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                            <Icon className="h-10 w-10 text-orange-500" />
                          </div>
                          <CardTitle className="mb-2">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  </FullScreenDialogTrigger>
                  <FullScreenDialogContent themeColor="#f97316">
                    <FullScreenDialogHeader>
                      <div className="flex items-center mb-2">
                        <Icon className="w-6 h-6 mr-2 text-orange-500" />
                        <FullScreenDialogTitle>
                          {module.title}
                        </FullScreenDialogTitle>
                      </div>
                      <FullScreenDialogDescription>
                        {module.description}
                      </FullScreenDialogDescription>
                    </FullScreenDialogHeader>
                    <FullScreenDialogBody>
                      {module.content}
                    </FullScreenDialogBody>
                    <FullScreenDialogFooter>
                      <FullScreenDialogClose asChild>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <X className="w-4 h-4" />
                          Close
                        </Button>
                      </FullScreenDialogClose>
                    </FullScreenDialogFooter>
                  </FullScreenDialogContent>
                </FullScreenDialog>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to check your understanding of home utilities setup and management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Home Utilities"
                difficulty="beginner"
                questions={QUIZ_QUESTIONS}
                onComplete={(score, total) => {
                  console.log(`Quiz results: ${score}/${total}`);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="mb-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                Find Local Utility Providers
              </CardTitle>
              <CardDescription>
                Select your location to view utility providers specific to your area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={locationMethod} onValueChange={(value) => setLocationMethod(value as any)} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="zip">ZIP Code</TabsTrigger>
                  <TabsTrigger value="gps">GPS Location</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual" className="mt-4">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="state">Select Your State</Label>
                      <Select
                        value={selectedState}
                        onValueChange={handleStateChange}
                      >
                        <SelectTrigger id="state" className="w-full">
                          <SelectValue placeholder="Select state..." />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedState && (
                      <div className="grid gap-2">
                        <Label htmlFor="city">City (Optional)</Label>
                        <div className="relative">
                          <Input
                            id="city"
                            placeholder="Enter your city..."
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            className="w-full"
                          />
                          {cityInput && getCitySuggestions(selectedState).filter(city => 
                            city.toLowerCase().includes(cityInput.toLowerCase()) && city.toLowerCase() !== cityInput.toLowerCase()
                          ).length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 border z-10">
                              {getCitySuggestions(selectedState)
                                .filter(city => city.toLowerCase().includes(cityInput.toLowerCase()))
                                .map(city => (
                                  <div 
                                    key={city} 
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleCitySelect(city)}
                                  >
                                    {city}
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="zip" className="mt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="zipCode">Enter ZIP Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="zipCode"
                          placeholder="e.g. 90210"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="flex-1"
                          maxLength={5}
                        />
                        <Button 
                          onClick={() => lookupZipCode(zipCode)}
                          disabled={!zipCode || zipCode.length !== 5}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Look Up
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Enter a 5-digit ZIP code to find utilities in your area
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="gps" className="mt-4">
                  <div className="grid gap-4">
                    <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-gray-50">
                      <Locate className="h-8 w-8 text-orange-500 mb-3" />
                      <h3 className="text-lg font-medium mb-2">Use Your Current Location</h3>
                      <p className="text-sm text-gray-500 text-center mb-4">
                        We'll detect your location to show relevant utility providers in your area
                      </p>
                      <Button
                        onClick={detectLocation}
                        disabled={isLocating}
                        className="w-full sm:w-auto"
                      >
                        {isLocating ? (
                          <>
                            <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                            Detecting...
                          </>
                        ) : (
                          <>
                            <Navigation className="h-4 w-4 mr-2" />
                            Detect My Location
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {locationError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              )}
              
              {selectedState && (
                <div className="flex justify-between items-center">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {selectedState}{selectedCity ? `, ${selectedCity}` : ''}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetLocation}>
                    <X className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              )}
              
              {showLocalResources && getStateUtilities(selectedState) && (
                <div className="mt-6">
                  <Alert className="mb-4 bg-orange-50 border-orange-200">
                    <AlertDescription className="text-orange-800">
                      Displaying utility providers for {selectedState}{selectedCity ? ` - ${selectedCity}` : ''}. These are common providers but may not be exhaustive for all areas.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-6">
                    {/* Internet providers */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <WifiIcon className="h-5 w-5 mr-2 text-orange-500" />
                        Internet Service Providers
                      </h3>
                      <div className="grid gap-3">
                        {getStateUtilities(selectedState)?.internet.map((provider, index) => (
                          <a 
                            key={index}
                            href={provider.url}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="block p-3 border rounded-md hover:border-orange-300 hover:bg-orange-50 transition-colors"
                          >
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-sm text-gray-600">{provider.description}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                    
                    {/* Electricity providers */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-orange-500" />
                        Electricity Providers
                      </h3>
                      <div className="grid gap-3">
                        {selectedCity && getCityUtilities(selectedState, selectedCity)?.electricity && (
                          <div>
                            <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100">City Specific</Badge>
                            <a 
                              href={getCityUtilities(selectedState, selectedCity)?.electricity.url}
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="block p-3 border border-green-200 rounded-md hover:border-green-300 hover:bg-green-50 transition-colors"
                            >
                              <div className="font-medium">{getCityUtilities(selectedState, selectedCity)?.electricity.name}</div>
                              <div className="text-sm text-gray-600">{getCityUtilities(selectedState, selectedCity)?.electricity.description}</div>
                            </a>
                          </div>
                        )}
                        
                        {getStateUtilities(selectedState)?.electricity.map((provider, index) => (
                          <a 
                            key={index}
                            href={provider.url}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="block p-3 border rounded-md hover:border-orange-300 hover:bg-orange-50 transition-colors"
                          >
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-sm text-gray-600">{provider.description}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                    
                    {/* Water providers */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Droplets className="h-5 w-5 mr-2 text-orange-500" />
                        Water Providers
                      </h3>
                      <div className="grid gap-3">
                        {selectedCity && getCityUtilities(selectedState, selectedCity)?.water && (
                          <div>
                            <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100">City Specific</Badge>
                            <a 
                              href={getCityUtilities(selectedState, selectedCity)?.water.url}
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="block p-3 border border-green-200 rounded-md hover:border-green-300 hover:bg-green-50 transition-colors"
                            >
                              <div className="font-medium">{getCityUtilities(selectedState, selectedCity)?.water.name}</div>
                              <div className="text-sm text-gray-600">{getCityUtilities(selectedState, selectedCity)?.water.description}</div>
                            </a>
                          </div>
                        )}
                        
                        {getStateUtilities(selectedState)?.water.map((provider, index) => (
                          <a 
                            key={index}
                            href={provider.url}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="block p-3 border rounded-md hover:border-orange-300 hover:bg-orange-50 transition-colors"
                          >
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-sm text-gray-600">{provider.description}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedState && !showLocalResources && (
                <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                  <AlertDescription className="text-yellow-800">
                    Detailed utility information for {selectedState} is not currently available in our database. Please refer to the general resources below or contact your local municipality for specific information.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>General Resources</CardTitle>
              <CardDescription>
                Helpful tools and guides for setting up and managing your home utilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleResourceLinks resources={RESOURCES} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Only show the pop-out chat when active to prevent duplicate Fundi robots */}
      {showChat && (
        <LearningCoachPopOut onClose={() => setShowChat(false)} />
      )}
    </div>
  );
}