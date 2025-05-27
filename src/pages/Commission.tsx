import React, { useState,useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import url from '../networking/app_urls';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';


const Commission: React.FC = () => {

  const { id } = useParams(); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [loading, setLoading] = useState(false); // Loading state
  const [reload, setReload] = useState<boolean>(false); // Reload trigger state
  const currentUser = useSelector((state: any) => state.user.currentUser?.data); // User data from Redux
  const [eventCharges, setEventCharges] = useState("");
  const [movieCharges, setMovieCharges] = useState("");
 

 // Fetch roles from API on component mount
 useEffect(() => {
  const fetchCommission = async () => {
    try {
      const response = await axios.get(`${url.getCommissionCharges}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }); // Replace with your API endpoint
      console.log(response.data.data)
      if (response.data.data.length > 0) {
        const firstRecord = response.data.data[0];
       

        setEventCharges(firstRecord.eventCharges);
        setMovieCharges(firstRecord.movieCharges);
      }
     // setUsers(response.data.data); // Assuming the response returns an array of users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  fetchCommission();
}, []);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    if (!eventCharges) {
      setErrorMessage('Please enter event commission.');
      return;
    }

    if (!movieCharges) {
      setErrorMessage('Please enter theatre commission.');
      return;
    }


      const formData = {
      
        movieCharges:movieCharges,
        eventCharges:eventCharges
      }

      setErrorMessage(null);
      setLoading(true);

      try {
        const response = await axios.post(url.createorUpdateCommissionCharges, formData, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
        });

      
        toast.success(
          response.data.message,
        );
     
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(
       'Oops! Something went wrong while sending the commission. Please try again later.',
        );
        setErrorMessage('Oops! Something went wrong while sending the commission. Please try again later.');
      } finally {
        setLoading(false);
      }


    

  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Commission" />
      <div className="flex flex-col gap-9 mb-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
             Event & Theatre Commission
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
          <div className="p-6.5 grid grid-cols-1 md:grid-cols-2 gap-x-5">
                  
             
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Event Commission
                </label>
                <input
                  type="text"
                  placeholder="Enter Event Commission"
                  value={eventCharges}
                  onChange={(e) => setEventCharges(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                Theatre Commission
                </label>
                
                <input
                  type="text"
                  placeholder="Enter Theatre Commission"
                  value={movieCharges}
                  onChange={(e) => setMovieCharges(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 col-span-2">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded bg-[#865BFF] hover:bg-[#6a48c9] p-3 font-medium text-gray md:col-start-2"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* <CityTable reload={reload} /> */}
    </div>
  );
};

export default Commission
