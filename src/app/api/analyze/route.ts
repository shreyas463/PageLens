import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the HTML content of the provided URL
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzerBot/1.0)',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract meta tags
    const metaTags: Record<string, any> = {};
    
    // Title
    metaTags.title = $('title').text();
    
    // Meta description
    metaTags.description = $('meta[name="description"]').attr('content') || '';
    
    // Canonical URL
    metaTags.canonical = $('link[rel="canonical"]').attr('href') || '';
    
    // Robots
    metaTags.robots = $('meta[name="robots"]').attr('content') || '';
    
    // Viewport
    metaTags.viewport = $('meta[name="viewport"]').attr('content') || '';
    
    // Open Graph tags
    metaTags.og = {
      title: $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[property="og:description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || '',
      url: $('meta[property="og:url"]').attr('content') || '',
      type: $('meta[property="og:type"]').attr('content') || '',
      site_name: $('meta[property="og:site_name"]').attr('content') || '',
    };
    
    // Twitter Card tags
    metaTags.twitter = {
      card: $('meta[name="twitter:card"]').attr('content') || '',
      site: $('meta[name="twitter:site"]').attr('content') || '',
      title: $('meta[name="twitter:title"]').attr('content') || '',
      description: $('meta[name="twitter:description"]').attr('content') || '',
      image: $('meta[name="twitter:image"]').attr('content') || '',
      creator: $('meta[name="twitter:creator"]').attr('content') || '',
    };
    
    // Favicon
    metaTags.favicon = $('link[rel="icon"]').attr('href') || 
                       $('link[rel="shortcut icon"]').attr('href') || '';
    
    // H1 tags (for SEO analysis)
    const h1Tags: string[] = [];
    $('h1').each((i, el) => {
      h1Tags.push($(el).text().trim());
    });
    metaTags.h1Tags = h1Tags;
    
    // Generate SEO analysis and recommendations
    const seoAnalysis = analyzeSEO(metaTags);
    
    return NextResponse.json({
      url,
      metaTags,
      seoAnalysis,
    });
  } catch (error: any) {
    console.error('Error analyzing website:', error);
    return NextResponse.json(
      { error: `Failed to analyze website: ${error.message}` },
      { status: 500 }
    );
  }
}

