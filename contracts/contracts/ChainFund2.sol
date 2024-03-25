// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ChainFund2 {
    address public admin;

    string[] public categories = ["Health", "Education", "Environment", "Technology", "Arts", "Others"];

    struct Vote {
        bool voted;
        uint256 weight;
    }

    struct Milestone {
        string description;
        bool isAdminApproved;
        uint256 totalVotesForApproval;
        uint256 totalVotesAgainstApproval;
        mapping(address => Vote) votes;
        bool votingOpen; // Percentage of total funds for this milestone.
        uint256 fundsAllocation;
    }

    struct Campaign {
        address owner;
        string title;
        string category;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        uint256 fundsReleased;
        string image;
        bool isActive;
        Milestone[] milestones;
        mapping(address => uint256) donationAmounts; // Donation amount per address.
        uint256 donorCount;
        address[] donators;
        uint256[] donations; // Number of unique donors.
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns;

    mapping(address => uint256[]) public userDonations;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    modifier onlyOwner(uint256 _campaignId) {
        require(msg.sender == campaigns[_campaignId].owner, "Only campaign owner can perform this action.");
        _;
    }

    function getCategoriesCount() public view returns (uint) {
    return categories.length;
    }

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _target,
        uint256 _deadline,
        string memory _image,
        
        string[] memory _milestoneDescriptions,
        uint256[] memory _fundsAllocations
    ) public {
        require(_deadline > block.timestamp, "Deadline must be in the future.");
        require(_milestoneDescriptions.length == _fundsAllocations.length, "Descriptions and allocations length mismatch");

        uint256 campaignId = numberOfCampaigns++;
        Campaign storage campaign = campaigns[campaignId];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.category = _category;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.isActive = true;

        uint256 totalAllocation = 0;
        for (uint i = 0; i < _milestoneDescriptions.length; i++) {
            totalAllocation += _fundsAllocations[i];
            campaign.milestones.push(); // Push an empty Milestone to initialize its storage slot.
            uint256 newIndex = campaign.milestones.length - 1;
            Milestone storage newMilestone = campaign.milestones[newIndex];
                newMilestone.description = _milestoneDescriptions[i];
                newMilestone.isAdminApproved = false;
                newMilestone.totalVotesForApproval = 0;
                newMilestone.totalVotesAgainstApproval = 0;
                newMilestone.votingOpen = false;
                newMilestone.fundsAllocation = _fundsAllocations[i];
        }
        require(totalAllocation == 100, "Total fund allocation must be 100%");
    }

    // Function to edit a campaign (can only be done by the owner and if no donations have been made yet)
   function editCampaign(
    uint256 campaignId,
    string memory newTitle,
    string memory newDescription,
    uint256 newTarget,
    uint256 newDeadline,
    string memory newImage
    ) public onlyOwner(campaignId) {
        Campaign storage campaign = campaigns[campaignId];

        if(bytes(newTitle).length > 0) {
            campaign.title = newTitle;
        }
        if(bytes(newDescription).length > 0) {
            campaign.description = newDescription;
        }
        // Assuming 0 is an invalid target or deadline, adjust as needed
        if(newTarget != 0) {
            campaign.target = newTarget;
        }
        if(newDeadline != 0) {
            campaign.deadline = newDeadline;
        }
        if(bytes(newImage).length > 0) {
            campaign.image = newImage;
        }
    }
    // Function to delete a campaign (can only be done by the owner and if no donations have been made yet)
    event CampaignDeleted(uint256 campaignId);

    function deleteCampaign(uint256 _campaignId) public onlyOwner(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive && campaign.amountCollected == 0, "Cannot delete active campaign with donations");

        delete campaigns[_campaignId];
        emit CampaignDeleted(_campaignId);
    }
    
    //DONATE
    function donateToCampaign(uint256 _campaignID) public payable {
        Campaign storage campaign = campaigns[_campaignID];

        // Ensure the campaign is active and the deadline has not passed
        require(campaign.isActive, "Campaign is not active.");
        require(block.timestamp <= campaign.deadline, "Donation period has ended.");

       //Check for first donation
        if (campaign.donationAmounts[msg.sender] == 0) {
            // First donation from this donor; increment unique donor count
            campaign.donorCount++;
        }
        
        // Add the donation to the donor's total donations for the campaign
        campaign.donationAmounts[msg.sender] += msg.value;
        
        // Record the donation
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountCollected += msg.value;

        // Record the campaign ID in the user's donation history
        userDonations[msg.sender].push(_campaignID);

        // Check if the campaign is fully funded after the donation
        if (campaign.amountCollected >= campaign.target) {
            // If fully funded, deactivate the campaign
            campaign.isActive = false;
        }
    }

//retrieve user donations
    function getUserDonations(address user) public view returns (uint256[] memory) {
    return userDonations[user];
    }

    function getCampaignDonations(uint256 campaignId) public view returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[campaignId];
        return (campaign.donators, campaign.donations);
    }


    function getCampaigns() public view returns (
        uint256[] memory ids,
        address[] memory owners,
        string[] memory titles,
        string[] memory descriptions,
        uint256[] memory targets,
        uint256[] memory deadlines,
        string[] memory images,
        uint256[] memory amountsCollected,
        bool[] memory isActives,
        string[] memory category
        
    ) {
        uint activeCount = 0;
        for (uint i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].isActive) {
                activeCount++;
            }
        }

        ids = new uint256[](activeCount);
        owners = new address[](activeCount);
        titles = new string[](activeCount);
        descriptions = new string[](activeCount);
        targets = new uint256[](activeCount);
        deadlines = new uint256[](activeCount);
        images = new string[](activeCount);
        amountsCollected = new uint256[](activeCount);
        isActives = new bool[](activeCount);
        category = new string[](activeCount);

        uint j = 0;
        for (uint i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].isActive) {
                ids[j] = i;
                owners[j] = campaigns[i].owner;
                titles[j] = campaigns[i].title;
                descriptions[j] = campaigns[i].description;
                targets[j] = campaigns[i].target;
                deadlines[j] = campaigns[i].deadline;
                images[j] = campaigns[i].image;
                amountsCollected[j] = campaigns[i].amountCollected;
                isActives[j] = campaigns[i].isActive;
                category[j] = campaigns[i].category;
                j++;
            }
        }
    }

//ADMIN
    function getAllCampaigns() public view returns (
        uint256[] memory ids,
        address[] memory owners,
        string[] memory titles,
        string[] memory descriptions,
        uint256[] memory targets,
        uint256[] memory deadlines,
        string[] memory images,
        uint256[] memory amountsCollected,
        bool[] memory isActives,
        string[] memory category
    ) {
        ids = new uint256[](numberOfCampaigns);
        owners = new address[](numberOfCampaigns);
        titles = new string[](numberOfCampaigns);
        descriptions = new string[](numberOfCampaigns);
        targets = new uint256[](numberOfCampaigns);
        deadlines = new uint256[](numberOfCampaigns);
        images = new string[](numberOfCampaigns);
        amountsCollected = new uint256[](numberOfCampaigns);
        isActives = new bool[](numberOfCampaigns);
        category = new string[](numberOfCampaigns);
        
        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            ids[i] = i;
            owners[i] = campaign.owner;
            titles[i] = campaign.title;
            descriptions[i] = campaign.description;
            targets[i] = campaign.target;
            deadlines[i] = campaign.deadline;
            images[i] = campaign.image;
            amountsCollected[i] = campaign.amountCollected;
            isActives[i] = campaign.isActive;
            category[i] = campaign.category;
        }
    }


    function getCampaignMilestones(uint256 campaignId) public view returns (
    string[] memory descriptions,
    bool[] memory isAdminApproveds,
    uint256[] memory totalVotesForApprovals,
    uint256[] memory totalVotesAgainstApprovals,
    bool[] memory votingOpens,
    uint256[] memory fundsAllocations
    ) {
    Campaign storage campaign = campaigns[campaignId];
    uint256 milestonesCount = campaign.milestones.length;

    descriptions = new string[](milestonesCount);
    isAdminApproveds = new bool[](milestonesCount);
    totalVotesForApprovals = new uint256[](milestonesCount);
    totalVotesAgainstApprovals = new uint256[](milestonesCount);
    votingOpens = new bool[](milestonesCount);
    fundsAllocations = new uint256[](milestonesCount);

    for (uint256 i = 0; i < milestonesCount; i++) {
        Milestone storage milestone = campaign.milestones[i];
        descriptions[i] = milestone.description;
        isAdminApproveds[i] = milestone.isAdminApproved;
        totalVotesForApprovals[i] = milestone.totalVotesForApproval;
        totalVotesAgainstApprovals[i] = milestone.totalVotesAgainstApproval;
        votingOpens[i] = milestone.votingOpen;
        fundsAllocations[i] = milestone.fundsAllocation;
    }
    }





    // Function to open milestone voting
    function openMilestoneVoting(uint256 _campaignId, uint256 _milestoneIndex) public onlyOwner(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(_milestoneIndex < campaign.milestones.length, "Invalid milestone index.");
        Milestone storage milestone = campaign.milestones[_milestoneIndex];
        require(!milestone.votingOpen, "Voting is already open.");
        require(!campaign.isActive, "Campaign must not be active to open voting.");

        // Reset the votes for this milestone
        for (uint i = 0; i < campaign.donorCount; i++) {
            delete milestone.votes[campaign.donators[i]];
        }
        
        milestone.votingOpen = true;
    }


    // Function to vote on a milestone
