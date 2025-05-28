import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import Urls from '../networking/app_urls';
import { useSelector } from 'react-redux';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

interface QrData {
  userId: string;
  bookingId: string;
}

interface GrabABiteItem {
  grabABiteId: {
    _id: string;
    userId: string;
    eventId: string;
    name: string;
    foodType: string;
    grabImage: string;
    description: string;
    price: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  };
  qty: number;
  _id: string;
}

const MovieQRScanner: React.FC = () => {
  const [qrData, setQrData] = useState<QrData | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [grabABiteList, setGrabABiteList] = useState<GrabABiteItem[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const currentUser = useSelector((state: any) => state.user.currentUser?.data);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 500, height: 500 },
      },
      false,
    );

    scanner.render(
      (decodedText: string) => {
        try {
          const parsedData: QrData = JSON.parse(decodedText); // Parse QR data into an object
          console.log('parsedData', parsedData);
          setQrData(parsedData); // Set qrData state

          // Fetch GrabABite List based on bookingId
          fetchGrabABiteList(parsedData.bookingId);

        } catch (error) {
          console.error('Failed to parse QR data:', error);
          setQrData(null); // Optionally reset qrData if parsing fails
        }
      },
      (error) => {
        console.warn(`QR Code no match: ${error}`);
      },
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, []);

  const fetchGrabABiteList = async (bookingId: string) => {
    try {
      const response = await axios.post(
        Urls.getUserMovieBookingTicketDetail,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      console.log('API Response:', response.data);

      if (response.data.data?.grabABiteList) {
        console.log('Web API is Working');
        setGrabABiteList(response.data.data.grabABiteList);
      }
    } catch (error) {
      console.error('Failed to fetch grabABiteList:', error);
    }
  };

  const sendGameUserId = async () => {
    console.log(qrData);
    
    if (!qrData) return;

    setIsSending(true);

    try {
      const response = await axios.post(
        Urls.scanMovieQRCode,
        {
          bookingId: qrData.bookingId, // Send parsed userId
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
    } catch (error) {
      console.error('Failed to send Booking ID:', error);
      setSuccessMessage('Failed to send Booking ID');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
     <Breadcrumb pageName="Movie QR Management" />
      <div className="flex flex-col items-center justify-center p-6 min-h-[70vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">QR Code Scanner</h2>

       <div
        id="qr-reader"
        className="w-full max-w-md h-72 bg-white border-4 border-dashed border-blue-400 rounded-lg shadow-inner flex items-center justify-center"
      >
        <span className="text-gray-400">Initializing camera...</span>
      </div>

{qrData && (
  <div className="mt-4 p-4 bg-blue-100 text-blue-900 rounded-md text-center">
    <p className="text-md font-medium">
      Booking ID: <span className="font-semibold">{qrData.bookingId}</span><br />
    </p>
  </div>
)}

<button
  onClick={sendGameUserId}
  disabled={isSending}
  className={`mt-6 px-6 py-2 rounded-lg font-medium transition duration-200 ${
    isSending
      ? 'bg-blue-300 text-white cursor-not-allowed'
      : 'bg-blue-600 text-white hover:bg-blue-700'
  }`}
>
  {isSending ? 'Sending...' : 'Verify Ticket'}
</button>

            {successMessage && (
        <div
          className={`mt-4 p-2 rounded ${
            successMessage === 'QR code scanned successfully.'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          <p className="text-lg">{successMessage}</p>
        </div>
      )}

        {/* Grab a Bite List Section */}
        {grabABiteList.length > 0 && (
         <div className="mt-6 w-full">
         <h3 className="text-xl mb-2">Grab a Bite List</h3>
         <div className="overflow-x-auto">
           <table className="w-full border-collapse border border-gray-300">
             <thead>
               <tr className="bg-gray-200">
                 <th className="border border-gray-300 px-4 py-2">Image</th>
                 <th className="border border-gray-300 px-4 py-2">Name</th>
                 <th className="border border-gray-300 px-4 py-2">Description</th>
                 <th className="border border-gray-300 px-4 py-2">Quantity</th>
                 <th className="border border-gray-300 px-4 py-2">Price</th>
               </tr>
             </thead>
             <tbody>
               {grabABiteList.map((item) => (
                 <tr key={item._id} className="border border-gray-300">
                   <td className="border border-gray-300 px-4 py-2 text-center">
                     {item.grabABiteId.grabImage && (
                       <img
                         src={`${Urls.Image_url}${item.grabABiteId.grabImage}`}
                         alt={item.grabABiteId.name}
                         className="w-12 h-12 object-cover mx-auto"
                       />
                     )}
                   </td>
                   <td className="border border-gray-300 px-4 py-2">{item.grabABiteId.name}</td>
                   <td className="border border-gray-300 px-4 py-2 text-gray-600">{item.grabABiteId.description}</td>
                   <td className="border border-gray-300 px-4 py-2 text-center">{item.qty}</td>
                   <td className="border border-gray-300 px-4 py-2 text-green-600 text-center">{item.grabABiteId.price}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
       
        )}
      </div>
    </>
  );
};

export default MovieQRScanner;