function analyzeSEO(metaTags: Record<string, any>) {
  const analysis = {
    score: 0,
    maxScore: 100,
    issues: [] as string[],
    recommendations: [] as string[],
    passes: [] as string[],
  };
  
  let points = 0;
  const checks = 15; // Increased number of checks for more granular scoring
  const pointsPerCheck = analysis.maxScore / checks;
  
  // Check title - stricter requirements
  if (metaTags.title) {
    const titleLength = metaTags.title.length;
    const titleWords = metaTags.title.split(/\s+/).filter(Boolean).length;
    
    // Check title length (30-55 chars is optimal for search engines)
    if (titleLength >= 30 && titleLength <= 55) {
      points += pointsPerCheck * 0.6;
      analysis.passes.push('Title tag has optimal length (30-55 characters)');
    } else if (titleLength > 55 && titleLength < 60) {
      points += pointsPerCheck * 0.3;
      analysis.issues.push(`Title tag length (${titleLength} characters) is slightly above optimal range`);
      analysis.recommendations.push('Consider shortening title tag to 30-55 characters for better display in search results');
    } else {
      analysis.issues.push(`Title tag length (${titleLength} characters) is outside optimal range`);
      analysis.recommendations.push('Title tag should be between 30-55 characters for optimal search display');
    }
    
    // Check if title contains 3-9 words (optimal for readability and SEO)
    if (titleWords >= 3 && titleWords <= 9) {
      points += pointsPerCheck * 0.4;
      analysis.passes.push(`Title contains ${titleWords} words (optimal is 3-9 words)`);
    } else {
      analysis.issues.push(`Title contains ${titleWords} words (outside optimal range)`);
      analysis.recommendations.push('Title should contain 3-9 words for better SEO performance');
    }
  } else {
    analysis.issues.push('Missing title tag (critical SEO issue)');
    analysis.recommendations.push('Add a descriptive title tag immediately - this is a fundamental SEO element');
  }
  
  // Check meta description - stricter requirements
  if (metaTags.description) {
    const descLength = metaTags.description.length;
    
    // Check description length (120-155 chars is optimal for search engines)
    if (descLength >= 120 && descLength <= 155) {
      points += pointsPerCheck;
      analysis.passes.push('Meta description has optimal length (120-155 characters)');
    } else if ((descLength >= 110 && descLength < 120) || (descLength > 155 && descLength <= 165)) {
      points += pointsPerCheck * 0.5;
      analysis.issues.push(`Meta description length (${descLength} characters) is slightly outside optimal range`);
      analysis.recommendations.push('Adjust meta description to 120-155 characters for optimal search display');
    } else {
      analysis.issues.push(`Meta description length (${descLength} characters) is far from optimal`);
      analysis.recommendations.push('Meta description should be between 120-155 characters for optimal search display');
    }
    
    // Check if description contains a call to action
    const ctaPatterns = /(learn|discover|find|get|read|view|see|check|explore|start|try|contact|call|download|sign up|register|buy|shop|order|visit)/i;
    if (ctaPatterns.test(metaTags.description)) {
      points += pointsPerCheck * 0.5;
      analysis.passes.push('Meta description contains a call to action');
    } else {
      analysis.issues.push('Meta description lacks a clear call to action');
      analysis.recommendations.push('Include a call to action in your meta description to improve click-through rates');
    }
  } else {
    analysis.issues.push('Missing meta description (critical SEO issue)');
    analysis.recommendations.push('Add a compelling meta description immediately - this significantly affects click-through rates');
  }
  
  // Check canonical URL
  if (metaTags.canonical) {
    // Check if canonical URL is properly formatted
    if (metaTags.canonical.startsWith('http')) {
      points += pointsPerCheck;
      analysis.passes.push('Canonical URL is properly specified');
    } else {
      points += pointsPerCheck * 0.3;
      analysis.issues.push('Canonical URL is present but may not be properly formatted');
      analysis.recommendations.push('Ensure canonical URL uses absolute path with http/https protocol');
    }
  } else {
    analysis.issues.push('Missing canonical URL (important for preventing duplicate content)');
    analysis.recommendations.push('Add a canonical URL to prevent duplicate content issues and consolidate link signals');
  }
  
  // Check robots meta tag - more detailed analysis
  if (metaTags.robots) {
    const robotsValue = metaTags.robots.toLowerCase();
    if (robotsValue.includes('noindex')) {
      points += pointsPerCheck * 0.3;
      analysis.issues.push('Robots meta tag includes "noindex" directive - page will not be indexed');
      analysis.recommendations.push('Remove "noindex" directive if you want this page to appear in search results');
    } else if (robotsValue.includes('index') && robotsValue.includes('follow')) {
      points += pointsPerCheck;
      analysis.passes.push('Robots meta tag properly configured for indexing and following links');
    } else {
      points += pointsPerCheck * 0.7;
      analysis.passes.push('Robots meta tag is specified');
      analysis.recommendations.push('Consider using "index, follow" in robots meta tag for optimal crawling');
    }
  } else {
    analysis.issues.push('Missing robots meta tag');
    analysis.recommendations.push('Add a robots meta tag with "index, follow" for optimal search engine crawling');
  }
  
  // Check viewport for mobile optimization
  if (metaTags.viewport) {
    if (metaTags.viewport.includes('width=device-width') && metaTags.viewport.includes('initial-scale=1')) {
      points += pointsPerCheck;
      analysis.passes.push('Viewport meta tag is properly configured for responsive design');
    } else {
      points += pointsPerCheck * 0.5;
      analysis.issues.push('Viewport meta tag is present but may not be optimally configured');
      analysis.recommendations.push('Set viewport to "width=device-width, initial-scale=1" for proper mobile rendering');
    }
  } else {
    analysis.issues.push('Missing viewport meta tag (critical for mobile SEO)');
    analysis.recommendations.push('Add a viewport meta tag for better mobile experience - mobile optimization is a ranking factor');
  }
  
  // Check Open Graph tags - more comprehensive check
  const requiredOgTags = ['title', 'description', 'image', 'url', 'type'];
  const missingOgTags = requiredOgTags.filter(tag => !metaTags.og[tag]);
  
  if (missingOgTags.length === 0) {
    points += pointsPerCheck;
    analysis.passes.push('All essential Open Graph tags are implemented');
    
    // Check OG image dimensions if available
    if (metaTags.og.image && !metaTags.og.image.includes('placeholder')) {
      // We can't check actual dimensions here, but we can recommend best practices
      analysis.recommendations.push('Ensure Open Graph image is at least 1200×630 pixels for optimal display');
    }
  } else if (missingOgTags.length <= 2) {
    points += pointsPerCheck * (1 - (missingOgTags.length / requiredOgTags.length));
    analysis.issues.push(`Missing some Open Graph tags: ${missingOgTags.join(', ')}`);
    analysis.recommendations.push(`Add missing Open Graph tags: ${missingOgTags.join(', ')} for better social sharing`);
  } else {
    analysis.issues.push('Several required Open Graph tags are missing');
    analysis.recommendations.push('Implement all essential Open Graph tags (title, description, image, url, type) for optimal social sharing');
  }
  
  // Check Twitter Card tags - more comprehensive check
  const requiredTwitterTags = ['card', 'title', 'description', 'image'];
  const missingTwitterTags = requiredTwitterTags.filter(tag => !metaTags.twitter[tag]);
  
  if (missingTwitterTags.length === 0) {
    points += pointsPerCheck;
    analysis.passes.push('All essential Twitter Card tags are implemented');
    
    // Check Twitter card type
    if (metaTags.twitter.card === 'summary_large_image') {
      points += pointsPerCheck * 0.2;
      analysis.passes.push('Using optimal "summary_large_image" Twitter card type for better visibility');
    } else {
      analysis.recommendations.push('Consider using "summary_large_image" Twitter card type for better visibility');
    }
  } else if (missingTwitterTags.length <= 2) {
    points += pointsPerCheck * (1 - (missingTwitterTags.length / requiredTwitterTags.length));
    analysis.issues.push(`Missing some Twitter Card tags: ${missingTwitterTags.join(', ')}`);
    analysis.recommendations.push(`Add missing Twitter Card tags: ${missingTwitterTags.join(', ')} for better Twitter sharing`);
  } else {
    analysis.issues.push('Several required Twitter Card tags are missing');
    analysis.recommendations.push('Implement all essential Twitter Card tags (card, title, description, image) for optimal Twitter sharing');
  }
  
  // Check favicon - more detailed check
  if (metaTags.favicon) {
    if (metaTags.favicon.endsWith('.ico') || metaTags.favicon.endsWith('.png')) {
      points += pointsPerCheck;
      analysis.passes.push('Favicon is properly specified');
    } else {
      points += pointsPerCheck * 0.5;
      analysis.issues.push('Favicon format may not be optimal');
      analysis.recommendations.push('Use .ico or .png format for favicon with multiple sizes (16x16, 32x32, 48x48)');
    }
  } else {
    analysis.issues.push('Missing favicon (affects brand recognition and professionalism)');
    analysis.recommendations.push('Add a favicon for better brand recognition and user experience');
  }
  
  // Check H1 tags - more detailed analysis
  if (metaTags.h1Tags.length === 1) {
    const h1Text = metaTags.h1Tags[0];
    const h1Length = h1Text.length;
    const h1Words = h1Text.split(/\s+/).filter(Boolean).length;
    
    if (h1Length >= 20 && h1Length <= 70) {
      points += pointsPerCheck * 0.7;
      analysis.passes.push('H1 tag has good length (20-70 characters)');
    } else {
      analysis.issues.push(`H1 tag length (${h1Length} characters) is not optimal`);
      analysis.recommendations.push('H1 tag should be between 20-70 characters for better readability and SEO');
    }
    
    // Check if H1 contains 3-10 words
    if (h1Words >= 3 && h1Words <= 10) {
      points += pointsPerCheck * 0.3;
      analysis.passes.push('H1 tag has optimal word count (3-10 words)');
    } else {
      analysis.recommendations.push('Aim for 3-10 words in your H1 tag for better readability and SEO');
    }
  } else if (metaTags.h1Tags.length === 0) {
    analysis.issues.push('Missing H1 tag (critical SEO element)');
    analysis.recommendations.push('Add a single H1 tag that clearly describes the page content - this is a fundamental SEO element');
  } else {
    analysis.issues.push(`Multiple H1 tags found (${metaTags.h1Tags.length}) - this is against SEO best practices`);
    analysis.recommendations.push('Use exactly one H1 tag per page for optimal SEO structure');
  }
  
  // Check if title and description are unique and not duplicated
  if (metaTags.title && metaTags.description) {
    // Calculate similarity between title and description
    const titleWords = new Set(metaTags.title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3));
    const descWords = new Set(metaTags.description.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3));
    
    // Find common words (excluding small words)
    const commonWords = [...titleWords].filter(word => descWords.has(word));
    const similarityRatio = commonWords.length / titleWords.size;
    
    if (similarityRatio < 0.4) {
      points += pointsPerCheck;
      analysis.passes.push('Title and meta description are sufficiently unique');
    } else if (similarityRatio < 0.6) {
      points += pointsPerCheck * 0.5;
      analysis.issues.push('Title and meta description share too many keywords');
      analysis.recommendations.push('Reduce keyword overlap between title and description for better SEO diversity');
    } else {
      analysis.issues.push('Title and meta description are too similar');
      analysis.recommendations.push('Create more diverse content between title and meta description');
    }
  }
  
  // Check for keyword presence in important elements
  if (metaTags.title && metaTags.description && metaTags.h1Tags.length > 0) {
    // Extract potential keywords from title
    const titleWords = metaTags.title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 4);
    
    // Check if any significant title words appear in both description and H1
    const keywordsInAll = titleWords.filter((word: string) => {
      return metaTags.description.toLowerCase().includes(word) && 
             metaTags.h1Tags[0].toLowerCase().includes(word);
    });
    
    if (keywordsInAll.length > 0) {
      points += pointsPerCheck;
      analysis.passes.push('Key terms are consistently used across title, description, and H1 tag');
    } else {
      analysis.issues.push('Inconsistent use of keywords across title, description, and H1 tag');
      analysis.recommendations.push('Ensure consistent use of key terms across title, meta description, and H1 tag');
    }
  }
  
  // Apply a stricter grading curve
  // This makes it harder to get a high score
  const curvedScore = Math.round(Math.pow(points / analysis.maxScore, 1.2) * analysis.maxScore);
  analysis.score = Math.min(curvedScore, 100);
  
  return analysis;
}
