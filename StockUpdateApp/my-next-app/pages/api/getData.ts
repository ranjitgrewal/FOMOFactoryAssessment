// pages/api/getData.ts
// gets data for a particular stock passed as query 
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import Stock from '../../models/Stock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let uri= req.url;
  let stock_id= (uri).split("?")[1];
  try {
    await connectToDatabase();
    const data = await Stock.find({"data.id" : stock_id}).limit(20);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from external API' });
  }
}
