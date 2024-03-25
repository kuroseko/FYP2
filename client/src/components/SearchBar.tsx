import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';
import { ConnectWallet } from "@thirdweb-dev/react";

import { useStateContext } from '../context';

const Searchbar = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState('Dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const { setSearchTerm: setGlobalSearchTerm } = useStateContext();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setGlobalSearchTerm(term); // Update the global search term in context
  };

  const reroute = () => {
    // Redirect to an edit campaign page or show an edit form
    router.push(`/createcampaign`);
  };

  // Your other context and state management logic...

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6 md:max-w-[2000px] mx-auto md:py-12 mt-[25px] md:mt-0">
      <div className="lg:flex-1 flex flex-row max-w-[858px] py-2 pl-4 pr-2 h-[62px] bg-[#1c1c24] rounded-[100px] ">
        <input
          type="text"
          placeholder="Search Campaigns"
          className="flex w-full font-epilogue font-normal text-[20px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />

          <div className="w-[72px] h-full rounded-[20px] bg-blue-500 flex justify-center items-center cursor-pointer ">
            <Image src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
          </div>
      </div>

      <button className="bg-blue-500 rounded-xl text-white p-3 font-bold" onClick={reroute}>
        Create Campaign
      </button>


    </div>
  );
};

export default Searchbar;
