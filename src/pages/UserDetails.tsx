import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import SellersTable from '../components/Tables/SellersTable';
import Urls from '../networking/app_urls';
import { useSelector } from 'react-redux';
import SellerMTable from './Manager/SellerMTable';
import UserTicketsTable from '../components/Tables/UserTicketsTable';
import MoviesTicket from './TheatreManager/moviesTickets';

interface Manager {
  id: number;
  name: string | null;
  email: string | null;
  mobileNumber: string | null;
  profileImage: string | null;
  cityId: {
    name: string | null;
  } | null;
  stateId: {
    name: string | null;
  } | null;
}


const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [manager, setManager] = useState<Manager | null>(null);

  const [filteredSellersCount, setFilteredSellersCount] = useState(0);

  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  const handleFilteredSellersCount = (count: number) => {
    setFilteredSellersCount(count);
  };

  useEffect(() => {
    axios
      .get(`${Urls.userDetail}/${id}`, {
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
      <Breadcrumb pageName="User Details" parentName="Users" parentPath="/users" />

      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <img
          src={
            manager.profileImage
              ? `${Urls.Image_url}${manager.profileImage}`
              : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010' // <- default fallback image URL
          }
          alt={manager.name || 'N/A'}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />

          <h1 className="text-2xl font-bold text-center mb-2">
            {manager.name || 'N/A'}
          </h1>
          <p className="text-center text-gray-600 mb-4">
            {/* {manager.company.name} */}
          </p>
          <div className="text-gray-800">
            <p>
              <strong>Email:</strong> {manager.email || 'N/A'}
            </p>
            <p>
              <strong>Phone Number:</strong> {manager.mobileNumber || 'N/A'}
            </p>

            <p>
              <strong>State:</strong> {manager.stateId?.name || 'N/A'}
            </p>
            <p>
              <strong>City:</strong> {manager.cityId?.name || 'N/A'}
            </p>
           
          </div>
        </div>

        <UserTicketsTable
          userId={id ?? ''}
          onFilteredSellersChange={handleFilteredSellersCount}
        />
       
      </div>
    </>
  );
};

export default UserDetails;
