import React, { useState,useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import url from '../networking/app_urls';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

//import CityTable from '../components/Tables/CityTable';

const AssignCoupon: React.FC = () => {
  // const [city, setCity] = useState<string>(''); // City name state
  // const [file, setFile] = useState<File | null>(null); // File state
  const { id } = useParams(); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [loading, setLoading] = useState(false); // Loading state
  const [reload, setReload] = useState<boolean>(false); // Reload trigger state
  const currentUser = useSelector((state: any) => state.user.currentUser?.data); // User data from Redux

 const [users, setUsers] = useState<{ _id: string; name: string, email: string, mobileNumber: string }[]>([]); // To store User from API
  const [selectedUserId, setSelectedUserId] = useState<string>(''); // Store selected user's ID
  const [type, setType] = useState(""); //Notification type state
  const [couponCode, setCouponCode] = useState<string>('');
  // const handleCityChange = (e: ChangeEvent<HTMLInputElement>) =>
  //   setCity(e.target.value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value",e.target.value);
    setType(e.target.value); // Update state when radio button is selected
  };

  useEffect(() => {
    const fetchCouponDetail = async () => {

      const couponData = {
        couponId:id
      }

      try {
        const response = await axios.post(url.getCouponDetail, couponData, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
        });
        setCouponCode(response.data.data.code); 
        

      } catch (err) {
        console.error('Error fetching state:', err);
      }
    };
  
    if (id) fetchCouponDetail();
  }, [id, currentUser.token]);


 // Fetch roles from API on component mount
 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url.getAllUserList}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }); // Replace with your API endpoint
      console.log(response.data.data)
      setUsers(response.data.data); // Assuming the response returns an array of roles
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  fetchUsers();
}, []);


  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = event.target.value;
  //  console.log("selectedUserId",selectedUserId);
    setSelectedUserId(selectedUserId);
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    if (!type) {
      setErrorMessage('Please select type.');
      return;
    }


    if(type ==='Single'){
  
      if (!selectedUserId) {
        setErrorMessage('Please select username.');
        return;
      }

      const formData = {
        couponId:id,
        appUserId:selectedUserId
      }

      setErrorMessage(null);
      setLoading(true);
    

      try {
        const response = await axios.post(url.assignCouponCodeToSingleUser, formData, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
        });
  

        toast.success(
          response.data.message
        );
     
        
       // alert(response.data.message);
        
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(
          'Oops! Something went wrong while assigning coupon code. Please try again later.',
        );
        setErrorMessage(  'Oops! Something went wrong while assigning coupon code. Please try again later.',);
      } finally {
        setLoading(false);
      }



    }
    else{

      const formData = {
        couponId:id   
      }

      setErrorMessage(null);
      setLoading(true);

      let msg;
      try {
        const response = await axios.post(url.assignCouponCodeToAllUsers, formData, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
        });
  
        msg = response.data.message;
        toast.success(
          msg,
        );
        
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(
          'Oops! Something went wrong while assigning coupon code. Please try again later.',
        );
        setErrorMessage('Oops! Something went wrong while assigning coupon code. Please try again later.',);
      } finally {
        setLoading(false);
      }

    }


   
    
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName={`${couponCode} → Assign Coupon`} parentName="Coupon Codes" parentPath="/coupon" />
      <div className="flex flex-col gap-9 mb-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Assign Coupon Code
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
          <div className="p-6.5 grid grid-cols-1 md:grid-cols-2 gap-x-5">
                  
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Select User
                </label>
                <select
              id="role"
            value={selectedUserId}
            onChange={handleUserChange}
            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input `}
          >
            <option value="" disabled className="text-body dark:text-bodydark">
              Select User
            </option>
            {users.map((user) => (
              <option
                key={user._id}
                value={user._id}
                className="text-body dark:text-bodydark capitalize"
              >
                {user.name || user.email || user.mobileNumber || "No available info"}
              </option>
            ))}
           
          </select>

              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-black dark:text-white">
                 Select Type
                </label>
                <div className="flex gap-5">
                <label className="inline-flex items-center space-x-2">
                <input 
                  type="radio"
                  value="Single"
                  name="type"
                  onChange={handleChange} 
                  className="form-radio text-blue-600"
                  
                />
                <span>Single</span>
              </label>
                  
                <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  value="All"
                  name="type"
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span>All</span>
              </label>                
                </div>
              

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

export default AssignCoupon
