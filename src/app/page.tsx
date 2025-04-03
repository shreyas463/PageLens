"use client";

import { useState } from 'react';
import Image from 'next/image';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

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
  structuredData?: any[];
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>PageLens</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100">
            SEO Tag Analyzer - Technical and SEO details at a glance
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {!result && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Analyze any website&apos;s SEO meta tags and get detailed recommendations to improve search engine visibility.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="url-input" className="sr-only">Website URL</label>
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze SEO Tags'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 max-w-3xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            <p className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mx-auto">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:space-x-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto p-1">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'overview' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('google')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'google' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    Google Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('social')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'social' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    Social Media
                  </button>
                  <button
                    onClick={() => setActiveTab('structured')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'structured' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    Structured Data
                  </button>
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'all' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    All Tags
                  </button>
                </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <h2 className="text-xl font-bold mb-4 md:mb-0">SEO Score: {result.seoAnalysis.score}/{result.seoAnalysis.maxScore}</h2>
                    
                    <div className="w-full md:w-64 h-32 md:h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                          cx="50%" 
                          cy="50%" 
                          innerRadius="60%" 
                          outerRadius="80%" 
                          barSize={10} 
                          data={[{
                            name: 'Score',
                            value: result.seoAnalysis.score,
                            fill: result.seoAnalysis.score >= 80 ? '#22c55e' : result.seoAnalysis.score >= 50 ? '#eab308' : '#ef4444'
                          }]} 
                          startAngle={90} 
                          endAngle={-270}
                        >
                          <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                            max={result.seoAnalysis.maxScore}
                          />
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-2xl font-bold fill-gray-800 dark:fill-white"
                          >
                            {result.seoAnalysis.score}
                          </text>
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-10">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4">SEO Analysis Breakdown</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Issues', value: result.seoAnalysis.issues.length, color: '#ef4444' },
                                { name: 'Passes', value: result.seoAnalysis.passes.length, color: '#22c55e' },
                                { name: 'Recommendations', value: result.seoAnalysis.recommendations.length, color: '#3b82f6' }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {[
                                { name: 'Issues', value: result.seoAnalysis.issues.length, color: '#ef4444' },
                                { name: 'Passes', value: result.seoAnalysis.passes.length, color: '#22c55e' },
                                { name: 'Recommendations', value: result.seoAnalysis.recommendations.length, color: '#3b82f6' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`${value} items`, '']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
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
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden max-w-lg">
                        {result.metaTags.og.image && (
                          <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
                            <Image 
                              src={result.metaTags.og.image}
                              alt="Open Graph preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{result.url}</div>
                          <h5 className="text-base font-medium mb-1 line-clamp-2">{result.metaTags.og.title || result.metaTags.title}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{result.metaTags.og.description || result.metaTags.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Twitter Card</h3>
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden max-w-lg">
                        {result.metaTags.twitter.image ? (
                          <div className="relative h-52 bg-gray-100 dark:bg-gray-700">
                            <Image 
                              src={result.metaTags.twitter.image}
                              alt="Twitter Card preview"
                              fill
                              className="object-cover"
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
                          <h5 className="text-base font-medium mb-1 line-clamp-2">
                            {result.metaTags.twitter.title || result.metaTags.title || 'No title found'}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {result.metaTags.twitter.description || result.metaTags.description || 'No description found'}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.url}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'structured' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Structured Data Analysis</h2>
                  
                  {result.metaTags.structuredData && result.metaTags.structuredData.length > 0 ? (
                    <div>
                      <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-4">Schema Types</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                layout="vertical"
                                data={Array.from(new Set(result.metaTags.structuredData?.map(item => item['@type'] || 'Unknown') || [])).map(type => ({
                                  name: type,
                                  count: result.metaTags.structuredData?.filter(item => (item['@type'] || 'Unknown') === type).length || 0
                                }))}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip formatter={(value: number) => [`${value} items`, 'Count']} />
                                <Bar dataKey="count" fill="#6366f1" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="w-full md:w-2/3">
                          <p className="mb-4 text-green-600 dark:text-green-400 font-medium flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Found {result.metaTags.structuredData.length} structured data items
                          </p>
                          
                          <div className="space-y-4">
                            {result.metaTags.structuredData.map((item, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                                <h4 className="font-medium mb-2 flex items-center">
                                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                  Schema Type: {item['@type'] || 'Unknown'}
                                </h4>
                                <pre className="text-xs overflow-x-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                  {JSON.stringify(item, null, 2)}
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
                        <p className="text-red-600 dark:text-red-400 font-medium flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          No structured data found
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">The website doesn't have any structured data implemented. Adding structured data can help search engines better understand your content and may enable rich results in search listings.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-4">Benefits of Structured Data</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Enhanced search results with rich snippets</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Better understanding of your content by search engines</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Potential for higher click-through rates</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Eligibility for special search result features</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>Add JSON-LD structured data to your page</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>Consider using schemas relevant to your content (Article, Product, LocalBusiness, etc.)</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>Test your structured data with Google's Rich Results Test</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>Implement multiple schema types where appropriate</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'all' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">All Meta Tags</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
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

      <footer className="mt-12 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">PageLens: SEO Tag Analyzer</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Check and optimize your website's meta tags for better search engine visibility</p>
        </div>
      </footer>
    </div>
  );
}
