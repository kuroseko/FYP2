
import React, { useContext, createContext } from "react";

import { useAddress, useContract, useConnect, metamaskWallet, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { createCampaign } from "../assets";
import CreateCampaign from "../pages/createcampaign";
import { useState } from "react";

const walletConfig = metamaskWallet();
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x2A797e3A63e1D3C0c7A34D406cf47D8Da3E66498');

    const [campaignsAll, setCampaignsAll] = useState([]);
    


    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    const { mutateAsync: editCampaignWrite } = useContractWrite(contract, 'editCampaign');
    
    const { mutateAsync: voteMilestone } = useContractWrite(contract, 'voteOnMilestone');

    // const connect = useConnect();
    const address = useAddress();


    // Converts an IPFS hash to a URL using a public IPFS gateway.
    function ipfsUrl(ipfsHashOrUrl) {
        const gatewayPrefix = 'https://ipfs.io/ipfs/';
        // Check if the input is already an IPFS URL
        if (ipfsHashOrUrl.startsWith('ipfs://')) {
            // Replace "ipfs://" with the gateway prefix
            return ipfsHashOrUrl.replace('ipfs://', gatewayPrefix);
        }
        // If it's just a hash, concatenate with the gateway prefix
        return `${gatewayPrefix}${ipfsHashOrUrl}`;
    }
    
    //UTILITY FUNCTION
    async function uploadImageToIPFS(imageUrl) {
        // Implementation depends on how you choose to interact with IPFS
         // Example hash returned from IPFS
        return ipfsUrl(imageUrl);
    }

    const [searchTerm, setSearchTerm] = useState('');

    //Get categories
    async function getCategories() {
        try {
            console.log(contract)
            const categoriesCount = await contract.call('getCategoriesCount');
            const categories = [];
    
            for (let i = 0; i < categoriesCount.toNumber(); i++) {
                const category = await contract.call('categories', [i])
                categories.push(category);
            }
    
            return categories;
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            return [];
        }
    }



    //CREATING CAMPAIGN
    const publishCampaign = async (form) => {
        try {
            console.log("Form iamge", form.image);
            const imageIPFSHash = await uploadImageToIPFS(form.imageUrl);
            const targetInWei = ethers.utils.parseEther(form.target);
    
            // Extract milestone descriptions and funds allocations from the form state
            const milestoneDescriptions = form.milestones.map(m => m.description);
            const fundsAllocations = form.milestones.map(milestone => Number(milestone.fundsAllocation)); // Assuming you have an 'allocation' field in your Milestone type
            console.log("Milestones", milestoneDescriptions);
            console.log("Target in Wei:", targetInWei);
            console.log("Deadline:", form.deadline); // Make sure this is correctly converted
            console.log("Funds Allocation:", form.milestones.map(m => m.fundsAllocation));
            const args = [
                address, // owner's address
                form.title, // campaign title
                form.description, // campaign description
                form.category,
                targetInWei, // target amount in wei
                Math.floor(new Date(form.deadline).getTime() / 1000), // deadline as a UNIX timestamp
                imageIPFSHash, // IPFS hash of the campaign image
                milestoneDescriptions,
                fundsAllocations,
            ];
            console.log("ARGs", args);
    
            const data = await createCampaign({
                args: args,
                
            });
            
            console.log("data",data)
            console.log("Campaign created successfully", data);
        } catch (error) {
            console.error("Failed to create campaign", error);
        }
    };

    //RETRIEVING ACTIVE CAMPAIGNS
    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');
        console.log(campaigns);
        const parsedCampaigns = [];
        const now = new Date();
        console.log("Deadlines from contract:", campaigns.deadlines);

        const [ids, owners, titles, descriptions, targets, deadlines, amountsCollected, images, isActives] = campaigns;

    
        for (let i = 0; i < ids.length; i++) {
            const deadlineDate = new Date(campaigns.deadlines[i] * 1000);
            const deadlineStr = deadlineDate.getTime() < now.getTime() ? "Ended" : deadlineDate;
            // Note: You need to handle 'image' and 'milestones' according to your contract's return values
            parsedCampaigns.push({
                owner: campaigns.owners[i],
                title: campaigns.titles[i],
                description: campaigns.descriptions[i],
                category: campaigns.category[i],
                target: ethers.utils.formatEther(campaigns.targets[i].toString()),
                deadline: deadlineStr, // Assuming deadline is returned as a Unix timestamp in seconds
                image: campaigns.images[i],
                amountCollected: ethers.utils.formatEther(campaigns.amountsCollected[i].toString()),
                pId: campaigns.ids[i].toString(),
                milestones: [campaigns.milestone], // Placeholder: Adjust according to your data
            });
        }
        
        return parsedCampaigns;
    };


    //RETRIEVING ALL CAMPAIGNS
    const getAllCampaigns = async () => {
        // Assuming `contract` is already instantiated with your smart contract
        const campaignsAll = await contract.call('getAllCampaigns'); // Adjust if your method name or access pattern differs
        console.log("CAMPAIGNS",campaignsAll);
        const parsedAllCampaigns = [];
        const now = new Date();
        const [ids, owners, titles, descriptions,category, targets, deadlines, amountsCollected, images, isActives] = campaignsAll;

        // Assuming the structure returned by `getAllCampaigns` is similar to `getCampaigns`
        for (let i = 0; i < ids.length; i++) {
            const deadlineAllDate = new Date(campaignsAll.deadlines[i] * 1000);
            const deadlineAllStr = deadlineAllDate.getTime() < now.getTime() ? "Ended" : deadlineAllDate;
            // Note: You need to handle 'image' and 'milestones' according to your contract's return values
            parsedAllCampaigns.push({
                owner: campaignsAll.owners[i],
                title: campaignsAll.titles[i],
                description: campaignsAll.descriptions[i],
                // category: campaignsAll.category[i],
                target: ethers.utils.formatEther(campaignsAll.targets[i].toString()),
                deadline: deadlineAllStr, // Assuming deadline is returned as a Unix timestamp in seconds
                image: campaignsAll.images[i],
                amountCollected: ethers.utils.formatEther(campaignsAll.amountsCollected[i].toString()),
                isActive: campaignsAll.isActives[i],
                pId: campaignsAll.ids[i].toString(),
                milestones: [], // Placeholder: Adjust according to your data
            });
        }
        return parsedAllCampaigns;
    };



    const getUserCampaigns = async () => {
        const allCampaigns = await getAllCampaigns();
        
        const filteredCampaigns = allCampaigns.filter((campaign) => 
        campaign.owner ===address);

        return filteredCampaigns;

        
    }



    //EDITING USER CAMPAIGNS
    const editCampaign = async (
        campaignId,
        newTitle,
        newDescription,
        newTarget, // This should be a valid numeric string
        newDeadline,
        newImage,
      ) => {
        try {
            if (isNaN(parseFloat(newTarget))) {
                throw new Error("Invalid target value. Please enter a numeric value.");
            }
            
            const targetInWei = ethers.utils.parseEther(newTarget.toString());
            const deadlineTimestamp = Math.floor(new Date(newDeadline).getTime() / 1000);
            const imageNew = await uploadImageToIPFS(newImage);
            const result = await editCampaignWrite({
                args: [
                campaignId,
                newTitle,
                newDescription,
                targetInWei,
                deadlineTimestamp,
                imageNew,
                ],
            
            });
            console.log("ARGUMENTS:",args)
            console.log("Campaign edited successfully", result);
            return result;
            } catch (error) {
            console.error("Failed to edit campaign", error);
            throw error; // Re-throw to handle it in the UI
            }
        };

    //Delete campaign
    const deleteCampaign = async (campaignId) => {
        try {
            const wasDeleted = await contract.call('deleteCampaign', [campaignId]);
            if (wasDeleted) {
                setCampaignsAll(currentCampaignsAll => {
                    const index = currentCampaignsAll.findIndex(campaign => campaign.pId.toString() === campaignId.toString());
                    if (index !== -1) {
                        // Copy the array to a new one for immutability
                        const updatedCampaigns = [...currentCampaignsAll];
                        // Remove the campaign by its index
                        updatedCampaigns.splice(index, 1);
                        return updatedCampaigns; // Return the new array
                    }
                    return currentCampaignsAll; // Return the current state if not found
                });
            }
            return wasDeleted;
        } catch (error) {
            console.error("Failed to delete campaign", error);
            return false;
        } finally {

        }
    };


    //DOnatin functions
    const donate = async (pId, amount) => {
        try {
            // Convert the ether amount to wei
            const amountInWei = ethers.utils.parseEther(amount.toString());
            const data = await contract.call('donateToCampaign', [pId], {value: amountInWei});
            return data;
        } catch (error) {
            // Check if the error is due to insufficient funds
            if (error.code === -32000) {
                // Handle the insufficient funds error specifically
                alert("Insufficient funds for this transaction.");
            } else {
                // Handle other types of errors
                console.error("An error occurred during the donation process:", error);
                alert("An error occurred. Please try again.");
            }
            return null; // Indicate failure or handle as appropriate
        }
    };

    const getDonations = async (pId) => {
        try {
            const [donators, donations] = await contract.call('getCampaignDonations', [pId]);
            const parsedDonations = donators.map((donator, i) => ({
                donator,
                donation: ethers.utils.formatEther(donations[i].toString())
            }));
            return parsedDonations;
        } catch (error) {
            console.error("Error fetching donations:", error);
            return [];
        }
    };

    const getUserDonatedCampaigns = async () => {
        if (!address) return [];
        try {
            const campaignIds = await contract.call('getUserDonations', [address]);
            console.log("Donated Campaign IDs:", campaignIds);
    
            const donatedCampaigns = await Promise.all(
                campaignIds.map(async (id) => {
                    const campaign = await contract.call('campaigns', [id]);
    
                    // Convert BigNumber to string and format ether values
                    const formattedCampaign = {
                        ...campaign,
                        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
                        target: ethers.utils.formatEther(campaign.target.toString()),
                    };
    
                    // Check if the deadline has passed
                    const now = new Date();
                    const deadlineDate = new Date(campaign.deadline * 1000);
                    if (now > deadlineDate) {
                        formattedCampaign.deadline = "Ended";
                    } else {
                        // Format the deadline as a readable date if it hasn't passed
                        formattedCampaign.deadline = deadlineDate.toLocaleDateString("en-US");
                    }
    
                    return formattedCampaign;
                })
            );
    
            console.log("Donated Campaigns Data:", donatedCampaigns);
            return donatedCampaigns;
        } catch (error) {
            console.error("Failed to fetch user-donated campaigns", error);
            return [];
        }
    };
    


