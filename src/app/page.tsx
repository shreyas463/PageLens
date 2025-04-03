"use client";

import { useState } from 'react';
import Image from 'next/image';

type MetaTags = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  viewport: string;
  favicon: string;
  h1Tags: string[];
  og: {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;
    site_name: string;
  };
  twitter: {
    card: string;
    site: string;
    title: string;
    description: string;
    image: string;
    creator: string;
  };
};

type SeoAnalysis = {
  score: number;
  maxScore: number;
  issues: string[];
  recommendations: string[];
  passes: string[];
};

type AnalysisResult = {
  url: string;
  metaTags: MetaTags;
  seoAnalysis: SeoAnalysis;
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Validate URL format
      let processedUrl = url.trim();
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl;
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: processedUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze website');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            SEO Tag Analyzer
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Analyze and optimize your website's SEO tags
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="url-input" className="sr-only">Website URL</label>
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Analyze SEO Tags'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('google')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'google' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                >
                  Google Preview
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'social' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                >
                  Social Media Preview
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                >
                  All Meta Tags
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">SEO Score: {result.seoAnalysis.score}/{result.seoAnalysis.maxScore}</h2>
                    <div className="relative h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full ${result.seoAnalysis.score >= 80 ? 'bg-green-500' : result.seoAnalysis.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${(result.seoAnalysis.score / result.seoAnalysis.maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.seoAnalysis.issues.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">Issues Found</h3>
                        <ul className="list-disc pl-5 space-y-1 text-red-700 dark:text-red-400">
                          {result.seoAnalysis.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.seoAnalysis.recommendations.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-700 dark:text-yellow-400 mb-2">Recommendations</h3>
                        <ul className="list-disc pl-5 space-y-1 text-yellow-700 dark:text-yellow-400">
                          {result.seoAnalysis.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.seoAnalysis.passes.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">Passes</h3>
                        <ul className="list-disc pl-5 space-y-1 text-green-700 dark:text-green-400">
                          {result.seoAnalysis.passes.map((pass, index) => (
                            <li key={index}>{pass}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'google' && (
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold mb-4">Google Search Preview</h2>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
                    <div className="text-xl text-blue-600 dark:text-blue-400 font-medium truncate">
                      {result.metaTags.title || 'No title tag found'}
                    </div>
                    <div className="text-green-700 dark:text-green-500 text-sm truncate">
                      {result.url}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                      {result.metaTags.description || 'No meta description found'}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Social Media Previews</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Facebook / Open Graph</h3>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 max-w-md">
                        {result.metaTags.og.image ? (
                          <div className="h-52 bg-gray-200 dark:bg-gray-700 relative">
                            <Image 
                              src={result.metaTags.og.image} 
                              alt="Open Graph preview" 
                              fill 
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-image.jpg';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-52 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">No Open Graph image found</p>
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase">
                            {result.metaTags.og.site_name || new URL(result.url).hostname}
                          </p>
                          <h4 className="font-bold text-gray-900 dark:text-white mt-1">
                            {result.metaTags.og.title || result.metaTags.title || 'No title found'}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-3">
                            {result.metaTags.og.description || result.metaTags.description || 'No description found'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Twitter Card</h3>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 max-w-md">
                        {result.metaTags.twitter.image ? (
                          <div className="h-52 bg-gray-200 dark:bg-gray-700 relative">
                            <Image 
                              src={result.metaTags.twitter.image} 
                              alt="Twitter Card preview" 
                              fill 
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-image.jpg';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-52 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">No Twitter Card image found</p>
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 dark:text-white">
                            {result.metaTags.twitter.title || result.metaTags.title || 'No title found'}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-3">
                            {result.metaTags.twitter.description || result.metaTags.description || 'No description found'}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            {result.url} • {result.metaTags.twitter.site || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">All Meta Tags</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Basic Meta Tags</h3>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <table className="min-w-full">
                          <tbody>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                              <td className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Title</td>
                              <td className="py-2 px-4 font-mono text-sm">{result.metaTags.title || 'Not found'}</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                              <td className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Description</td>
                              <td className="py-2 px-4 font-mono text-sm">{result.metaTags.description || 'Not found'}</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                              <td className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Canonical URL</td>
                              <td className="py-2 px-4 font-mono text-sm">{result.metaTags.canonical || 'Not found'}</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                              <td className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Robots</td>
                              <td className="py-2 px-4 font-mono text-sm">{result.metaTags.robots || 'Not found'}</td>
                            </tr>
                            <tr>
                              <td className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Viewport</td>
                              <td className="py-2 px-4 font-mono text-sm">{result.metaTags.viewport || 'Not found'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Open Graph Tags</h3>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <table className="min-w-full">
                          <tbody>
                            {Object.entries(result.metaTags.og).map(([key, value]) => (
                              <tr key={key} className="border-b border-gray-200 dark:border-gray-800 last:border-0">
                                <td className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">og:{key}</td>
                                <td className="py-2 px-4 font-mono text-sm break-all">{value || 'Not found'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Twitter Card Tags</h3>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <table className="min-w-full">
                          <tbody>
                            {Object.entries(result.metaTags.twitter).map(([key, value]) => (
                              <tr key={key} className="border-b border-gray-200 dark:border-gray-800 last:border-0">
                                <td className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">twitter:{key}</td>
                                <td className="py-2 px-4 font-mono text-sm break-all">{value || 'Not found'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">H1 Tags</h3>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        {result.metaTags.h1Tags.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {result.metaTags.h1Tags.map((tag, index) => (
                              <li key={index} className="font-mono text-sm">{tag}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No H1 tags found</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>SEO Tag Analyzer - Check and optimize your website's meta tags for better search engine visibility</p>
        </div>
      </footer>
    </div>
  );
}
