// import { useState } from 'react';
// import axios from 'axios';
// import Urls from '../../networking/app_urls';
// import { useSelector } from 'react-redux';

// // Define the type for dropdown options
// interface DropdownOption {
//   title: string;
//   _id: string;
// }

// const SellerFirstLogin = () => {
//   const [inputCode, setInputCode] = useState('');
//   const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Get the current user's token from Redux
//   const currentUser = useSelector((state: any) => state.user.currentUser.data);

//   // Function to verify the manager code by sending it to the API
//   const verifyManagerCode = async () => {
//     try {
//       // Send the input manager code to the API for verification
//       const response = await axios.post(
//         `${Urls.verifySellerManagerCode}`,
//         { managerCode: inputCode }, // Send the entered manager code in the request body
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         },
//       );

//       // Check if the API returns a successful response
//       if (response.data.data === inputCode) {
//         return true;
//       } else {
//         return false;
//       }
//     } catch (error) {
//       console.error('Error verifying manager code', error);
//       return false;
//     }
//   };

//   // Function to fetch dropdown options from another API
//   const fetchDropdownOptions = async () => {
//     try {
//       const response = await axios.post(
//         `${Urls.sellerAllProjects}`,
//         {
//           projectId: "",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         },
//       );
//       setDropdownOptions(response.data.data); // Ensure your API response has a valid 'options' array
//     } catch (error) {
//       console.error('Error fetching dropdown options', error);
//     }
//   };

//   // Handle the Next button click
//   const handleNextClick = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Verify the entered manager code
//     const isValid = await verifyManagerCode();

//     // If the code is valid, show the dropdown
//     if (isValid) {
//       await fetchDropdownOptions();
//       setShowDropdown(true);
//       setErrorMessage('');
//     } else {
//       setErrorMessage('Invalid manager code');
//       setShowDropdown(false);
//     }
//   };

//   return (
//     <>
//       <div className="h-screen w-screen flex flex-col justify-center items-center dark:bg-boxdark-2 dark:text-bodydark">
//         <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-[85%] md:w-[60%]">
//           <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
//             <h3 className="font-medium text-black dark:text-white text-center text-lg md:text-xl">
//               Enter the manager code
//             </h3>
//           </div>
//           <form onSubmit={handleNextClick}>
//             <div className="p-6.5">
//               <div className="mb-4.5">
//                 <input
//                   type="text"
//                   placeholder="Enter the manager code"
//                   value={inputCode}
//                   onChange={(e) => setInputCode(e.target.value)}
//                   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                 />
//               </div>

//               {errorMessage && <p className="text-red-500">{errorMessage}</p>}

//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
//               >
//                 Next
//               </button>

//               {showDropdown && (
//                 <div className="mt-4">
//                   <label className="block mb-2 text-black dark:text-white">
//                     Select an option
//                   </label>
//                   <select className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white">
//                     {dropdownOptions.map((option, index) => (
//                       <option key={index} value={option._id}>
//                         {option.title}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SellerFirstLogin;

// import { useState } from 'react';
// import axios from 'axios';
// import Urls from '../../networking/app_urls';
// import { useSelector } from 'react-redux';

// // Define the type for dropdown options
// interface DropdownOption {
//   title: string;
//   _id: string;
// }

// const SellerFirstLogin = () => {
//   const [inputCode, setInputCode] = useState('');
//   const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
//   const [selectedOptionId, setSelectedOptionId] = useState(''); // State for selected option's _id
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Get the current user's token from Redux
//   const currentUser = useSelector((state: any) => state.user.currentUser.data);

//   // Function to verify the manager code by sending it to the API
//   const verifyManagerCode = async () => {
//     try {
//       const response = await axios.post(
//         `${Urls.verifySellerManagerCode}`,
//         { managerCode: inputCode }, // Send the entered manager code
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         },
//       );

//       // Check if the API returns a successful response
//       if (response.data.data === inputCode) {
//         return true;
//       } else {
//         return false;
//       }
//     } catch (error) {
//       console.error('Error verifying manager code', error);
//       return false;
//     }
//   };

//   // Function to fetch dropdown options from another API
//   const fetchDropdownOptions = async () => {
//     try {
//       const response = await axios.post(
//         `${Urls.sellerAllProjects}`,
//         { }, // Adjust the body as per your API requirement
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         },
//       );
//       setDropdownOptions(response.data.data); // Ensure your API response has a valid 'options' array
//     } catch (error) {
//       console.error('Error fetching dropdown options', error);
//     }
//   };

//   // Handle the Next button click
//   const handleNextClick = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Verify the entered manager code
//     const isValid = await verifyManagerCode();

//     // If the code is valid, show the dropdown
//     if (isValid) {
//       await fetchDropdownOptions();
//       setShowDropdown(true);
//       setErrorMessage('');
//     } else {
//       setErrorMessage('Invalid manager code');
//       setShowDropdown(false);
//     }
//   };