//retreiving milestones
    const getMilestones = async (campaignId) => {
        console.log(`Fetching milestones for campaign ID: ${campaignId}`);
        const data = await contract.call('getCampaignMilestones', [campaignId]);
        console.log('Milestones data:', data);
        const transformedData = data.descriptions.map((description, index) => ({
            description: description,
            isAdminApproved: data.isAdminApproveds[index],
            totalVotesForApproval: data.totalVotesForApprovals[index].toString(), // Converting BigNumber to string for easy handling
            totalVotesAgainstApproval: data.totalVotesAgainstApprovals[index].toString(),
            votingOpen: data.votingOpens[index],
            fundsAllocation: data.fundsAllocations[index].toString(),
        }));
    
        console.log('Transformed milestones:', transformedData);
        return transformedData;
    };


//VOTING

    const checkIfUserHasVoted = async (campaignId, milestoneIndex) => {
        if (!address) {
            console.log("Wallet not connected");
            return false;
        }

        try {
            // The following is an example using ethers.js with a connected contract instance.
            const hasVoted = await contract.call('hasVotedOnMilestone',[campaignId, milestoneIndex, address]);
            return hasVoted;
        } catch (error) {
            console.error("Failed to check if the user has voted:", error);
            return false;
        }
    };
    const voteOnMilestone = async (campaignId, milestoneIndex, approve) => {
        try {
            // await contract.write("voteOnMilestone", [campaignId, milestoneIndex, approve]);
            const vote = await voteMilestone({
                args: [
                    campaignId,
                    milestoneIndex,
                    approve
                    ],
                
            });
            console.log("ARGUMENTS:",args)
            await transaction.wait();
            console.log("Vote successful", vote);
        } catch (error) {
            console.error("Failed to vote on milestone", error);
        }
    };

    const openMilestoneVoting = async (campaignId, milestoneIndex) => {
        try {
            // Assume 'contract' is your instantiated smart contract with ethers.js or web3.js
            const transaction = await contract.call("openMilestoneVoting",[campaignId, milestoneIndex]);
            await transaction.wait(); // Wait for the transaction to be mined
            console.log("Voting opened successfully");
            // Update state or perform additional actions as needed
        } catch (error) {
            console.error("Failed to open voting", error);
            throw error; // Rethrow or handle error appropriately
        }
    };
    
    


//REFUNDS    
    const refundDonations = async (campaignId) => {
        try {
            const result = await contract.call("refundDonations", [campaignId]);
            console.log("Refund issued successfully", result);
            alert("Refund issued successfully");
        } catch (error) {
            console.error("Failed to issue refund", error);
            alert("Failed to issue refund");
        }
    };


    const getAdminAddress = async () => {
        const adminAddress = await contract.call("admin"); // Use the call method with the variable name
        return adminAddress;
      };

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                setSearchTerm,
                searchTerm,
                //Campaign Functions
                createCampaign: publishCampaign,
                getCampaigns,
                getAllCampaigns,
                getUserCampaigns,
                editCampaign,
                deleteCampaign,
                getCategories,
                //Donation Functions
                donate,
                getDonations,
                refundDonations,
                //Utility Functions
                uploadImageToIPFS,
                getAdminAddress,
                campaignsAll,
                //Voting Functions
                getMilestones,
                voteOnMilestone,
                openMilestoneVoting,
                getUserDonatedCampaigns,
                checkIfUserHasVoted,
                
            }}
        >
            {children}
        </StateContext.Provider>
    )
}


export const useStateContext = () => useContext(StateContext);