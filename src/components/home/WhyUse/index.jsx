import React from 'react'
import Image from 'next/image'
import img from "@/assets/img/pic2.jpg"

const WhyUse = () => {
  return (
    <div className='flex items-center w-full md:w-[90%] mx-auto'>

      <div>
        <h2 className='font-semibold text-xl md:text-2xl lg:text-3xl'>Why Choose us</h2>
        <p >Our mobile charging station in town provides fast, reliable, and affordable charging solutions for all your devices. With cutting-edge technology and secure facilities, we ensure your devices stay powered anytime, anywhere. Choose us for convenience, efficiency, and unmatched customer satisfaction.</p>
      </div>

      <Image
        src={img}
        alt='image'
        width={100}
        height={100}
        // layout="fill"
        objectFit="cover"
        objectPosition="center"
        className='w-[700px] h-[300px] rounded'
      />
    </div>
  )
}

export default WhyUse
