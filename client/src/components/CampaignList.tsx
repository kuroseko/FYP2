import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import FundCard from './FundCard';
import loader from '../assets/loader.svg'; // Assuming the loader is a static asset

import { Campaign } from '../interface/interfaces'; // Assuming you have a type definition for campaigns

interface DisplayCampaignsProps {
  title: string;
  isLoading: boolean;
  campaigns: Campaign[];
}

const CampaignsList: React.FC<DisplayCampaignsProps> = ({ title, isLoading, campaigns }) => {
  const router = useRouter();

  const handleNavigate = (title: string) => {
    router.push(`/campaign-details/${title}`);
};
  console.log("CAMPAIGNS:", campaigns);
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Image src={loader} alt="loader" width={100} height={100} />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campaigns found
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => (
          <FundCard
            key={campaign.pId}
            {...campaign}
            handleClick={() => handleNavigate(campaign.title)}
          />
        ))}
      </div>

      
    </div>
  );
};

export default CampaignsList;
