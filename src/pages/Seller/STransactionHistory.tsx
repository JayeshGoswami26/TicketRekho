import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Urls from '../../networking/app_urls'; // Make sure to import your URLs
import { useSelector } from 'react-redux';

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  date: string;
}

interface WalletData {
  balance: number;
  pendingBalance: number;
  transactions: Transaction[];
}

const STransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  // Function to fetch transaction history
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${Urls.SellerWallerUrl}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`, // Add your token here
        },
      });
      if (response.data.status) {
        setTransactions(response.data.data.transactions); // Set the transactions from API
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(); // Fetch transactions on component mount
  }, []);

  return (
    <div>

      <div className="grid grid-cols-1 gap-4">
        {/* Transactions */}
        <div className="flex flex-col gap-2">
          {loading
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr key={index}>
                    <td className="py-4 px-4 border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-default w-screen">
                      <div className="animate-pulse flex space-x-4 items-center">
                        {/* <div className="rounded-full bg-slate-200 dark:bg-slate-300 h-10 w-10"></div> */}
                        <div className="flex-1 space-y-4 py-1 items-start flex flex-col ">
                          <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-2/3"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
            : transactions.map(
                ({ _id, type, amount, status, date, description }) => (
                  <div
                    key={_id}
                    className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex justify-between"
                  >
                    <div className="flex flex-col items-start justify-center">
                      <h4 className="text-base md:text-title-md font-bold text-black dark:text-white capitalize">
                        {/* {type === 'credit' ? 'Credit' : 'Withdrawal'} */}
                        {type}
                      </h4>
                      <span className="text-base font-medium">
                        {new Date(date).toLocaleDateString('en-GB')}
                      </span>
                      <span className="text-base font-medium capitalize">
                        {description}
                      </span>
                    </div>
                    <div className="flex flex-col items-end justify-around">
                      {/* <h4 className=`text-base md:text-title-md font-bold text-black dark:text-white  {type === 'credit' ? "text-green-600" : 'text-red-600' }`> */}
                      <h4
                        className={`text-base md:text-title-md font-bold dark:bg-white p-1.5 rounded-md  ${
                          type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        ₹ {amount}
                      </h4>
                      <span
                        className={`text-base font-medium ${
                          status === 'approved'
                            ? 'text-green-600'
                            : status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {status === 'approved'
                          ? 'Success'
                          : status === 'pending'
                          ? 'Pending'
                          : 'Failed'}
                      </span>
                    </div>
                  </div>
                ),
              )}
        </div>
      </div>
    </div>
  );
};

export default STransactionHistory;
