import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Loader from '../../components/Loader'
import { useStateContext } from '../../context';
import { calculateBarPercentage, daysLeft } from '../../utils';
import { thirdweb } from '../../assets/index.js'; // Make sure this path is correct
import { Campaign } from '../../interface/interfaces'; // Ensure this path matches where you define your interfaces
import { Button } from '@material-tailwind/react';
import CustomButton from '../../components/CustomizedButton';
import CountBox from '../../components/CountBox';
import { Milestone, Donation, CampaignUpdate } from '../../interface/interfaces';

import Loading from '../../components/Loading';
//web3
import { useAddress } from '@thirdweb-dev/react';

const CampaignDetails = () => {
  const router = useRouter();
  const { title } = router.query as { title: string };
  const { contract, donate, getDonations, getAllCampaigns, getMilestones, openMilestoneVoting, voteOnMilestone, deleteCampaign, checkIfUserHasVoted } = useStateContext();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(true);
  const [ amount, setAmount ] = useState('');
  const [donators, setDonators] = useState<any[]>([]); // You might want to define a Donator interface
  const [donatorsSorted, setSortedDonators] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  //milestones
  const [milestones, setMilestones] = useState<Milestone[]>([])

  //DATABASE
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [hasVoted, setHasVoted] = useState<Record<number, boolean>>({});



  


  const address = useAddress()
  const hasUserDonated = donators.some(donator => donator.donator === address);

//DATABASE
  const handlePostUpdate = async (e:any) => {
    e.preventDefault();
  
    if (!updateTitle.trim() || !updateMessage.trim()) {
      alert('Please fill in all fields');
      return;
    }
  
    const updateData = {
      campaignId: campaign?.pId,
      title: updateTitle,
      message: updateMessage,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/updates', { // Adjust this URL to your backend's route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
  
      if (response.ok) {
        // Clear the form
        setUpdateTitle('');
        setUpdateMessage('');
  
        alert('Update posted successfully');
        // Optionally, refresh updates here
      } else {
        alert('Failed to post update');
      }
    } catch (error) {
      console.error('Error posting update:', error);
      alert('An error occurred, please try again');
    }
  };
  

// Add this function inside your CampaignDetails component
  useEffect(() => {
    const fetchUpdates = async () => {
      if (!campaign) return; // Make sure campaign is loaded

      try {
        const response = await fetch(`http://localhost:5000/api/updates/${campaign.pId}`); // Adjust the URL according to your setup
        if (!response.ok) throw new Error('Failed to fetch updates');

        const data = await response.json();
        setUpdates(data); // Set fetched updates into state
      } catch (error) {
        console.error('Error fetching updates:', error);
      }
    };

    fetchUpdates();
  }, [campaign]);


  const handleDeleteCampaign = async () => {
   
    if (campaign?.pId && window.confirm("Are you sure you want to delete this campaign?")) {
      console.log(campaign.pId)
      setIsLoading(true);
      const wasDeleted = await deleteCampaign(campaign.pId);
      if (wasDeleted) {
        // Assuming deleteCampaign returns a boolean or you set this based on the event/callback
        setIsLoading(false)
        alert("Campaign deleted successfully.");
        
        
        router.push('/'); // Or trigger a state update to remove the campaign from the list
      } else {
        alert("Failed to delete campaign.");
        router.push('/campaign')
      }
    }
  };
  

  useEffect(() => {
    const fetchCampaignAndDonations = async () => {
      if (!title || !contract) return;
      setIsLoading2(true);
      try {
        const allCampaigns = await getAllCampaigns();
        const selectedCampaign = allCampaigns.find((c: Campaign) => c.title === title);
        setCampaign(selectedCampaign);
  
        if (selectedCampaign) {
          const campaignMilestones = await getMilestones(selectedCampaign.pId);
          setMilestones(campaignMilestones);
  
          // Fetch donations for this campaign
          const donationsData = await getDonations(selectedCampaign.pId);
          setDonators(donationsData); // Update state with fetched donations
  
          // Calculate total amount collected and determine refund condition
          const totalAmountCollected = donationsData.reduce((total:any, donation:any) => total + parseFloat(donation.donation), 0);
          if (donationsData.length >= 1 && totalAmountCollected === 0) {
            // Trigger your "Refunded" popup here
            alert("This campaign has been refunded.");
            setIsLoading(true)
            router.push('/campaign')
          }
  
          const sortedDonationsData = donationsData.sort((a:any, b:any) => parseFloat(b.donation) - parseFloat(a.donation)).slice(0, 5);
          setSortedDonators(sortedDonationsData);
        }
      } catch (error) {
        console.error("Error fetching campaigns, milestones, or donations:", error);
      } finally {
        setIsLoading2(false);
      }
    };
  
    fetchCampaignAndDonations();
  }, [title, contract, getMilestones, getDonations, address]);
  

  //EDIT CAMPAIGN
  const isOwner = address === campaign?.owner;

  const handleEditCampaign = () => {
    // Redirect to an edit campaign page or show an edit form
    router.push(`/edit-campaign/${campaign?.title}`);
  };

//Voting
  const fetchVotingStatus = async () => {
    if (!campaign?.pId || !address) return;

    // Define newHasVoted with the correct type
    const newHasVoted: Record<number, boolean> = {};

    for (let index = 0; index < milestones.length; index++) {
      const voted = await checkIfUserHasVoted(campaign.pId, index);
      newHasVoted[index] = voted;
    }

    setHasVoted(newHasVoted);
  };

  useEffect(() => {
    fetchVotingStatus();
  }, [milestones, address, campaign?.pId]);

  const handleOpenVoting = async (milestoneIndex: number) => {
    if (!campaign?.pId) return;
    setIsLoading(true);
    try {
      await openMilestoneVoting(campaign.pId, milestoneIndex);
      // Optionally, refetch the campaign's milestones to update the UI
      const updatedMilestones = await getMilestones(campaign.pId);
      setMilestones(updatedMilestones);
    } catch (error) {
      console.error("Error opening voting:", error);
    }
    setIsLoading(false);
  };

  const handleVoteOnMilestone = async (milestoneIndex: number, approve: boolean) => {
    if (!campaign?.pId) return;
    setIsLoading(true);
    try {
        await voteOnMilestone(campaign.pId, milestoneIndex, approve);
        // Refetch the milestones to update the UI with the latest voting results
        const updatedMilestones = await getMilestones(campaign.pId);
        setMilestones(updatedMilestones);
    } catch (error) {
        console.error("Error voting on milestone:", error);
    }
    setIsLoading(false);
};

const areAllMilestonesApproved = milestones.every(milestone => milestone.isAdminApproved);


  const handleDonate = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        alert("Please enter a valid amount to donate.");
        return; // Early return if the amount is invalid
    }

    setIsLoading(true);

    try {
        await donate(campaign?.pId, amount);
        router.push('/'); // Redirect to home page only if donation is successful
    } catch (error) {
        console.error("Error during donation:", error);
        alert("An error occurred while trying to process your donation. Please try again.");
    }

    setIsLoading(false);
  }


  if (isLoading) return <Loader />;
  if (isLoading2) return <Loading />;
  if (!campaign) return <p>No campaign found.</p>;
  
  return (
    <div className='md:max-w-[1480px] p-6 mx-auto'>
      {isOwner && !areAllMilestonesApproved  &&(
        <div className="text-right mt-20">
          
          <button
            className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-4"
            onClick={handleEditCampaign}
          >
            Edit Campaign
          </button>
          <>
          <button
            className="text-sm bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
            onClick={handleDeleteCampaign}
          >
            Delete Campaign
          </button>
        </>
        </div>
      )}
      {areAllMilestonesApproved && (
        <div className="text-center mt-20 bg-green-50 p-5 rounded-xl">
          <h2 className="text-lg font-semibold uppercase text-green-500">🎉 Campaign Completed! 🎉</h2>
        </div>
      )}
      <div className="w-full flex md:flex-row flex-col mt-20 gap-[30px]">
        <div className="flex-1 flex-col">
          {/* Assuming campaign.image is a URL. Adjust accordingly if your setup differs */}
          <img src={campaign.image} alt="Campaign" className="w-full h-[410px] object-cover rounded-xl"/>
        </div>
        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          {/* Assuming you have a CountBox component. Replace '???'
              with actual data fields from 'campaign' */}
            <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
            <CountBox title="Days Left" value={daysLeft(campaign.deadline)} />
            <CountBox title={`Raised of ${campaign.target}`} value={campaign.amountCollected} />
            <CountBox title="Total Backers" value={donators.length} />


        </div>
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <Image src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{campaign.owner}</h4>
                {/* <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 campaigns</p> */}
              </div>
            </div>
          
          
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{campaign.description}</p>
            </div>
          </div>
            <div className="bg-[#7469B6] rounded-[10px] py-6 justify-center text-center ">
              <h2 className="font-epilogue font-bold text-white text-[30px]">Voting enabled when campaign ends.</h2>
            </div>
            <ol className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 bg-gray-900 rounded-xl p-6 items-center">  
              {milestones.map((milestone, index) => (

            
                <div key={index} className='mx-auto' >
                  
                      <li className="relative mb-4 sm:mb-0 py-5">
                          <div className="flex items-center">
                              <div className="z-10 flex items-center justify-center w-6 h-6 rounded-full ring-0 bg-blue-900 sm:ring-8 ring-gray-900 shrink-0">
                                  <svg className="w-2.5 h-2.5 text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                  </svg>
                              </div>
      
                          </div>
                          <div className="mt-3 sm:pe-8">
                              <h3 className="text-lg font-semibold text-white">Milestone {index + 1}</h3>
                              <p className="block mb-2 text-sm font-normal leading-none text-gray-500">Funds Allocation: {milestone.fundsAllocation}%</p>
                              <p className="text-base font-normal text-gray-400">{milestone.description}</p>
                          </div>
                   
                          {milestone.isAdminApproved ? (
                            // Display Approved status with green background
                            <div className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-md text-center">
                              Approved
                            </div>
                          ) : (
                          isOwner && (
                              <button
                                onClick={() => !milestone.votingOpen && handleOpenVoting(index)}
                                className={`align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-blue-900 md:mt-3 mt-2 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none ${milestone.votingOpen ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={milestone.votingOpen || campaign.isActive }
                              >
                                {milestone.votingOpen ? "Voting Opened" : "Open Voting"}
                               
                              </button>
                              )
                            )}
                            {milestone.votingOpen && !milestone.isAdminApproved && hasUserDonated &&(
                            <div className="mt-4 flex">
                              {hasVoted[index] ? (
                                <p>You have already voted on this milestone.</p>
                              ) : (
                                <>
                                  <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold md:py-2 md:px-4 sm:p-2 rounded-md mr-2 md:w-[120px] sm:w-[80px] sm:text-[16px]"
                                    onClick={() => handleVoteOnMilestone(index, true)}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold md:py-2 md:px-4 rounded-md md:w-[120px] sm:w-[80px] sm:text-[16px]"
                                    onClick={() => handleVoteOnMilestone(index, false)}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                        
                        )}
                      </li>

                      </div>
                      ))}
                  </ol>

               


                    
            </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donatorsSorted.length > 0 ? donatorsSorted.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-bold text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                    {index + 1}. {`${item.donator.substring(0, 2)}...${item.donator.substring(item.donator.length - 4)}`}
                  </p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                    {item.donation}
                  </p>
                </div> 
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No Donators yet</p>
              )}
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Fund the Campaign
            </p>
            <div className="mt-[30px]">
                <input
                  type="number"
                  placeholder="ETH 0.1 *"
                  step="0.01"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                  <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it</h4>
                  <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project</p>

                  
                
                </div>
                <CustomButton
                    btnType="button"
                    title="Fund Campaign"
                    styles="w-full bg-[#8c6dfd]"
                    handleClick={handleDonate}
                  />
            </div>
          </div>
        </div>
        <hr className="mt-8 mb-8 border-gray-200 opacity-30 "></hr>

        <div>
          {isOwner && (
            <div className="mt-10">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Updates</h4>
              <div className="mt-[20px] p-4 bg-[#1c1c24] rounded-[10px]">
                <form onSubmit={handlePostUpdate}>
                  <input
                    type="text"
                    placeholder="Update Title"
                    className="w-full py-[10px] px-[15px] mb-4 outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Update Message"
                    className="w-full py-[10px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                  ></textarea>
                  <button
                    type="submit"
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Post Update
                  </button>
                </form>
              </div>
            </div>
          )}
          <div>
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Campaign Updates</h4>
              <div className="mt-[20px] flex flex-col gap-4">
                {updates.length > 0 ? (
                  updates.map((update, index) => (
                    <div key={index} className="p-4 bg-[#1c1c24] rounded-[10px]">
                      <h5 className="font-epilogue font-semibold text-[16px] text-white">{update.title}</h5>
                      <p className="font-epilogue font-normal text-[14px] text-[#808191] mt-2">{update.message}</p>
                      <p className="font-epilogue font-normal text-[12px] text-[#808191] mt-2">Posted on: {new Date(update.datePosted).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191]">No updates yet</p>
                )}
              </div>
            </div>
        </div>
      </div>

  )
}

export default CampaignDetails