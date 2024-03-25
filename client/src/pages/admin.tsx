import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context'; // Adjust the import path as necessary
import type { NextPage } from 'next';
import { Campaign } from '../interface/interfaces';
import Loader from '../components/Loader'
import { ConnectWallet } from "@thirdweb-dev/react";
import { useAddress } from '@thirdweb-dev/react';
import { useCallback } from 'react';
import Link from 'next/link';
const AdminPage: React.FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null when not checked, false when checked and not admin, true when admin
  const userAddress = useAddress();
  const { getAdminAddress, contract, getAllCampaigns, refundDonations } = useStateContext();

  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!getAdminAddress || !userAddress) {
        setIsAdmin(false); // Not admin because no wallet is connected
        setIsLoading(false);
        return;
      }
      
      try {
        const adminAddress = await getAdminAddress();
        setIsAdmin(userAddress.toLowerCase() === adminAddress.toLowerCase());
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
      setIsLoading(false);
    };

    checkIfAdmin();
  }, [userAddress, getAdminAddress]);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: Campaign[] = await getAllCampaigns();
      console.log("DATA:", data);
      data = data.filter(campaign => campaign.isActive === false);
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
    setIsLoading(false);
  }, [contract]); // `contract` is a dependency of `fetchCampaigns`
  
  
  useEffect(() => {
    // Ensure fetchCampaigns is correctly bound within useEffect to avoid missing dependency warnings
    if (contract) fetchCampaigns();
  }, [contract, fetchCampaigns]); // Added fetchCampaigns as a dependency



  console.log("campaigns",campaigns)
  const handleRefund = async (pId: string) => {
    if(window.confirm("Are you sure you want to refund all donations for this campaign?")) {
        await refundDonations(pId);
        // You might want to refresh your campaign list or UI here
    }
};

  if (!userAddress) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-5 rounded-lg text-center">
          <p className='mb-5'>Please Connect Your Wallet</p>
          {/* You can add a button here to trigger wallet connection if your state management supports it */}
          
          <ConnectWallet/>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
        <div className="bg-white p-5 rounded-lg text-center w-[800px]">
          <p className='mb-2'>You are not admin.</p>
          <Link href='/' className='bg-blue-600 p-2 rounded-lg text-white'>Return</Link>
        </div>
      </div>
    );
  }

  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {campaigns.filter(campaign => campaign.title && parseFloat(campaign.amountCollected) > 0).map((campaign, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-white">{campaign.pId}</td>
                  <td className="px-4 py-2  text-white">{campaign.title}</td>
                  <td className="px-4 py-2">
                  <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleRefund(campaign.pId)}
                    >
                      Refund Donations
                    </button>
                 
    
                 </td>
                </tr> 
               ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
