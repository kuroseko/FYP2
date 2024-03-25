import React, { useState, useEffect, useCallback } from 'react';
import  CampaignsList  from '../components/CampaignList';
import { useStateContext } from '../context/'; 
import { Campaign } from '../interface/interfaces'; 
import Navbar from '../components/SearchBar';

const profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donatedCampaigns, setDonatedCampaigns] = useState<Campaign[]>([]);

  const { contract,address, getUserDonatedCampaigns, getUserCampaigns, searchTerm } = useStateContext(); // Assuming address is not used here

  const getFilteredCampaigns = useCallback(() => {
    // Combine both lists of campaigns
    const combinedCampaigns = [...campaigns, ...donatedCampaigns];

    // Filter combined campaigns list based on searchTerm
    return combinedCampaigns.filter((campaign) =>
      campaign.title?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }, [campaigns, donatedCampaigns, searchTerm]);

  const filteredCampaigns = getFilteredCampaigns();

  const fetchCampaigns = async () => {
    if (!getUserCampaigns) return; 
    setIsLoading(true);
    try {
      const data: Campaign[] = await getUserCampaigns(); 
      setCampaigns(data);
      console.log("DATA:",data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [contract]);
  console.log("CAMPAIGNS:",campaigns)

  const fetchUserDonatedCampaigns = async () => {
    console.log('Contract:', contract);
    console.log('Address:', address);
    if (!address || !contract){
      setIsLoading(true);
    }
      try {
        const campaigns = await getUserDonatedCampaigns();
        console.log("Donated",campaigns)
        setDonatedCampaigns(campaigns); // Assuming the structure of campaigns matches what your component expects
      } catch (error) {
        console.error('Failed to fetch user-donated campaigns:', error);
      }
      setIsLoading(false);
    };

    useEffect(() => {
      fetchUserDonatedCampaigns();
    },  [address, contract]);
    
  return (
    <div className="mx-auto p-6 md:max-w-[1480px]">

    <h1 className="mt-20 text-white text-5xl font-bold">Profile</h1>  
    <Navbar />
    {searchTerm ? (
      <CampaignsList
        title="Search Results"
        isLoading={isLoading}
        campaigns={filteredCampaigns} // Render only filtered campaigns when searching
      />
    ) : (
      <>
      <CampaignsList
        title="Your Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
      <div className='py-12'>
        <CampaignsList
          title="Campaigns You have donated to"
          isLoading={isLoading}
          campaigns={donatedCampaigns}
        />
      </div>
      </>
    )}
  </div>
  );
};

export default profile;
