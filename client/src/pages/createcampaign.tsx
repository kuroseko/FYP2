import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import money from '../assets/money.svg'; // Adjust the import based on your actual file structure
import { ethers } from 'ethers';
import { useStateContext } from '../context'; // Ensure this is correctly typed for TypeScript
import SubmitButton from '../components/SubmitButton';
import FormField from '../components/FormField';
import Loader from '../components/Loader';
import { Milestone } from '../interface/interfaces';
import { Button } from '../components/CustomButton';
//web3
import { useStorageUpload, useAddress, ConnectWallet } from '@thirdweb-dev/react';;
import Loading from '../components/Loading';


interface FormState {
  name: string;
  title: string;
  description: string;
  target: string;
  deadline: string;
  milestones: Milestone[];
  image?: File;
  imageUrl?: string;
  category: string;
}
interface FormErrors {
  milestonesErrors: string[];
  fundsAllocationError: string;
}


const CreateCampaign: React.FC = () => {

  const address = useAddress()
  const { mutateAsync: upload } = useStorageUpload();
 
  const [errors, setErrors] = useState<FormErrors>({
    milestonesErrors: [],
    fundsAllocationError: "",
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const { createCampaign, getCategories, contract } = useStateContext(); // This context must be typed in its definition file
  const [form, setForm] = useState<FormState>({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    milestones: [{ description: '' , fundsAllocation: ""}],
    imageUrl: '',
    category: categories[0],
  });


  const [dateError, setDateError] = useState<string>('');

  useEffect(() => {
    async function fetchCategories() {
      if (!contract) {
        console.log("Contract not available.");
        return;
      }
      setIsLoading2(true);
      try {
        const fetchedCategories = await getCategories();
        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
        } else {
          console.log("No categories fetched. Existing categories retained.");
        }
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setIsLoading2(false);
      }
    }
  
    fetchCategories();
  }, [contract]);


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

//FUNDS AND MILESTONES ERROR HANDLING
  const validateMilestones = () => {
    const newMilestonesErrors: string[] = []; // Explicitly declare as string array
    let totalFundsAllocation = 0;
    let isValid = true;

    form.milestones.forEach((milestone, index) => {
      let error = ""; // Use a temporary variable to build the error message

      if (!milestone.description.trim()) {
        error = "Milestone description cannot be empty.";
        isValid = false;
      }

      const allocation = parseInt(milestone.fundsAllocation, 10);
      if (isNaN(allocation) || allocation <= 0 || allocation > 100) {
        error += error ? " Funds allocation must be between 1 and 100." : "Funds allocation must be between 1 and 100.";
        isValid = false;
      } else {
        totalFundsAllocation += allocation;
      }

      newMilestonesErrors[index] = error; // Assign built error message to the corresponding index
    });

    if (totalFundsAllocation !== 100) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fundsAllocationError: "Total funds allocation must equal 100%.",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fundsAllocationError: "",
      }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      milestonesErrors: newMilestonesErrors,
    }));

    return isValid;
  };



  
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

  const addMilestone = () => {
    if (form.milestones.length < 6) {
      setForm(prevForm => ({
        ...prevForm,
        milestones: [...prevForm.milestones, { description: '' ,fundsAllocation: ""}],
      }));
    }
  };
  
  const removeMilestone = (index: number) => {
    setForm(prevForm => ({
      ...prevForm,
      milestones: prevForm.milestones.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    const isMilestonesValid = validateMilestones(); // Validates milestones and fund allocations
  
    if (!isMilestonesValid) {
      // If milestones validation fails, do not proceed with form submission
      alert("Please ensure total funds allocation equals 100%.");
      return; // Exit the function early
    }
  
    setIsLoading(true); // Indicate loading state
  
    try {
      await createCampaign({
        ...form,
        image: form.imageUrl, // Use the IPFS URL or hash here
      });
      router.push('/'); // Redirect on successful form submission
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  if(!address){
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

  if (isLoading2) return <Loading />;
    return (
      
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 max-w-[1480px] mx-auto ">
        {isLoading && <Loader />}
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] mt-24">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Create Campaign</h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
          <div className="flex flex-wrap gap-[40px]">
            <FormField 
              labelName="Your Name *"
              placeholder="John Doe"
              inputType="text"
              value={form.name}
              handleChange={(e) => {handleFormFieldChange('name', e)}}
            />
            <FormField 
              labelName="Campaign Title *"
              placeholder="Campaign Title"
              inputType="text"
              value={form.title}
              handleChange={(e) => {handleFormFieldChange('title', e)}}
            />
          </div>
          <FormField
            labelName="Category *"
            placeholder='Category'
            value={form.category}
            handleChange={(e) => handleFormFieldChange('category', e)}
            isSelect={true}
            options={categories.map((category) => ({ label: category, value: category }))}
          />
            <FormField 
              labelName="Story *"
              placeholder="Write Your Story"
              isTextArea
              value={form.description}
              handleChange={(e) => {handleFormFieldChange('description', e)}}
            />

            {form.milestones.map((milestone, index) => (
              <div key={index}>
                <FormField
                  labelName={`Milestone ${index + 1} *`}
                  placeholder={`Milestone ${index + 1} description`}
                  inputType="text"
                  value={milestone.description}
                  handleChange={(e) => {
                    const newMilestones = [...form.milestones];
                    newMilestones[index].description = e.target.value;
                    setForm({ ...form, milestones: newMilestones });
                  }}
                  
                />
                <FormField
                  labelName={`Milestone ${index + 1} Fund Allocation % *`}
                  placeholder={`Milestone ${index + 1} Fund Allocation % *`}
                  inputType="number"
                  value={milestone.fundsAllocation}
                  handleChange={(e) => {
                    const newMilestones = [...form.milestones];
                    newMilestones[index].fundsAllocation = e.target.value;
                    setForm({ ...form, milestones: newMilestones });
                  }}
                  
                />
                <Button variant='outlined' size='sm' placeholder="Remove Milestone" className='text-white mt-2' color="blue" onClick={() => removeMilestone(index)} >Remove Milestone </Button>
                  
              </div>
            ))}
            <div className='flex flex-row justify-end w-full'>
              <Button size='md' placeholder="Add Milestone" className='text-white mt-2' color="blue" onClick={addMilestone} disabled={form.milestones.length >= 6}>
                ADD MILESTONE
              </Button>
            </div>
            <p className="text-white font-epilogue font-bold text-center md:text-[20px] sm:text-[10px]">*You can only add up to 6 Milestones per campaign.</p>

            <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
              <Image src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
              <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will receive money upon completion of milestones!</h4>
            </div>
            <div className="flex flex-wrap gap-[40px]">
            <FormField 
              labelName="Goal *"
              placeholder="ETH 0.5"
              inputType="text"
              value={form.target}
              handleChange={(e) => {handleFormFieldChange('target', e)}}
            />

            <FormField 
              labelName="End Date *"
              placeholder="End Date"
              inputType="date"
              value={form.deadline}
              handleChange={(e) => {handleFormFieldChange('deadline', e)}}
            />

            
            </div>
            {dateError && <p className="text-red-500">{dateError}</p>}
            <div>
              <FormField 
              labelName="Campaign Image *"
              placeholder="Upload an image for your campaign"
              inputType="file"
              handleFileChange={handleImageChange} // Pass handleImageChange to handleFileChange for file inputs
            />
            </div>
          
            <div className="flex justify-center items-center mt-[40px]">
              <SubmitButton
                btnType="submit"
                title="Submit new Campaign"
                styles="bg-blue-500"
              />
            </div>
          
        </form>
      </div>
      
    )
  }


export default CreateCampaign