//   // Handle form submission when the final submit button is clicked
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       // Send the selected option's _id to the API
//       const response = await axios.post(
//         `${Urls.sellerProSelection}`, // Replace with your actual API URL
//         { projectId: selectedOptionId }, // Sending the selected option's _id
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         },
//       );
//       console.log('Submission successful:', response.data);
//     } catch (error) {
//       console.error('Error submitting selected option:', error);
//     }
//   };

//   return (
//     <>
//       <div className="h-screen w-screen flex flex-col justify-center items-center dark:bg-boxdark-2 dark:text-bodydark">
//         <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-[85%] md:w-[60%]">
//           <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
//             <h3 className="font-medium text-black dark:text-white text-center text-lg md:text-xl">
//               Enter the manager code
//             </h3>
//           </div>
//           <form onSubmit={handleNextClick}>
//             <div className="p-6.5">
//               <div className="mb-4.5">
//                 <input
//                   type="text"
//                   placeholder="Enter the manager code"
//                   value={inputCode}
//                   onChange={(e) => setInputCode(e.target.value)}
//                   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                 />
//               </div>

//               {errorMessage && <p className="text-red-500">{errorMessage}</p>}

//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
//               >
//                 Next
//               </button>
//             </div>
//           </form>

//           {showDropdown && (
//             <form onSubmit={handleSubmit} className="p-6.5">
//               <div className="mt-4">
//                 <label className="block mb-2 text-black dark:text-white">
//                   Select Projects
//                 </label>
//                 <select
//                   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
//                   value={selectedOptionId}
//                   onChange={(e) => setSelectedOptionId(e.target.value)} // Capture the selected option's _id
//                 >
//                   <option value="">Select an option</option>
//                   {dropdownOptions.map((option, index) => (
//                     <option key={index} value={option._id}>
//                       {option.title}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
//               >
//                 Submit
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SellerFirstLogin;


import { useState } from 'react';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For navigation

// Define the type for dropdown options
interface DropdownOption {
  title: string;
  _id: string;
}

const SellerFirstLogin = () => {
  const [inputCode, setInputCode] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState(''); // State for selected option's _id
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false); // Loading state for Next button
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading state for Submit button
  const [errorMessage, setErrorMessage] = useState('');

  // Get the current user's token from Redux
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  // Navigation hook
  const navigate = useNavigate();

  // Function to verify the manager code by sending it to the API
  const verifyManagerCode = async () => {
    try {
      const response = await axios.post(
        `${Urls.verifySellerManagerCode}`,
        { managerCode: inputCode },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      if (response.data.data === inputCode) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error verifying manager code', error);
      return false;
    }
  };

  // Function to fetch dropdown options from another API
  const fetchDropdownOptions = async () => {
    try {
      const response = await axios.post(
        `${Urls.sellerAllProjects}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      setDropdownOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching dropdown options', error);
    }
  };

  // Handle the Next button click
  const handleNextClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingNext(true); // Show loading spinner on the Next button

    const isValid = await verifyManagerCode();
    if (isValid) {
      await fetchDropdownOptions();
      setShowDropdown(true); // Show the dropdown if the manager code is valid
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid manager code');
      setShowDropdown(false);
    }

    setLoadingNext(false); // Hide loading spinner after completion
  };

  // Handle form submission when the final submit button is clicked
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true); // Show loading spinner on the Submit button

    try {
      const response = await axios.post(
        `${Urls.sellerProSelection}`,
        { projectId: selectedOptionId },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      console.log('Submission successful:', response.data);
      navigate('/seller-dash'); // Navigate to dashboard after successful submission
    } catch (error) {
      console.error('Error submitting selected option:', error);
    }

    setLoadingSubmit(false); // Hide loading spinner after completion
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center dark:bg-boxdark-2 dark:text-bodydark">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-[85%] md:w-[60%]">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white text-center text-lg md:text-xl">
            Enter the manager code
          </h3>
        </div>

        {!showDropdown && (
          <form onSubmit={handleNextClick}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <input
                  type="text"
                  placeholder="Enter the manager code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                disabled={loadingNext}
              >
                {loadingNext ? 'Loading...' : 'Next'}
              </button>
            </div>
          </form>
        )}

        {showDropdown && (
          <form onSubmit={handleSubmit} className="p-6.5">
            <div className="mt-4">
              <label className="block mb-2 text-black dark:text-white">
                Select Projects
              </label>
              <select
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                value={selectedOptionId}
                onChange={(e) => setSelectedOptionId(e.target.value)}
              >
                <option value="">Select an option</option>
                {dropdownOptions.map((option, index) => (
                  <option key={index} value={option._id}>
                    {option.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerFirstLogin;
