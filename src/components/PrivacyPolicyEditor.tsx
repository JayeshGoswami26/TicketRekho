

// import { useState, useEffect } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import Quill styles
// import axios from 'axios';
// import Urls from '../networking/app_urls'; // Adjust the URL import path as per your project
// import { useSelector } from 'react-redux';

// const PrivacyPolicyEditor = () => {
//   const [content, setContent] = useState(''); // State to store the privacy policy content
//   const [loading, setLoading] = useState(false); // Loading state for save button
//   const [savedMessage, setSavedMessage] = useState(''); // Success or error message after saving
//   const [policyId, setPolicyId] = useState(''); // State to store the ID of the policy
//   const currentUser = useSelector((state: any) => state.user.currentUser.data);

//   useEffect(() => {
//     const fetchPolicy = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.post(
//           `${Urls.PrivacyPolicyUrl}`,
//           {  },
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           },
//         );
//         console.log('response', response);

//         console.log(response)
//         setContent(response.data.data.content);
//         setPolicyId(response.data.data._id);
//       } catch (error) {
//         console.error('Error fetching privacy policy:', error);
//         setSavedMessage('Error fetching privacy policy.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPolicy();
//   }, [currentUser.token]);

//   // Function to handle saving the edited content
//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${Urls.PrivacyPolicyUrl}`,
//         {
//           _id: policyId,
//           type: 'privacy',
//           content: content,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         },
//       );
//       setSavedMessage('Privacy policy saved successfully!');
//     } catch (error) {
//       console.error('Error saving privacy policy:', error);
//       setSavedMessage('Error saving privacy policy.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className=" text-graydark rounded-sm  bg-white  shadow-default">
//         <ReactQuill
//           theme="snow"
//           value={content}
//           onChange={setContent}
//           className="mb-6 h-full w-full bg-white "
//         />
//       </div>

//       <button
//         onClick={handleSave}
//         className="bg-primary text-white px-6 py-2 rounded-md"
//         disabled={loading}
//       >
//         {loading ? 'Saving...' : 'Save'}
//       </button>

//       {savedMessage && <p className="mt-4 text-green-500">{savedMessage}</p>}
//     </div>
//   );
// };

// export default PrivacyPolicyEditor;


import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import axios from 'axios';
import Urls from '../networking/app_urls'; // Adjust the URL import path as per your project
import { useSelector } from 'react-redux';

const PrivacyPolicyEditor = () => {
  const [content, setContent] = useState(''); // State to store the privacy policy content
  const [loading, setLoading] = useState(false); // Loading state for save button
  const [savedMessage, setSavedMessage] = useState(''); // Success or error message after saving
  const [policyId, setPolicyId] = useState(''); // State to store the ID of the policy
  const [error, setError] = useState<any>(null); // State for API validation errors

  // Get the current user's token from Redux
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  // Fetch the current privacy policy content on component mount
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        // setLoading(true);
        const response = await axios.post(
          `${Urls.GetPrivacyPolicyUrl}?type=privacy`, // Assuming this is the API for both fetch and update
          { type: 'privacy' }, // Sending type to fetch privacy policy
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          },
        );
        if (response.data.status === true) {
          setContent(response.data.data.content); // Assuming 'content' contains the policy content
          setPolicyId(response.data.data._id); // Store the ID for updating the policy later
          setError(null); // Clear any previous errors
        } else {
          setError(response.data.message); // Set error from the API if present
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setSavedMessage('Error fetching privacy policy.');
      } finally {
        // setLoading(false);
      }
    };

    fetchPolicy();
  }, [currentUser.token]);

  // Function to handle saving the edited content
  const handleSave = async () => {
    if (!content.trim()) {
      setSavedMessage('Content cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${Urls.PrivacyPolicyUrl}`,
        {
          _id: policyId, // Send the existing policy ID for updating
          type: 'privacy',
          content: content, // Send the updated content
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      if (response.data.status === true) {
        setSavedMessage('Privacy policy saved successfully!');
        setError(null);
      } else {
        setError(response.data.message); // Set API validation errors if any
      }
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      setSavedMessage('Error saving privacy policy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className=" text-graydark rounded-sm bg-white shadow-default">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="mb-6 h-full w-full bg-white"
        />
      </div>

      {/* Display validation errors if they exist */}
      {error?.content && (
        <p className="text-red-500">{error.content.message}</p>
      )}

      <button
        onClick={handleSave}
        className="bg-primary text-white px-6 py-2 rounded-md"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>

      {savedMessage && <p className="mt-4 text-green-500">{savedMessage}</p>}
    </div>
  );
};

export default PrivacyPolicyEditor;
