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
    const response = await axios.get(`${CMS_API_URL}/product-categories?populate=images`);
    res.status(200).json(response.data);
    console.log(response.data);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Internal server error'
    });
  }
} 