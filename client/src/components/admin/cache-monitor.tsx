import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { clearCache, getCacheStats, resetCacheStats } from '@/lib/cache-utils';

/**
 * Cache Statistics Monitor Component
 * 
 * A dashboard component for admin users to monitor cache performance
 * and manually manage the cache if needed.
 */
export function CacheMonitor() {
  const [stats, setStats] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Load cache statistics
  const loadStats = () => {
    setStats(getCacheStats());
  };

  // Initial load and refresh interval
  useEffect(() => {
    loadStats();
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    } else {
      const interval = window.setInterval(loadStats, 5000); // Refresh every 5 seconds
      setRefreshInterval(interval);
    }
  };

  // Clear the cache
  const handleClearCache = () => {
    clearCache();
    loadStats();
  };

  // Reset cache statistics
  const handleResetStats = () => {
    resetCacheStats();
    loadStats();
  };

  // If stats haven't loaded yet
  if (!stats) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cache Statistics</CardTitle>
          <CardDescription>Loading cache statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <RefreshCw className="animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform priority data for the chart
  const priorityData = Object.entries(stats.byPriority).map(([key, value]) => ({
    name: key === '0' ? 'Low' : 
          key === '1' ? 'Normal' : 
          key === '2' ? 'High' : 
          'Critical',
    value
  }));

  // Hit/miss data for pie chart
  const hitMissData = [
    { name: 'Hits', value: stats.hits },
    { name: 'Misses', value: stats.misses }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Cache Statistics</CardTitle>
            <CardDescription>Performance monitoring for application cache</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadStats}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button 
              variant={refreshInterval ? "default" : "outline"} 
              size="sm"
              onClick={toggleAutoRefresh}
            >
              {refreshInterval ? 'Auto-refreshing' : 'Auto-refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground mb-1">Cache Items</div>
              <div className="text-2xl font-bold">{stats.activeItems}</div>
              <div className="text-xs text-muted-foreground">
                {stats.expiredItems > 0 && `+ ${stats.expiredItems} expired`}
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground mb-1">Hit Rate</div>
              <div className="text-2xl font-bold">{stats.hitRate}</div>
              <div className="text-xs text-muted-foreground">
                {stats.hits} hits / {stats.misses} misses
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground mb-1">Cache Usage</div>
              <div className="text-2xl font-bold">{stats.cacheUsage}</div>
              <div className="mt-1">
                <Progress value={parseInt(stats.cacheUsage)} max={100} className="h-1" />
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm font-medium text-muted-foreground mb-1">Evictions</div>
              <div className="text-2xl font-bold">{stats.evictions}</div>
              <div className="text-xs text-muted-foreground">
                Last cleanup: {new Date(stats.lastCleanup).toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          {/* Detailed view - can be expanded/collapsed */}
          <Button 
            variant="ghost" 
            className="w-full justify-between text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide Details' : 'Show Details'}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {expanded && (
            <div className="pt-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="actions">Cache Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64">
                      <div className="text-sm font-medium mb-2">Cache Priority Distribution</div>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={70} />
                          <Tooltip />
                          <Bar dataKey="value" name="Items" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="h-64">
                      <div className="text-sm font-medium mb-2">Cache Hit Rate</div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={hitMissData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {hitMissData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Average Item Age
                        </div>
                        <div className="text-xl font-bold">
                          {Math.round(stats.avgAgeMs / 1000)} seconds
                        </div>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Oldest Item Age
                        </div>
                        <div className="text-xl font-bold">
                          {Math.round(stats.oldestItemMs / 1000)} seconds
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Priority Distribution
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {Object.entries(stats.byPriority).map(([key, value], index) => (
                          <div key={key} className="text-center">
                            <div className="text-xl font-bold">{value}</div>
                            <div className="text-xs text-muted-foreground">
                              {key === '0' ? 'Low' : 
                               key === '1' ? 'Normal' : 
                               key === '2' ? 'High' : 
                               'Critical'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="actions">
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-2">Cache Maintenance</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          These actions will affect application performance. Use with caution.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            variant="destructive" 
                            onClick={handleClearCache}
                            className="flex gap-1 items-center"
                          >
                            <Trash2 className="h-4 w-4" />
                            Clear Cache
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            onClick={handleResetStats}
                          >
                            Reset Statistics
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}