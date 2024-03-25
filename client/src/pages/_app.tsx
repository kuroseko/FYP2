"use client"
import { Sepolia } from "@thirdweb-dev/chains";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import '../styles/global.css';
import { ThemeProvider } from "@material-tailwind/react";
import Navbar from "../components/SearchBar";

import NavbarFin from "../components/NavbarFin";
import { useRouter } from 'next/router';
import { StateContextProvider } from "../context";
// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.




function MyApp({ Component, pageProps }: AppProps) {
  return (
    

      <ThirdwebProvider
        clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
        activeChain={ Sepolia }
      >
      <StateContextProvider>
        
      <div className="relative sm:-8 bg-[#13131a] min-h-screen  flex-row">
      
        <div className="flex-1 max-sm:w-full mx-auto xs:pr-5">
        <NavbarFin />
        {/* {showNavbar && <Navbar />} */}
          <Component {...pageProps} />
        </div>
      </div>
      </StateContextProvider>
      </ThirdwebProvider>
  
  );
}

export default MyApp;