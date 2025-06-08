import { CMS_BASE_URL } from './config';

// Base64 encoded 1x1 transparent pixel
export const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Helper function to get image URL from a populated image object
export const getImageUrl = (image: { url?: string, formats?: any, documentId?: string, file?: Array<{ url: string }> } | null | undefined): string => {
  // If no image object or no URL, return placeholder
  if (!image) return PLACEHOLDER_IMAGE;
  
  // If we have a direct URL from the populated image object (legacy or if Strapi structure changes)
  if (image.url) {
    // If the URL is already absolute, return it
    if (image.url.startsWith('http')) {
      return image.url;
    }
    // Otherwise, prepend the CMS base URL
    return `${CMS_BASE_URL}${image.url}`;
  }

  // If the image object has a 'file' array and the first file has a url (new Strapi populate structure)
  if (image.file && image.file.length > 0 && image.file[0].url) {
     const fileUrl = image.file[0].url;
     // Handle absolute vs relative URL for the file url
     if (fileUrl.startsWith('http')) {
         return fileUrl;
     }
     return `${CMS_BASE_URL}${fileUrl}`;
  }

  // If we have formats (Strapi's image variations - might still be relevant depending on Strapi setup)
  if (image.formats) {
    // Try to get the smallest format first (thumbnail)
    const format = image.formats.thumbnail || image.formats.small || image.formats.medium || image.formats.large;
    if (format?.url) {
      return `${CMS_BASE_URL}${format.url}`;
    }
  }

  // If we only have documentId (legacy case - keep as a fallback but note it's deprecated)
  if (image.documentId) {
    console.warn('Using documentId for image URL is deprecated. Please update to use populated image objects with url.');
    return `${CMS_BASE_URL}/uploads/${image.documentId}`;
  }

  // Fallback to placeholder
  return PLACEHOLDER_IMAGE;
}; 