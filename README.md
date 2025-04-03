# PageLens: SEO Tag Analyzer

Technical and SEO details at a glance - an interactive web application that helps you analyze and optimize your website's SEO meta tags. This tool fetches the HTML of any website and provides detailed feedback on SEO tags according to best practices.

## Features

- **Meta Tag Analysis**: Extracts and displays all important SEO-related meta tags from any website
- **SEO Score**: Calculates an overall SEO score based on meta tag implementation
- **Visual Previews**: Shows how your site will appear in Google search results and social media shares
- **Interactive Data Visualizations**: Displays SEO analysis with beautiful charts and graphs
- **Structured Data Analysis**: Detects and visualizes JSON-LD structured data on your website
- **Detailed Recommendations**: Provides actionable insights to improve your SEO
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Preview Tabs

1. **Overview**: See your SEO score, issues, recommendations, and passes at a glance with interactive charts
2. **Google Preview**: Visualize how your site appears in Google search results
3. **Social Media Preview**: See Facebook/Open Graph and Twitter Card previews
4. **Structured Data**: Analyze JSON-LD structured data with visual breakdown of schema types
5. **All Meta Tags**: View all extracted meta tags in detail

## SEO Tags Analyzed

- Title tag
- Meta description
- Canonical URL
- Robots meta tag
- Viewport meta tag
- Open Graph tags (for Facebook/social media)
- Twitter Card tags
- Favicon
- H1 tags
- Structured data (JSON-LD)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the SEO Tag Analyzer.

## How to Use

1. Enter a website URL in the input field (with or without http/https)
2. Click "Analyze SEO Tags"
3. View the analysis results across the different tabs
4. Implement the recommendations on your website to improve SEO

## Technologies Used

- Next.js (React framework)
- TypeScript
- Tailwind CSS (for styling)
- Recharts (for interactive data visualizations)
- Axios (for HTTP requests)
- Cheerio (for HTML parsing)

## Deployment

This application is deployed on Netlify and can also be deployed to Vercel or any other hosting platform that supports Next.js applications.
