import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Calendar from './Calendar';
import CustomerTable from '../components/Tables/CustomerTable';
import Urls from '../networking/app_urls';
import { useSelector } from 'react-redux';

interface Manager {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  todayAchievedCount: number;
  salespersons: number;
  data: object;
}

const SellerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [manager, setManager] = useState<Manager | null>(null);


  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  useEffect(() => {
    axios.get(`${Urls.profileDetailUrl}/${id}`,{
        headers: {
          Authorization: `Bearer ${currentUser.token}`, 
        },
      })
        .then((response) => {
          const managerData = {
            ...response.data.data,
          };
          setManager(managerData);
        })
        .catch((error) => {
          console.error('There was an error fetching the data!', error);
        });
  }, [id]);

  if (!manager) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Seller's Details" />

      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <img
            src={`${Urls.Image_url}${manager.profileImage}`}
            alt={manager.name}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-center mb-2">
            {manager.name}
          </h1>
          <p className="text-center text-gray-600 mb-4">
            {/* {manager.company.name} */}
          </p>
          <div className="text-gray-800">
            <p>
              <strong>Email:</strong> {manager.email}
            </p>
            <p>
              <strong>Phone:</strong> {manager.phoneNumber}
            </p>
            {/* <p>
          <strong>Website:</strong> {manager.website}
        </p> */}
            <p>
              <strong>Today's Sales:</strong> {manager.todayAchievedCount}
            </p>
            {/* <p>
              <strong>Number of Customers:</strong> {manager.salespersons}
            </p> */}
          </div>
        </div>

        <CustomerTable sellerId={id ?? ''} />
      </div>
    </>
  );
};

export default SellerDetails;

