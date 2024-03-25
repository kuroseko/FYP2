"use client";

import React from 'react'
import CenterAligner from './CenterAligner';
import Image from 'next/image';
type Props = {};
import { useRef } from 'react';
//React Icons
import {FaQuoteLeft, FaQuoteRight} from "react-icons/fa";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";

//Slider
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { testimonials } from '../datas/testimonials';

export default function Testimonials({}: Props) {

    const sliderRef = useRef<any>();

    //SEttings 
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true, // Enable autoplay mode
        autoplaySpeed: 5000,
        // Set the time interval between slides to 3000ms (3 seconds)
    }
  return (
    <CenterAligner className="bg-[#13131a] px-5 py-10">
        <h1 className="text-left md:text-5xl font-bold sm:text-3xl pb-5 text-white">
        Testimonials
        </h1>
        <p className="text-left text-gray-500 pb-5 md:text-[20px] sm:text-[15px]">View what our other users have to say!</p>

        {/* Container for the slider */}
        <section className="max-w-7xl mx-auto w-full rounded-xl relative overflow-hidden">
            {/* Main Section */}
            <Slider {...settings} ref={sliderRef}>
                {testimonials.map((single,index)=> {
                    return (
                        <div key={index} >
                            <section className="mx-auto bg-gray-900 p-5 sm:p-12 grid grid-cols-1 sm:grid-cols-[1fr_3fr] md:grid-cols-[1fr_4fr] items-center gap-5 md:gap-8 rounded-xl overflow-hidden h-[600px] md:h-[400px] ">

                                {/* Left Section */}
                                <div className='space-y-5 text-center'>
                                    {/* Image */}
                                    <div className='border-8 inline-block rounded-full border-blue-400 p-2.5'>
                                        <div className='mx-auto w-[100px] h-[100px] rounded-full bg-gray-200 overflow-hidden'>
                                            <Image src={single.img} alt="" className="w-full h-full object-cover"></Image>
                                        </div>

                                    </div>
                                    {/* Others */}
                                    <div>
                                        <h2 className=' text-xl font-medium text-white'>{single.name}</h2>
                                        <p className='text-gray-400'>{single.role}</p>
                                    </div>
                                </div>


                                {/* Right Section */}
                                <div className='space-y-3 text-[16px] sm:text-[18px]'>
                                    <div className='text-blue-500 text-[40px]'>
                                        <FaQuoteLeft/>
                                    </div>
                                    <p className='leading-[30px] font-bold text-white'>{single.testimonial}</p>
                                    <div className='text-blue-500 text-[40px] '>
                                        <FaQuoteRight className="ml-auto"/>
                                    </div>
                                </div>
                            </section>

                        </div>
                    );
                })}
            </Slider>

            {/* Prev next button */}
            <button className='absolute top-[50%] left-[10px] z-10 text-2xl text-white' onClick={()=> sliderRef.current?.slickPrev()}>
                <MdOutlineArrowBackIos />
            </button>
            <button className='absolute top-[50%] right-[10px] z-10 text-2xl text-white' onClick={()=> sliderRef.current?.slickNext()}>
                <MdOutlineArrowForwardIos />
            </button>
        </section>
    </CenterAligner>
  )
}