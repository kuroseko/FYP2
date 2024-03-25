import React, { useState, useEffect, useCallback } from 'react';
import  CampaignsList  from '../components/CampaignList';
import { useStateContext } from '../context/'; // Adjust the import paths as necessary
import { Campaign } from '../interface/interfaces'; // Assuming you have defined your types
import Searchbar from '../components/SearchBar';
// If you haven't defined a type for your campaign, here's a basic example:
/*
interface Campaign {
  id: number;
  title: string;
  description: string;
  // Add other campaign properties as needed
}
*/


const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const campaign: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsAll, setCampaignsAll] = useState<Campaign[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const { contract, getCampaigns, getAllCampaigns, searchTerm } = useStateContext(); // Assuming address is not used here

  

  const filteredCampaigns = campaignsAll.filter(campaign =>
    (campaign.title?.toLowerCase().includes(searchTerm?.toLowerCase()))
    
  );

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: Campaign[] = await getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getCampaigns]);

  const fetchAllCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const dataAll: Campaign[] = await getAllCampaigns();
      console.log("DataAll",dataAll)
      setCampaignsAll(dataAll);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
    setIsLoading(false);
  }, [getAllCampaigns]); // Dependencies

useEffect(() => {
    // Call both functions when the component mounts
    fetchCampaigns();
    fetchAllCampaigns();
  }, [fetchAllCampaigns, fetchCampaigns]); // Dependencies are functions memoized with useCallback



  return (
    <div className="mx-auto p-6 md:max-w-[1480px]">
      <h1 className="mt-20 text-white text-5xl font-bold">Campaigns</h1>  
      <Searchbar />
    
    {/* Conditionally render CampaignsList based on searchTerm */}
    {searchTerm ? (
      <CampaignsList
        title="Search Results"
        isLoading={isLoading}
        campaigns={filteredCampaigns} // Render only filtered campaigns when searching
      />
    ) : (
      <>
        <CampaignsList
          title="All Campaigns"
          isLoading={isLoading}
          campaigns={campaigns} // Render all campaigns when not searching
        />
        <div className='py-12'>
          <CampaignsList
            title="Fully Funded Campaigns"
            isLoading={isLoading}
            campaigns={campaignsAll.filter(campaign => campaign.isActive === false && campaign.title && campaign.amountCollected != "0.0")}

          />
        </div>
      </>
    )}
  </div>
);
};

export default campaign;
