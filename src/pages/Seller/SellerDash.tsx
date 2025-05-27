import React, { useEffect, useState } from 'react';
import Meter from '../../components/Charts/Meter';
import EarningsCard from './EarningsCard';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import SellerMeter from '../../components/Charts/SellerMeter';

const SellerDash: React.FC = () => {
  const [data, setData] = useState({
    todayTarget: 0,
    yesterdayTarget: 0,
    totalSales: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Urls.sellerDashUrl}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        if (response.data.status) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="mb-4 grid grid-col-1  lg:grid-cols-2 gap-4  md:gap-6 2xl:gap-7.5">
        <div className="col-span-5 lg:col-span-1 dark:border-strokedark dark:bg-boxdark">
          <SellerMeter totalSales={data.totalSales} />
        </div>

        <div className="col-span-5 lg:col-span-1">
          <EarningsCard />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Tickets Sold */}
        <div className="col-span-5 lg:col-span-1">
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="mt-4">
              <h4 className="text-title-xl md:text-title-xxl font-bold text-black dark:text-white">
                {data.todayTarget}
              </h4>
              <span className="text-base font-medium">Today's Target</span>
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="col-span-5 lg:col-span-1">
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="mt-4">
              <h4 className="text-title-xl md:text-title-xxl font-bold text-black dark:text-white">
                {data.yesterdayTarget}
              </h4>
              <span className="text-base font-medium">
                Yesterday's accomplished
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerDash;