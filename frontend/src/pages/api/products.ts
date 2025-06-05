import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const CMS_API_URL = 'https://cms.miraiyantra.com/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { page = 1, pageSize = 12, slug } = req.query;
    
    let url = `${CMS_API_URL}/products?populate=productimages`;
    
    if (slug) {
      url += `&filters[slug][$eq]=${slug}`;
    } else {
      url += `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    }

    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Internal server error'
    });
  }
} 