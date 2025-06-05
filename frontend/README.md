# My Next.js Store

A modern e-commerce store built with Next.js and Strapi.

## Features

- Product listings with categories
- Dynamic product and category pages
- Responsive design
- Server-side rendering
- API integration with Strapi

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/public` - Static files
- `/src/components` - React components
- `/src/pages` - Next.js pages
- `/src/styles` - CSS styles
- `/src/lib` - API and utility functions
- `/src/utils` - Helper functions and constants

## Technologies Used

- Next.js
- React
- Strapi (Headless CMS)
- Axios
- CSS Modules

## License

MIT
