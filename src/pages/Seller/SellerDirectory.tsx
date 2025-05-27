

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';

interface Seller {
  _id: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  location: string;
  profileImage: string;
  active: boolean;
}

const SellerDirectory: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

    const currentUser = useSelector(
      (state: any) => state.user.currentUser.data,
    );


  // Payload for the POST request
  const payload = {
    page: 1,
    limit: 10, // Adjust based on your needs
  };

  // Fetch data from the POST API
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.post<{ data: Seller[] }>(
          `${Urls.SellerDirectory}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          },
        ); // Update the URL to your actual API
        setSellers(response.data.data); // Assuming response.data.data contains the seller array
      } catch (error) {
        setError('Error fetching seller data');
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>

      <div className="grid grid-cols-1 gap-4">
        {/* Seller List */}
        <div className="flex flex-col gap-2">
          {loading
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr key={index}>
                    <td className="py-4 px-4 border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-default w-screen">
                      <div className="animate-pulse flex space-x-4 items-center">
                        <div className="rounded-full bg-slate-200 dark:bg-slate-300 h-10 w-10"></div>
                        <div className="flex-1 space-y-4 py-1 items-start flex flex-col ">
                          <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-2/3"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
            : sellers.map((seller) => (
                <div
                  key={seller._id}
                  className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex justify-between"
                >
                  <div className="flex flex-col items-start justify-center gap-1">
                    <div className="flex gap-3 items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={`${Urls.Image_url}${seller.profileImage}`} // Replace with actual image path
                        alt={seller.firstName}
                      />
                      <h4 className="text-base md:text-title-md font-bold text-black dark:text-white">
                        {`${seller.firstName} ${seller.lastName}`}
                      </h4>
                    </div>
                    <span className="text-base font-medium">
                      Contact: {seller.whatsappNumber}
                    </span>
                    <span className="text-base font-medium">
                      Address: {seller.location}
                    </span>
                  </div>
                  {/* <div className="flex flex-col items-end justify-center">
                <h4 className="text-base md:text-title-md font-bold text-black dark:text-white">
                  {seller.active ? 'Active' : 'Inactive'}
                </h4>
                <span
                  className={`text-base font-medium ${
                    seller.active ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {seller.active ? 'Active' : 'Inactive'}
                </span>
              </div> */}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDirectory;
