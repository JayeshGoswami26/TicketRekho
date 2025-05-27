// import React from 'react';
// import CardDataStats from '../../components/CardDataStats';
// import SellerMTable from './SellerMTable';
// import {
//   faShoppingCart,
//   faUsers,
// } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import ManagerMeter from '../../components/Charts/ManagerMeter';

// const ManagerDash: React.FC = () => {

//   const managerCards = [
//     {
//       title: 'Total Sales',
//       total: '3,456',
//       rate: '0.43%',
//       levelUp: true,
//       icon: faShoppingCart,
//     },

//     {
//       title: 'Total Sellers',
//       total: '567',
//       rate: '0.12%',
//       levelUp: true,
//       icon: faUsers,
//     },

//   ];

//   return (
//     <>
//       <div className="mb-4 grid grid-col-1  xl:grid-cols-3 gap-4  md:gap-6 2xl:gap-7.5">
//         <ManagerMeter />

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
//           {managerCards.map((item, index) => (
//             <CardDataStats
//               key={index}
//               title={item.title}
//               total={item.total}

//             >
//               <FontAwesomeIcon icon={item.icon} />

//             </CardDataStats>
//           ))}
//         </div>
//       </div>

//       <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
//         <div className="col-span-12">
//           <SellerMTable />
//         </div>
//       </div>
//     </>
//   );
// };

// export default ManagerDash;

import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import SellerMTable from './SellerMTable';
import { faShoppingCart, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ManagerMeter from '../../components/Charts/ManagerMeter';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';

const ManagerDash: React.FC = () => {
  const [data, setData] = useState({
    totalSales: 0,
    totalSeller: 0,
    todayTarget: 0,
    rate: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Urls.managerDashUrl}`, {
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

  const managerCards = [
    {
      title: 'Total Sales',
      total: data.totalSales.toString(),

      icon: faShoppingCart,
    },
    {
      title: 'Total Sellers',
      total: data.totalSeller.toString(),

      icon: faUsers,
    },
  ];

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <>
      <div className="mb-4 grid grid-col-1  xl:grid-cols-3 gap-4  md:gap-6 2xl:gap-7.5">
        {/* Pass todayTarget value to ManagerMeter */}
        <ManagerMeter todayTarget={data.todayTarget} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
          {managerCards.map((item, index) => (
            <CardDataStats key={index} title={item.title} total={item.total}>
              <FontAwesomeIcon icon={item.icon} />
            </CardDataStats>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <SellerMTable />
        </div>
      </div>
    </>
  );
};

export default ManagerDash;
