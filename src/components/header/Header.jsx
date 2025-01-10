"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import LoginModal from "../auth/Login";

const headerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
};

const Header = () => {
  const navItems = [{ label: "Search For Station", link: "/location" }];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <motion.header
      className="relative w-full bg-secondary z-20"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="lg:px-12 md:px-8 px-4 py-7 flex justify-between items-center">
        {/* Logo */}
        <motion.div className="flex items-center" variants={headerVariants}>
          Mobile Station
        </motion.div>

        {/* Navigation */}
        <nav className="navbar space-x-6 text-[18px] font-sans flex flex-row">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="text-black text-sm md:text-[18px] font-bold hover:text-primary border-b-2 border-black hover:border-primary transition duration-300 ease-in-out"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <FaUserCircle size={20} className="hover:text-primary transition duration-300 ease-in-out" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md overflow-hidden">
              <button
                onClick={openModal}
                className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-200"
              >
                Login
              </button>
              <Link
                href="/signup"
                className="block px-4 py-2 text-sm text-black hover:bg-gray-200"
              >
                Signup
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-black hover:bg-gray-200"
              >
                Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isModalOpen} closeModal={closeModal} />
    </motion.header>
  );
};

export default Header;
