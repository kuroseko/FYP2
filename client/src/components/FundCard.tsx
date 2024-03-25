import React from 'react';
import Image from 'next/image';
import { FundCardProps } from '../interface/interfaces';
import tagType from '../assets/type.svg'; // Adjust the import if necessary
import thirdweb from '../assets/thirdweb.png'; // Adjust the import if necessary
import { daysLeft } from '../utils/index'; // Ensure the path is correct
import { useEffect, useState } from 'react';
import { useStateContext } from '../context';
const FundCard: React.FC<FundCardProps> = ({
  
  owner,
  title,
  description,
  category,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
  pId,
}) => {
  
  const remainingDays = daysLeft(deadline);
  console.log("image:", image);
  console.log("amountCollected", amountCollected);
  console.log(deadline)

  const { getDonations, getMilestones } = useStateContext();
  const [displayAmountCollected, setDisplayAmountCollected] = useState('');
  const [numberOfDonors, setNumberOfDonors] = useState(0);
  const [isRefunded, setIsRefunded] = useState(false);
  const [allMilestonesApproved, setAllMilestonesApproved] = useState(false);

  // Function to convert IPFS hash to a URL using a public gateway
  const convertToIpfsUrl = (hash: string) => `https://ipfs.io/ipfs/${hash}`;

  // Check if the image prop is an IPFS hash and convert it
  const imageUrl = image && image.startsWith('Qm') ? convertToIpfsUrl(image) : image;

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const milestones = await getMilestones(pId); // You need to ensure getMilestones is passed via context and can be called here
        const allApproved = milestones.every(milestone => milestone.isAdminApproved);
        console.log(milestones)
        setAllMilestonesApproved(allApproved);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }
    };
  
    fetchMilestones();
  }, [pId]);

 useEffect(() => {
  const fetchDonations = async () => {
    const donations = await getDonations(pId);
    const totalDonations = donations.reduce((acc: any, donation: any) => acc + parseFloat(donation.donation), 0);
    console.log(totalDonations)
    setNumberOfDonors(donations.length);
    if (donations.length >= 1 && totalDonations === 0) {
      setDisplayAmountCollected('Refunded');
      setIsRefunded(true); // Mark as refunded
    } else {
      setDisplayAmountCollected(`${totalDonations} ETH`); // Adjust formatting as needed
      setIsRefunded(false); // Not refunded
    }
  };

  fetchDonations();
}, [pId, getDonations]);

  

  
  console.log(imageUrl);
  return (
    <div className={`sm:w-[288px] w-full rounded-[15px]  bg-[#1c1c24] cursor-pointer hover:shadow-lg`} onClick={handleClick}>
      <div className="w-full h-[158px] relative rounded-t-[15px]">
        <Image src={imageUrl} alt="fund" layout="fill" objectFit="cover" className="rounded-t-[15px]"/>
      </div>

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <Image src={tagType} alt="tag" width={17} height={17}/>
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[14px] text-[#808191]">{category}</p>
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">{title}</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{description}</p>
        </div>

            <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                <div className="flex flex-col">
                  {allMilestonesApproved ? (
                    <span className="completed-badge text-green-600">Completed</span>
                  ) : (
                    <h4 className={`font-epilogue font-semibold text-[14px] ${isRefunded ? 'text-red-500' : 'text-[#b2b3bd]'} text-[#b2b3bd] leading-[22px]`}>
                      {displayAmountCollected}
                    </h4>
                  )}
                    <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Raised of {target}</p>
                </div>
                <div className="flex flex-col">
                    <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{remainingDays}</h4>
                    <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Days Left</p>
                </div>
            </div>
            <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <Image src={thirdweb} alt="user" width={15} height={15}/>
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">by <span className="text-[#b2b3bd]">{owner}</span></p>
        </div>
      </div>
    </div>
  );
};

export default FundCard