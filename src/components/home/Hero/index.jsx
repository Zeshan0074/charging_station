"use clinet";
import Image from 'next/image';
import heroImg from "@/assets/img/pic2.jpg"

import React from 'react'

const Hero = () => {
    return (
        <div className="relative w-full h-[100vh] mb-12">
            <Image
                src={heroImg}
                alt="hero image"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
            />
        </div>

    )
}

export default Hero
