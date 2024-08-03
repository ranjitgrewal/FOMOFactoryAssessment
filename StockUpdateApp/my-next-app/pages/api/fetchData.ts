// pages/api/fetchData.ts
// gets data for a all stocks and writes to DB

import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import Stock from '../../models/Stock';

export const IDs = ["bitcoin","ethereum" ,"tether","binancecoin", "solana"];
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  // Create a function to make multiple API calls in parallel.
  async function fetchMultipleStocks() {
    const data = [];
    for (let i = 0; i < IDs.length; i++) {
      let endpoint='https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + IDs[i] +'&x_cg_demo_api_key=CG-CCgty44mN28HAmAXauKsFnnL';
      const response = await fetch(endpoint);
      const json = await response.json();
      data.push(json);
      }
    return data;
    }
  
  try {
    const responses = await fetchMultipleStocks();
    let vals=Object.values(responses);
    await Stock.insertMany(vals.map((item: any) => ({
      data: item
    })));
    res.status(200).json({ message: 'Data fetched and saved to MongoDB' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from external API' });
  }
}
