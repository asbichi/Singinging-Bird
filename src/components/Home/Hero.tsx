import React from 'react';
import { motion } from 'motion/react';
import { Play, ChevronRight, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-nature-50 flex items-center">
      {/* BACKGROUND ELEMENTS */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-[10%] opacity-20 pointer-events-none"
      >
        <Music size={120} className="text-primary" />
      </motion.div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      {/* HERO CONTENT */}
      <div className="container mx-auto px-6 pt-32 lg:pt-0 flex flex-col lg:flex-row items-center justify-between relative z-10">
        
        {/* Text Area */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:w-1/2 text-center lg:text-left"
        >
          <motion.span variants={fadeInUp} className="inline-block px-4 py-1 rounded-full bg-secondary text-primary font-bold text-sm mb-4">
            🐦 WELCOME TO THE KADUNA BRANCH
          </motion.span>
          
          <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-heading font-black text-primary leading-tight mb-6">
            Where Every <br /> 
            <span className="text-accent">Bird Has a Song</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            Connecting bird lovers, canary breeders, and avian hobbyists across Kaduna. 
            Experience the finest singing competitions and expert breeding insights.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link to="/gallery" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all transform hover:scale-105">
              Explore Gallery <ChevronRight size={20} />
            </Link>
            <Link to="/media" className="bg-white text-primary border-2 border-primary/10 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-nature-50 transition-all">
              <Play size={20} fill="currentColor" /> Watch Live
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Image / Animated Card Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="lg:w-1/2 mt-16 lg:mt-0 relative"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-nature-100 min-h-[300px]">
            <img 
              src="https://i.ibb.co/chyx8Cp2/1c6f772b-8a1d-49e7-aed4-63596c0d7b00.jpg" 
              alt="Singing Canary" 
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
          
          {/* Floating Stats Card */}
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-10 -right-6 md:right-10 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4 border border-nature-100"
          >
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
               <Music className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-black text-primary">500+</p>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Bird Sounds Recorded</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
