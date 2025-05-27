

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import Urls from '../networking/app_urls';
import { useSelector } from 'react-redux';
import "./Scanner.css"

interface QrData {
  userId: string;
  bookingId: string;
}

const QRScanner: React.FC = () => {
  const [qrData, setQrData] = useState<QrData | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const currentUser = useSelector((state: any) => state.user.currentUser?.data);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false,
    );

    scanner.render(
      (decodedText: string) => {
        try {
          const parsedData: QrData = JSON.parse(decodedText);
          setQrData(parsedData);
        } catch (error) {
          console.error('Failed to parse QR data:', error);
          setQrData(null);
          setErrorMessage('Invalid QR Code. Please try again.');
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

  const sendGameUserId = async () => {
    if (!qrData) return;

    setIsSending(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await axios.post(
        Urls.scanEventQRCode,
        {
          bookingId: qrData.bookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      setSuccessMessage('Ticket processed successfully');
    } catch (error) {
      console.error('Failed to process Ticket:', error);
      setErrorMessage('Failed to process Ticket Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center py-8 px-4">
      <div className="bg-white dark:bg-boxdark shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-4">
          QR Code Scanner
        </h2>

        {/* <div
          id="qr-reader"
          className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center mb-4 shadow-inner"
        /> */}

        <div
          id="qr-reader"
          className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex flex-col items-center justify-center mb-4 shadow-inner overflow-hidden "
          style={{ aspectRatio: '1 / 1' }} // Maintain a 1:1 aspect ratio for consistency
        ></div>

        {qrData && (
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 p-3 rounded-md mb-4">
            <p className="text-center font-medium">
              Scanned Username: <span className="font-bold">{qrData.name}</span>
              {/* <span className="font-bold">{qrData.userId}</span> */}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 p-3 rounded-md mb-4">
            <p className="text-center font-medium">{errorMessage}</p>
          </div>
        )}

        {qrData && (
          <button
            onClick={sendGameUserId}
            disabled={isSending}
            className={`w-full py-2 text-white font-medium rounded-md transition-all duration-300 shadow-md ${
              isSending
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSending ? 'Scaning...' : 'Scan Ticket'}
          </button>
        )}

        {successMessage && (
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 p-3 rounded-md mt-4">
            <p className="text-center font-medium">{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
