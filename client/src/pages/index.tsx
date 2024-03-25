"use client"
import React from 'react'
import { useState } from 'react';
import { NextPage } from "next";
import { ConnectWallet } from "@thirdweb-dev/react";
import { LayoutGrid } from "../components/layout-grid";
import { Inter } from "next/font/google"
import { TypewriterEffectSmooth } from "../components/typewriter-effect";
import type { ButtonProps } from "@material-tailwind/react";
import { Button } from "../components/CustomButton";
import Link from 'next/link';
import Testimonial from '../components/Testimonials'
import FadeInSection from '../components/FadeInSection';
import FaqSection from '../components/Faq';
import Hero from '../components/Hero';

const inter = Inter({ subsets: ['latin']})

const Home: NextPage = () => {

  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the dropdown state
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  




   
  return (
    
      <div className={` ${inter.className}`} >
          {/* <div className='flex flex-col items-center justify-center h-[68rem] w-full bgImageWithOpacity mb-[100px] '> */}
          <FadeInSection>
          <div className='flex flex-col items-center justify-center h-[68rem] w-full  '>
            <Hero />
            {/* <TypewriterEffectSmooth words={words} /> */}


          </div>
          </FadeInSection>

          {/* <FadeInSection>
            <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6 mb-[100px]">
              <h1 className='text-white mb-12 text-5xl font-semibold'>User Statistics</h1>
                  <dl className="grid max-w-screen-md mx-auto sm:grid-cols-3 text-white divide-x divide-white divide-opacity-10 bg-gray-900 rounded-xl py-6 md:w-[1500px]">
                      <div className="flex flex-col items-center justify-center px-4">
                          <dt className="mb-2 text-3xl md:text-5xl font-extrabold">73M+</dt>
                          <dd className="font-light text-gray-400 dark:text-gray-400">Donations</dd>
                      </div>
                      <div className="flex flex-col items-center justify-center px-4">
                          <dt className="mb-2 text-3xl md:text-5xl font-extrabold">1B+</dt>
                          <dd className="font-light text-gray-400 dark:text-gray-400">Donors</dd>
                      </div>
                      <div className="flex flex-col items-center justify-center px-4">
                          <dt className="mb-2 text-3xl md:text-5xl font-extrabold">100K</dt>
                          <dd className="font-light text-gray-400 dark:text-gray-400">Campaigns</dd>
                      </div>
                  </dl>
              </div>
            </FadeInSection> */}

          <FadeInSection>
          <div className="flex flex-col md:flex-row text-white md:mb-[250px] mb-[100px] sm:max-w-[1280px] md:max-w-[1500px] md:w-full mx-auto">
            <div className="md:flex-1 p-10 flex justify-center md:justify-center flex-col">
              <h1 className="text-3xl md:text-[120px] text-[50px] font-semibold mb-4 mt-5">Dive into </h1>
              <h1 className="text-3xl md:text-[120px] text-[50px] font-semibold mb-4 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text leading-none">Blockchain </h1>
              <h1 className="text-3xl md:text-[120px] text-[50px] font-semibold">Crowdfunding </h1>
              
            </div>
            
            <div className="md:flex-1 p-10 flex flex-col justify-center">
              
            <div className="relative pl-6 mb-6">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white opacity-10"></div>
              <p className='md:text-[34px] text-[20px]'>
                <span className='font-bold'>Create Dynamic Campaigns</span> with a goal in mind.
              </p>
            </div>

            <div className="relative pl-6 mb-6">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white opacity-10"></div>
              <p className='md:text-[34px] text-[20px]'>
              <span className='font-bold'>Participate</span> in your favorite projects with votes.
              </p>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white opacity-10"></div>
              <p className='md:text-[34px] text-[20px]'>
              <span className='font-bold'>Receive updates</span> from organizers in real time.
              </p>
            </div>
            </div>
          </div>
          </FadeInSection>



          <FadeInSection>
        <section className="dark:bg-gray-900 sm:mb-[150px] md:mb-[175px]">
            <div className="gap-16 items-center py-8 px-6 mx-auto md:w-[1500px]  lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
            <div className="grid grid-cols-2 gap-4 mt-8">
                    <img className="w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png" alt="office content 1" />
                    <img className="mt-4 w-full lg:mt-10 rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png" alt="office content 2" />
                </div>
                <div className="font-normal text-gray-400 text-l md:text-xl">
                    <h2 className="mb-4 md:text-5xl text-3xl tracking-tight font-extrabold text-white dark:text-white bg-blue-500 rounded-[10px] py-2 px-4 inline-block">Transparency is Key</h2>

                    <p className="mb-5 text-justify font-light">Our objective is to provide a safe and secure environment for all Donors, Entrepreneurs and Campaign organizers. We believe that transparency fosters trust and trust fosters a community.  </p>
                    <p className='text-justify font-light'>Safety is paramount. We implement rigorous security measures to protect the personal and financial information of our users. From advanced encryption technologies to regular security audits, we go above and beyond to ensure that every transaction and interaction within our community is safeguarded against threats.</p>
                </div>

            </div>
        </section>
        </FadeInSection>
        <FadeInSection>

          <FaqSection />

        </FadeInSection>
        <FadeInSection>

          <Testimonial/>

        </FadeInSection>
      </div>
    
  )
}

export default Home