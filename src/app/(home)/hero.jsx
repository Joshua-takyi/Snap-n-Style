"use client";
import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
	const fadeIn = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.5 },
	};

	const textContainer = {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const letterAnimation = {
		initial: { opacity: 0, y: 50 },
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	const words = "Snap n' Style".split("");

	return (
		<main className="relative min-h-[45vh] bg-gradient-to-br from-[#f4340d] to-[#05728D] overflow-hidden">
			{/* Content Container */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-20">
				<div className="relative z-10 h-full flex flex-col justify-center">
					{/* Main Text */}
					<motion.div
						variants={textContainer}
						initial="initial"
						animate="animate"
						className="flex flex-wrap mb-4"
					>
						{words.map((letter, index) => (
							<motion.span
								key={index}
								variants={letterAnimation}
								className="text-4xl md:text-6xl font-bold text-white mr-[0.2em] transition-transform hover:scale-110 cursor-default"
							>
								{letter}
							</motion.span>
						))}
					</motion.div>

					{/* Subtitle */}
					<motion.div
						variants={fadeIn}
						initial="initial"
						animate="animate"
						className="max-w-2xl"
					>
						<p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
							Discover the art of accessorizing with premium quality and
							effortless charm.
						</p>
						<p className="text-lg md:text-xl text-white/80 font-light mt-2">
							Your style, your statement—one snap at a time!
						</p>
					</motion.div>

					{/* CTA Button */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="mt-8"
					>
						<button className="px-8 py-3 bg-[#f4340d] text-white text-lg transition-all duration-300 hover:bg-opacity-90">
							Shop Now
						</button>
					</motion.div>

					{/* Floating Elements */}
					<motion.div
						animate={{
							y: [0, -20, 0],
							rotate: [0, 5, 0],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="absolute right-0 top-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
					/>
					<motion.div
						animate={{
							y: [0, 20, 0],
							rotate: [0, -5, 0],
						}}
						transition={{
							duration: 7,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="absolute left-1/4 bottom-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"
					/>
				</div>
			</div>
		</main>
	);
};

export default Hero;
