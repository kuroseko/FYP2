import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Link from 'next/link';
import { ConnectWallet } from '@thirdweb-dev/react';
import { navlinks } from '../constants';
import Image from 'next/image';
import { logoTest } from '../assets';

const NavbarFin = () => {
  const router = useRouter();
  const [toggleDrawer, setToggleDrawer] = useState(false);

  const toggleMenu = () => {
    setToggleDrawer((prevToggleDrawer) => !prevToggleDrawer);
  };

  const closeMenu = () => {
    setToggleDrawer(false);
  };

  const isActiveRoute = (path: any) => {
    return router.pathname === path;
  };

  return (
    <div>
      <nav className="fixed w-full z-20 top-0 start-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo and company name */}
          <Link href="/" className="flex items-center  rtl:space-x-reverse">
            <Image src={logoTest} className="h-[75px] w-[75px]" alt="" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">ChainFund</span>
          </Link>
          {/* Connect wallet and hamburger menu */}
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <ConnectWallet />
            <button onClick={toggleMenu} data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center mt-1 p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded={toggleDrawer}>
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            </button>
          </div>
          {/* Navbar for smaller screens */}
          <div
            className={`absolute top-full right-0 bg-white rounded-lg shadow-lg md:hidden transform ${
              toggleDrawer ? "scale-y-100" : "scale-y-0"
            } transition-transform duration-300 ease-in-out origin-top w-full z-10`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col w-full">
              {navlinks.map((item, index) => (
                <li key={index} className={`w-full ${isActiveRoute(item.link) ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                  <Link href={item.link}>
                    <p className="py-2 px-3 w-full text-left flex items-center" onClick={toggleMenu}>
                      {item.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
    {/* Navbar bigger screen */}
            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 bg-white rounded-xl md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                <li className={isActiveRoute('/') ? 'text-blue-700' : 'text-gray-900'}>
                    <Link href="/" className="block py-2 px-3 bg-blue-700 rounded md:bg-transparent hover:bg-gray-100" aria-current="page">Home</Link>
                </li>
                <li className={isActiveRoute('/campaign') ? 'text-blue-700' : 'text-gray-900'}>
                    <Link href="/campaign" className="block py-2 px-3 bg-blue-700 rounded md:bg-transparent hover:bg-gray-100 ">Campaigns</Link>
                </li>
                <li className={isActiveRoute('/about') ? 'text-blue-700' : 'text-gray-900'}>
                    <Link href="/about" className="block py-2 px-3 bg-blue-700 rounded md:bg-transparent hover:bg-gray-100">About</Link>
                </li>
                <li className={isActiveRoute('/profile') ? 'text-blue-700' : 'text-gray-900'}>
                    <Link href="/profile" className="block py-2 px-3 bg-blue-700 rounded md:bg-transparent hover:bg-gray-100">Profile</Link>
                </li>
                </ul>
            </div>
            </div>
        </nav>

    </div>

  )
}

export default NavbarFin;