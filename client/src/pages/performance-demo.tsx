import React, { useState, useEffect } from 'react';
import { CachedImage } from '../components/ui/cached-image.js';

// Simple mock functions for cache statistics
const getCacheStats = () => ({
  totalItems: 5,
  activeItems: 5,
  expiredItems: 0,
  cacheUsage: '10%',
  hitRate: '75%',
  hits: 15,
  misses: 5,
  evictions: 0
});

const clearCache = () => console.log('Cache cleared');
const resetCacheStats = () => console.log('Cache stats reset');

// Demo image URLs
const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540206395-68808572332f?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618202133208-2907bebba9e1?w=800&auto=format&fit=crop'
];

const INVALID_IMAGE = 'https://example.com/non-existent-image.jpg';

/**
 * A demo page to showcase the performance optimizations
 * implemented in Bundle 5B.
 */
export default function PerformanceDemo() {
  const [activeTab, setActiveTab] = useState('images');
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [loadCount, setLoadCount] = useState<Record<string, number>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Load cache statistics
  const updateStats = () => {
    try {
      const stats = getCacheStats();
      setCacheStats(stats);
    } catch (err) {
      console.error('Failed to load cache stats:', err);
      setCacheStats({
        totalItems: 0,
        activeItems: 0,
        hitRate: '0%',
        hits: 0,
        misses: 0
      });
    }
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Track image loads
  const handleImageLoad = (url: string) => {
    setLoadCount(prev => ({
      ...prev,
      [url]: (prev[url] || 0) + 1
    }));
  };

  // Handle clearing the cache
  const handleClearCache = () => {
    try {
      clearCache();
      resetCacheStats();
      updateStats();
      setLoadCount({});
    } catch (err) {
      console.error('Failed to clear cache:', err);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Performance Optimizations Demo</h1>
          <p className="text-muted-foreground mt-1">
            Demonstrating Bundle 5B performance improvements
          </p>
        </div>
        <Button onClick={handleClearCache} variant="outline">
          Clear Cache & Reset Stats
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="images">Image Caching</TabsTrigger>
              <TabsTrigger value="api">API Optimization</TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Optimized Image Loading</CardTitle>
                  <CardDescription>
                    Images are cached after first load for better performance. Click each image multiple times to see the cache in action.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {DEMO_IMAGES.map((url, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <CachedImage
                          src={url}
                          alt={`Demo image ${index + 1}`}
                          className="h-40 w-full rounded-md cursor-pointer"
                          onClick={() => setSelectedImage(url)}
                          onImageLoad={() => handleImageLoad(url)}
                        />
                        <div className="text-xs text-muted-foreground">
                          Loaded: {loadCount[url] || 0} times
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex flex-col items-center gap-2">
                      <CachedImage
                        src={INVALID_IMAGE}
                        alt="Invalid image"
                        fallbackSrc={DEMO_IMAGES[0]}
                        className="h-40 w-full rounded-md cursor-pointer"
                        onClick={() => setSelectedImage(INVALID_IMAGE)}
                        onImageLoad={() => handleImageLoad(INVALID_IMAGE)}
                      />
                      <div className="text-xs text-muted-foreground">
                        Fallback image demo
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedImage && (
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Image (Cached)</CardTitle>
                    <CardDescription>
                      This image is loaded from cache if previously viewed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <CachedImage
                        src={selectedImage}
                        alt="Selected image"
                        className="h-80 w-auto rounded-md"
                        fallbackSrc={DEMO_IMAGES[0]}
                        onImageLoad={() => handleImageLoad(`selected:${selectedImage}`)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Request Optimization</CardTitle>
                  <CardDescription>
                    API requests use caching, timeouts, and retries for better performance and reliability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6">
                    This demo shows how API requests can be optimized using our new utilities.
                    The implementation includes:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Automatic request timeouts to prevent hanging requests</li>
                    <li>Retry capability when requests fail</li>
                    <li>Caching of GET requests to reduce server load</li>
                    <li>Priority-based cache eviction for important resources</li>
                    <li>Fallback data support when a request fails after all retries</li>
                  </ul>
                  
                  <div className="mt-8 bg-muted p-4 rounded-md text-sm">
                    <pre className="whitespace-pre-wrap">
                      {`// Example usage of optimized fetch
const userProfile = await optimizedFetch('/api/user/profile', {
  timeout: 5000,     // 5 second timeout
  retry: 3,          // Retry 3 times if failed
  cache: true,       // Cache the response
  cacheDuration: 300000, // Cache for 5 minutes
  cachePriority: 'HIGH' // High priority in cache
});`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Cache Statistics</CardTitle>
              <CardDescription>
                Real-time performance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cacheStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted rounded-md p-3">
                      <div className="text-sm font-medium text-muted-foreground">Cache Items</div>
                      <div className="text-2xl font-bold">{cacheStats.activeItems}</div>
                    </div>
                    
                    <div className="bg-muted rounded-md p-3">
                      <div className="text-sm font-medium text-muted-foreground">Hit Rate</div>
                      <div className="text-2xl font-bold">{cacheStats.hitRate || '0%'}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cache Hits:</span>
                      <span className="font-medium">{cacheStats.hits}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Cache Misses:</span>
                      <span className="font-medium">{cacheStats.misses}</span>
                    </div>
                    
                    {cacheStats.evictions !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>Evictions:</span>
                        <span className="font-medium">{cacheStats.evictions}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2">Image Loads</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(loadCount).map(([url, count]) => (
                        <div key={url} className="flex justify-between">
                          <span className="truncate max-w-[180px]">
                            {url.startsWith('selected:') 
                              ? 'Selected image' 
                              : `Image ${DEMO_IMAGES.indexOf(url) + 1}`}
                          </span>
                          <span className="font-medium">{count}×</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Loading cache statistics...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}