import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  fetchMortgageRateHistory,
  fetchHousingMarketIndicators,
  FredDataSeries,
  FredDataPoint,
  formatFredValue,
  interpretTrend
} from '@/lib/fred-service';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  BarChart4, 
  HomeIcon, 
  Building, 
  DollarSign,
  Percent,
  X,
  Info,
  ChartBar
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendData {
  name: string;
  value: number;
  date: string;
}

interface MortgageMarketTrendsFullscreenProps {
  onClose: () => void;
}

const MortgageMarketTrendsFullscreen: React.FC<MortgageMarketTrendsFullscreenProps> = ({ onClose }) => {
  // Track component mount state
  const [mounted, setMounted] = useState<boolean>(false);
  
  // State for mortgage rate history
  const [thirtyYearHistory, setThirtyYearHistory] = useState<TrendData[]>([]);
  const [fifteenYearHistory, setFifteenYearHistory] = useState<TrendData[]>([]);
  const [historyTimeframe, setHistoryTimeframe] = useState<number>(12); // months
  
  // State for market indicators
  const [housingIndicators, setHousingIndicators] = useState<{
    homePriceIndex: FredDataPoint | null;
    housingStarts: FredDataPoint | null;
    homeSupply: FredDataPoint | null;
    medianPrice: FredDataPoint | null;
    previousHomePriceIndex: FredDataPoint | null;
    previousHousingStarts: FredDataPoint | null;
    previousHomeSupply: FredDataPoint | null;
    previousMedianPrice: FredDataPoint | null;
  }>({
    homePriceIndex: null,
    housingStarts: null,
    homeSupply: null,
    medianPrice: null,
    previousHomePriceIndex: null,
    previousHousingStarts: null,
    previousHomeSupply: null,
    previousMedianPrice: null,
  });
  
  // Loading states
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingIndicators, setLoadingIndicators] = useState(true);

  // Use effect for mounting state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch mortgage rate history
  useEffect(() => {
    const fetchRateHistory = async () => {
      setLoadingHistory(true);
      try {
        const [thirtyYearData, fifteenYearData] = await Promise.all([
          fetchMortgageRateHistory(FredDataSeries.MORTGAGE_30YR, historyTimeframe),
          fetchMortgageRateHistory(FredDataSeries.MORTGAGE_15YR, historyTimeframe)
        ]);
        
        setThirtyYearHistory(
          thirtyYearData.map(item => ({
            name: formatDate(item.date),
            value: parseFloat(item.value),
            date: item.date
          })).reverse()
        );
        
        setFifteenYearHistory(
          fifteenYearData.map(item => ({
            name: formatDate(item.date),
            value: parseFloat(item.value),
            date: item.date
          })).reverse()
        );
      } catch (error) {
        console.error('Error fetching mortgage rate history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };
    
    fetchRateHistory();
  }, [historyTimeframe]);

  // Fetch housing market indicators
  useEffect(() => {
    const fetchMarketIndicators = async () => {
      setLoadingIndicators(true);
      try {
        const indicators = await fetchHousingMarketIndicators();
        
        // To calculate trends, get an earlier data point for each indicator
        const [historicalPriceIndex, historicalStarts, historicalSupply, historicalMedianPrice] =
          await Promise.all([
            fetchFredData(FredDataSeries.HOME_PRICE_INDEX, 1, getDateMonthsAgo(3)),
            fetchFredData(FredDataSeries.HOUSING_STARTS, 1, getDateMonthsAgo(3)),
            fetchFredData(FredDataSeries.NEW_HOME_SUPPLY, 1, getDateMonthsAgo(3)),
            fetchFredData(FredDataSeries.MEDIAN_HOME_PRICE, 1, getDateMonthsAgo(3))
          ]);
        
        setHousingIndicators({
          ...indicators,
          previousHomePriceIndex: historicalPriceIndex.length > 0 ? historicalPriceIndex[0] : null,
          previousHousingStarts: historicalStarts.length > 0 ? historicalStarts[0] : null,
          previousHomeSupply: historicalSupply.length > 0 ? historicalSupply[0] : null,
          previousMedianPrice: historicalMedianPrice.length > 0 ? historicalMedianPrice[0] : null,
        });
      } catch (error) {
        console.error('Error fetching housing indicators:', error);
      } finally {
        setLoadingIndicators(false);
      }
    };
    
    fetchMarketIndicators();
  }, []);

  // Helper to format dates for chart display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(-2)}`;
  };
  
  // Helper to get date X months ago
  const getDateMonthsAgo = (months: number): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString().split('T')[0];
  };
  
  // Helper to fetch data utility (used for trend calculations)
  const fetchFredData = async (
    seriesId: FredDataSeries,
    limit: number,
    startDate?: string
  ): Promise<FredDataPoint[]> => {
    try {
      return await fetchMortgageRateHistory(seriesId as any, 1);
    } catch (error) {
      console.error(`Error fetching FRED data for ${seriesId}:`, error);
      return [];
    }
  };
  
  // Render trend badge
  const renderTrendBadge = (trend: 'up' | 'down' | 'stable' | 'unknown') => {
    switch (trend) {
      case 'up':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-800 border-amber-300">
            <TrendingUp className="h-3 w-3" /> Rising
          </Badge>
        );
      case 'down':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-emerald-100 text-emerald-800 border-emerald-300">
            <TrendingDown className="h-3 w-3" /> Falling
          </Badge>
        );
      case 'stable':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300">
            <ArrowRight className="h-3 w-3" /> Stable
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ChartBar className="h-6 w-6" />
            Mortgage Market Trends
          </h2>
          <p className="text-green-100">
            Real-time mortgage rates and housing market data from the Federal Reserve
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-green-700">
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Alert variant="default" className="mb-6 border-green-500 bg-green-50">
          <Info className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            All data is sourced directly from the Federal Reserve Economic Data (FRED) and updated regularly. Use this information to make informed decisions about your home purchase timing.
          </AlertDescription>
        </Alert>
        
        {/* Mortgage Rate Trends Chart */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-green-500" />
            Mortgage Rate Trends
          </h2>
          
          <Card className="shadow-md border border-green-100">
            <CardContent className="pt-6">
              {loadingHistory ? (
                <div className="space-y-4">
                  <Skeleton className="w-full h-8" />
                  <Skeleton className="w-full h-[300px]" />
                </div>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {[3, 6, 12, 24, 60].map((months) => (
                      <Button
                        key={months}
                        size="sm"
                        variant={historyTimeframe === months ? "default" : "outline"}
                        className={historyTimeframe === months ? "bg-green-600 hover:bg-green-700" : "text-green-700 hover:text-green-800 border-green-200 hover:bg-green-50"}
                        onClick={() => setHistoryTimeframe(months)}
                      >
                        {months < 12 ? `${months}m` : months === 12 ? '1y' : `${months / 12}y`}
                      </Button>
                    ))}
                  </div>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={thirtyYearHistory.length > fifteenYearHistory.length 
                        ? thirtyYearHistory 
                        : fifteenYearHistory}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value, index) => {
                          // Show fewer ticks for better readability
                          const interval = Math.ceil(thirtyYearHistory.length / 6);
                          return index % interval === 0 ? value : '';
                        }}
                      />
                      <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        data={thirtyYearHistory}
                        name="30-Year Fixed"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        data={fifteenYearHistory}
                        name="15-Year Fixed"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
            </CardContent>
            
            <CardFooter className="text-sm text-muted-foreground border-t pt-4">
              Data source: Federal Reserve Bank of St. Louis (FRED)
            </CardFooter>
          </Card>
        </div>
        
        {/* Housing Market Indicators */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-green-500" />
            Housing Market Indicators
          </h2>
          
          {loadingIndicators ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-[200px]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Median Home Price */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Median Home Price
                    </h4>
                    <div className="text-2xl font-bold">
                      {housingIndicators.medianPrice 
                        ? formatFredValue(housingIndicators.medianPrice.value, FredDataSeries.MEDIAN_HOME_PRICE) 
                        : 'No data'}
                    </div>
                  </div>
                  
                  {housingIndicators.medianPrice && housingIndicators.previousMedianPrice && (
                    <div>
                      {renderTrendBadge(interpretTrend(
                        housingIndicators.medianPrice,
                        housingIndicators.previousMedianPrice,
                        FredDataSeries.MEDIAN_HOME_PRICE
                      ).trend)}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {housingIndicators.medianPrice && housingIndicators.previousMedianPrice 
                    ? interpretTrend(
                        housingIndicators.medianPrice,
                        housingIndicators.previousMedianPrice,
                        FredDataSeries.MEDIAN_HOME_PRICE
                      ).description
                    : 'Trend data unavailable'}
                </p>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {housingIndicators.medianPrice?.date 
                    ? new Date(housingIndicators.medianPrice.date).toLocaleDateString() 
                    : 'Unknown'}
                </p>
              </div>
              
              {/* Housing Starts */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Building className="h-4 w-4 text-green-600" />
                      New Housing Starts
                    </h4>
                    <div className="text-2xl font-bold">
                      {housingIndicators.housingStarts 
                        ? formatFredValue(housingIndicators.housingStarts.value, FredDataSeries.HOUSING_STARTS) 
                        : 'No data'}
                    </div>
                  </div>
                  
                  {housingIndicators.housingStarts && housingIndicators.previousHousingStarts && (
                    <div>
                      {renderTrendBadge(interpretTrend(
                        housingIndicators.housingStarts,
                        housingIndicators.previousHousingStarts,
                        FredDataSeries.HOUSING_STARTS
                      ).trend)}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {housingIndicators.housingStarts && housingIndicators.previousHousingStarts 
                    ? interpretTrend(
                        housingIndicators.housingStarts,
                        housingIndicators.previousHousingStarts,
                        FredDataSeries.HOUSING_STARTS
                      ).description
                    : 'Trend data unavailable'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Total privately-owned housing units started
                </p>
              </div>
              
              {/* Home Price Index */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <HomeIcon className="h-4 w-4 text-green-600" />
                      Home Price Index
                    </h4>
                    <div className="text-2xl font-bold">
                      {housingIndicators.homePriceIndex 
                        ? formatFredValue(housingIndicators.homePriceIndex.value, FredDataSeries.HOME_PRICE_INDEX) 
                        : 'No data'}
                    </div>
                  </div>
                  
                  {housingIndicators.homePriceIndex && housingIndicators.previousHomePriceIndex && (
                    <div>
                      {renderTrendBadge(interpretTrend(
                        housingIndicators.homePriceIndex,
                        housingIndicators.previousHomePriceIndex,
                        FredDataSeries.HOME_PRICE_INDEX
                      ).trend)}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {housingIndicators.homePriceIndex && housingIndicators.previousHomePriceIndex 
                    ? interpretTrend(
                        housingIndicators.homePriceIndex,
                        housingIndicators.previousHomePriceIndex,
                        FredDataSeries.HOME_PRICE_INDEX
                      ).description
                    : 'Trend data unavailable'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Case-Shiller U.S. National Home Price Index
                </p>
              </div>
              
              {/* Monthly Supply */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Building className="h-4 w-4 text-green-600" />
                      Monthly Supply of New Homes
                    </h4>
                    <div className="text-2xl font-bold">
                      {housingIndicators.homeSupply 
                        ? formatFredValue(housingIndicators.homeSupply.value, FredDataSeries.NEW_HOME_SUPPLY) 
                        : 'No data'}
                    </div>
                  </div>
                  
                  {housingIndicators.homeSupply && housingIndicators.previousHomeSupply && (
                    <div>
                      {renderTrendBadge(interpretTrend(
                        housingIndicators.homeSupply,
                        housingIndicators.previousHomeSupply,
                        FredDataSeries.NEW_HOME_SUPPLY
                      ).trend)}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {housingIndicators.homeSupply && housingIndicators.previousHomeSupply 
                    ? interpretTrend(
                        housingIndicators.homeSupply,
                        housingIndicators.previousHomeSupply,
                        FredDataSeries.NEW_HOME_SUPPLY
                      ).description
                    : 'Trend data unavailable'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Months of supply at current sales rate - lower values indicate higher demand
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-semibold mb-2">What Do These Indicators Mean?</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li><strong>Mortgage Rates:</strong> The interest rate you'll likely pay on a home loan</li>
              <li><strong>Median Home Price:</strong> The middle price point of all homes sold recently</li>
              <li><strong>Housing Starts:</strong> New residential construction projects started</li>
              <li><strong>Home Price Index:</strong> A measure of average price changes in repeat sales</li>
              <li><strong>Monthly Supply:</strong> The number of months it would take to sell the current inventory</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              All indicators are sourced from Federal Reserve Economic Data (FRED) and updated regularly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageMarketTrendsFullscreen;