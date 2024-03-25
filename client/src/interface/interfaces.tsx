export interface FundCardProps {
    owner: string;
    title: string;
    description: string;
    category?: string;
    target: string; // Assuming target is a string, adjust the type as needed
    deadline: number | string; // Assuming deadline is a timestamp in milliseconds
    amountCollected: string; // Assuming amountCollected is a string, adjust the type as needed
    image: string;
    handleClick: () => void;
    pId: string, // Assuming handleClick is a function with no parameters and no return value
  }
  export interface Milestone {
    description: string;
    fundsAllocation: string;
    isAdminApproved?: boolean;
    totalVotesForApproval?: number;
    totalVotesAgainstApproval?: number;
    votingOpen?: boolean;// Assuming you want to capture this as a string; convert to number as needed
  
}
  export interface Campaign {
    pId: string;
    owner: string; // Ethereum address of the campaign owner
    title: string; // Title of the campaign
    description: string; // Description of the campaign
    target: string; // Target amount to raise (could be in ethers or any other unit)
    deadline: number | string; // Deadline as a timestamp
    amountCollected: string; // Amount collected so far (could be in ethers or any other unit)
    fundsReleased?: string; // Amount of funds released to the owner (could be in ethers)
    image: string; // URL to the campaign image
    isActive: boolean; // Indicates if the campaign is active
    milestones: Milestone[]; // Array of milestones, now optional
  }

  interface Option {
    label: string;
    value: string;
  }

  export interface FormFieldProps {
    labelName: string;
    placeholder?: string;
    inputType?: string;
    value?: string;
    options?: Option[];
    handleChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; // Updated this line
    handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isTextArea?: boolean;
    isSelect?: boolean;
  }
  export interface CustomButtonProps {
    btnType?: 'button' | 'submit' | 'reset'; // Restrict to valid button types
    title: string;
    handleClick?: () => void; // Optional click handler
    styles?: string; // Optional additional CSS classes
  }

  export interface Donation {
    donator: string;
    donation: string; // Assuming this is a string representing an amount of ether
  }

  export interface CampaignUpdate {
    _id: string; // Assuming your updates have an ID
    campaignId: string;
    title: string;
    message: string;
    datePosted: Date;
  }