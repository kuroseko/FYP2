import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ethers } from 'ethers';
import { useStateContext } from '../../context'; // Adjust based on your file structure
import Loader from '../../components/Loader';
import SubmitButton from '../../components/SubmitButton';
import FormField from '../../components/FormField';
import { Button } from '../../components/CustomButton';
import money from '../assets/money.svg'; // Adjust the import based on your actual file structure
import { Campaign, Milestone } from '../../interface/interfaces'; // Ensure you have the correct path for interfaces
import campaign from '../campaign';
import { useStorageUpload } from '@thirdweb-dev/react';
interface FormState {
    id: string;
    title: string;
    description: string;
    target: string;
    deadline: string;
    milestones: Milestone[];
    image?: File;
    imageUrl?: string;
  }
  interface FormErrors {
    milestonesErrors: string[];
    fundsAllocationError: string;
  }

const EditCampaign = () => {
  const router = useRouter();
  const { mutateAsync: upload } = useStorageUpload();

  const { title } = router.query as { title: string };
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getAllCampaigns, editCampaign, uploadImageToIPFS } = useStateContext();
  const [form, setForm] = useState<FormState>({
    id: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    milestones: [{ description: '' , fundsAllocation: ""}],
    imageUrl: '',
  });

  const [dateError, setDateError] = useState<string>('');


  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!title) return;
      setIsLoading(true);
      try {
        const allCampaigns = await getAllCampaigns();
        console.log("ALLCAMPAIGGNS", allCampaigns)
        const selectedCampaign = allCampaigns.find((c: Campaign) => c.title === title);
        console.log("SELECTED",selectedCampaign)
        if (selectedCampaign) {
            setForm({
                id: selectedCampaign.pId, // Store the campaign ID
                title: selectedCampaign.title,
                description: selectedCampaign.description,
                target: selectedCampaign.target,
                deadline: new Date(selectedCampaign.deadline * 1000).toISOString().slice(0, 10),
                imageUrl: selectedCampaign.image,
                milestones: selectedCampaign.milestones || []
                
              });
            }
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
      setIsLoading(false);
    };

    fetchCampaignData();
    
  }, [title, getAllCampaigns]);


// FORMS
    const handleFormFieldChange = (fieldName: keyof FormState, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        // If the field being changed is the deadline, perform the check
        if (fieldName === 'deadline') {
        const selectedDate = new Date(e.target.value).getTime();
        const currentDate = new Date().getTime();
    
        if (selectedDate < currentDate) {
            setDateError('Please choose a future date for the deadline.');
            return; // Prevent setting the invalid date in the form state
        } else {
            setDateError(''); // Clear any previous error if the date is now valid
        }
        }
    
        // Update the form state for other fields as usual
        setForm({ ...form, [fieldName]: e.target.value });
    };



    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
        setIsLoading(true);
        // Wrap the file in an array to match the expected type for `upload`
        const uris = await upload({ data: [e.target.files[0]] });
        if (uris.length > 0) {
            // Assuming uris[0] contains the IPFS URL or hash
            setForm({ ...form, imageUrl: uris[0], image: e.target.files[0] });
            console.log(uris)
        } else {
            alert('Failed to upload image to IPFS.');
        }
        setIsLoading(false);
        }
    };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Ensure to convert the target from ETH to Wei and deadline to a timestamp
    try {
      await editCampaign(
        form.id,
        form.title,
        form.description,
        form.target,
        form.deadline,
        form.imageUrl
      );
      router.push(`/campaign`); // Adjust this redirect as necessary
    } catch (error) {
      console.error('Failed to update campaign:', error);
      router.push('/campaign')
    }
    
    setIsLoading(false);
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 max-w-[1480px] mx-auto">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] mt-20">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Edit Campaign</h1>
      </div>

      {!isLoading && (
        <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
          <FormField
            labelName="Campaign Title"
            placeholder="Campaign Title"
            inputType="text"
            value={form.title}
            handleChange={(e) => {handleFormFieldChange('title', e)}}
          />
          <FormField
            labelName="Description"
            placeholder="Campaign Description"
            isTextArea
            value={form.description}
            handleChange={(e) => {handleFormFieldChange('description', e)}}
          />
          <FormField
            labelName="Goal (in ETH)"
            placeholder="Target"
            inputType="text"
            value={form.target}
            handleChange={(e) => {handleFormFieldChange('target', e)}}
          />
          <FormField
            labelName="Deadline"
            placeholder="Deadline"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => {handleFormFieldChange('deadline', e)}}
          />
          <FormField
            labelName="Campaign Image"
            placeholder="Upload Image"
            inputType="file"
            handleFileChange={handleImageChange}
          />
          {/* Add Milestones editing if necessary */}
          <SubmitButton btnType="submit" title="Save Changes" styles="bg-[#1dc071]" />
        </form>
      )}
    </div>
  );
};

export default EditCampaign;