// Function to vote on a milestone
function voteOnMilestone(uint256 _campaignId, uint256 _milestoneIndex, bool _approve) public {
    Campaign storage campaign = campaigns[_campaignId];
    require(_milestoneIndex < campaign.milestones.length, "Invalid milestone index.");
    Milestone storage milestone = campaign.milestones[_milestoneIndex];
    require(milestone.votingOpen, "Voting is not open for this milestone.");
    require(campaign.donationAmounts[msg.sender] > 0, "Must have donated to vote.");
    require(!milestone.votes[msg.sender].voted, "Already voted.");

    milestone.votes[msg.sender] = Vote({voted: true, weight: 1}); // Ensure one vote per donor

    if (_approve) {
        milestone.totalVotesForApproval += 1;
    } else {
        milestone.totalVotesAgainstApproval += 1;
    }

    // Check for milestone approval after each vote
    checkAndProcessMilestoneApproval(_campaignId, _milestoneIndex);
}
function hasVotedOnMilestone(uint256 _campaignId, uint256 _milestoneIndex, address _voter) public view returns (bool) {
    return campaigns[_campaignId].milestones[_milestoneIndex].votes[_voter].voted;
}
// Internal function to check and process milestone approval
function checkAndProcessMilestoneApproval(uint256 campaignId, uint256 milestoneIndex) internal {
    Campaign storage campaign = campaigns[campaignId];
    Milestone storage milestone = campaign.milestones[milestoneIndex];
    uint256 quorum = campaign.donorCount / 2; // quorum calculation

    // Check if quorum is met and votes for approval outnumber votes against
    if ((milestone.totalVotesForApproval + milestone.totalVotesAgainstApproval) >= quorum &&
        milestone.totalVotesForApproval > milestone.totalVotesAgainstApproval) {
        milestone.isAdminApproved = true;
        releaseFunds(campaignId, milestoneIndex);
        milestone.votingOpen = false; // Close the voting after approval
    } else if ((milestone.totalVotesForApproval + milestone.totalVotesAgainstApproval) >= quorum) {
        // Quorum is met, but not enough votes for approval
        milestone.votingOpen = false; // Close the Voting
    }
}



    event FundsReleased(uint256 indexed campaignId, uint256 amount);
    // Function to release funds for an approved milestone
    function releaseFunds(uint256 _campaignId, uint256 _milestoneIndex) internal {
        Campaign storage campaign = campaigns[_campaignId];
        Milestone storage milestone = campaign.milestones[_milestoneIndex];
        require(milestone.isAdminApproved, "Milestone not approved.");
        
        uint256 releaseAmount = (campaign.amountCollected * milestone.fundsAllocation) / 100;
        require(address(this).balance >= releaseAmount, "Insufficient contract balance.");

        campaign.fundsReleased += releaseAmount;
        payable(campaign.owner).transfer(releaseAmount);

        emit FundsReleased(_campaignId, releaseAmount);
    }



//REFUNDS
    event RefundIssued(uint256 indexed campaignId, address donator, uint256 amount);

        function refundDonations(uint256 campaignId) public onlyAdmin {
            Campaign storage campaign = campaigns[campaignId];
            require(!campaign.isActive, "Campaign must be inactive to refund donations.");
            require(campaign.amountCollected > 0, "No funds to refund.");

            for(uint256 i = 0; i < campaign.donators.length; i++) {
                address donator = campaign.donators[i];
                uint256 donationAmount = campaign.donations[i];

                // Reset donation amount to 0 to prevent re-entrancy attack
                campaign.donations[i] = 0;
                
                (bool success, ) = donator.call{value: donationAmount}("");
                require(success, "Refund failed.");

                emit RefundIssued(campaignId, donator, donationAmount);
            }

            // Reset the campaign's collected amount to 0
            campaign.amountCollected = 0;
        }

}

