// pages/index.tsx

import { GetServerSideProps } from 'next';
import connectToDatabase from '../lib/mongodb';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setStock } from '../store';
import { Key, useEffect } from 'react';
import axios from 'axios';
import Stock from '../models/Stock';



let stock_id;

let vals;
//var stock_id= sessionStorage.getItem(JSON.stringify("stock_id"));

interface DataProps {
  initialData: {  data: Object }[];
}
export const IDs = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  tether : "tether",
  binancecoin : "binancecoin",
  solana : "solana"
};

const Home = ({ initialData }: DataProps) => {
  const dispatch = useDispatch();
  let data = useSelector((state: RootState) => state.stock.stock);
  
  useEffect(() => {
    dispatch(setStock(initialData));
  }, [initialData, dispatch]);

// gets data for a all stocks and writes to DB
  const fetchData = async () => {
    try {
      await axios.get('/api/fetchData');
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };
  setInterval(fetchData, 30000);

// gets data for the stock chosen from drop down ,shows all stocks by default
 const showStock = async (event: { target: { value: any; }; }) => {
  var stock_id = event.target.value;
    const id = (event.target.value);
    stock_id = id;
    if (stock_id in IDs){
      const respdata = await axios.get('/api/getData?'+stock_id);
      const dataData =(respdata.data);
      //document.getElementById("table_body").innerHTML=(JSON.stringify(dataData));
      var html = '';
      dataData.forEach(listItem => {

            const h1 = `<p> ${JSON.stringify(listItem.data)} </p>`;
            html+=h1;
      });

   document.getElementById('table_body').innerHTML=html;
  } else{
    window.location.reload();
  }
  }

  vals = Object.values(data);
  return (
    <div>
      <h1>Data Table-By default shows data for recent 20 entries for  all stocks in the list, choose from list for each stock</h1>  
      <select name="stock_name" id="stock_name" onChange={showStock}>
      <option value="Choose a stock">Choose a stock</option>
        {Object.keys(IDs).map((stockKey) => (
          <option key={stockKey} value={stockKey}>
            {IDs[stockKey]}
          </option>
        ))}
      </select>   
      <table id="stable">
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody id="table_body">
          {vals.map((item: { data: any; }, index: Key | null | undefined) => (
            <tr key={index}>
              <td><div>{JSON.stringify(index)}</div></td>
              <td><div>{JSON.stringify(item.data)}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  };

//first load call 
export const getServerSideProps: GetServerSideProps = async () => {
    await connectToDatabase();
    const data = await Stock.find({}).limit(20).lean();
   // const data = await Data.find({}).lean();
      return {
        props: {
          initialData: data.map(item => ({
            data: JSON.parse(JSON.stringify(item))
          })),
        },
      };
  };

export default Home;



