import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import SearchComponent from "./SearchComponent";
import PublicEvents from "./PublicEvents";

const Hero = () => {
  return (
    <header className="relative text-white min-h-screen flex flex-col items-center justify-start overflow-hidden pt-16 sm:pt-20">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/images/landuse.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center min-h-screen py-8 sm:py-12 md:py-16">
        <motion.div
          className="mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
            National Land Commission
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-green-500 font-semibold">
            Online Repository
          </p>
        </motion.div>

        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Empowering Kenyans through transparent, efficient, and sustainable
          land management.
        </motion.p>

        <motion.div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SearchComponent />
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <PublicEvents />
        </motion.div>

        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <ArrowDown className="w-8 h-8 animate-bounce" />
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;