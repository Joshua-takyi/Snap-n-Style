"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({ children, autoPlayInterval = 3000, gap = 16 }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [isPaused, setIsPaused] = useState(false);
	const [slidesPerView, setSlidesPerView] = useState(3);
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	const slides = React.Children.toArray(children);

	// Enhanced responsive slidesPerView
	useEffect(() => {
		const updateSlidesPerView = () => {
			if (window.innerWidth < 640) {
				setSlidesPerView(2); // Mobile
			} else if (window.innerWidth < 768) {
				setSlidesPerView(2); // Tablet
			} else if (window.innerWidth < 1024) {
				setSlidesPerView(3); // Small laptop
			} else if (window.innerWidth < 1280) {
				setSlidesPerView(4); // Desktop
			} else {
				setSlidesPerView(5); // Large desktop
			}
		};

		updateSlidesPerView();
		window.addEventListener("resize", updateSlidesPerView);
		return () => window.removeEventListener("resize", updateSlidesPerView);
	}, []);

	// Enhanced autoplay with pause on hover
	useEffect(() => {
		let interval;
		if (isAutoPlaying && !isPaused) {
			interval = setInterval(() => {
				setCurrentIndex((prev) => {
					const nextIndex = prev + 1;
					return nextIndex >= slides.length - slidesPerView + 1 ? 0 : nextIndex;
				});
			}, autoPlayInterval);
		}
		return () => clearInterval(interval);
	}, [isAutoPlaying, isPaused, slides.length, slidesPerView, autoPlayInterval]);

	// Navigation functions
	const nextSlide = useCallback(() => {
		setCurrentIndex((prev) =>
			prev >= slides.length - slidesPerView ? 0 : prev + 1
		);
	}, [slides.length, slidesPerView]);

	const prevSlide = useCallback(() => {
		setCurrentIndex((prev) =>
			prev <= 0 ? slides.length - slidesPerView : prev - 1
		);
	}, [slides.length, slidesPerView]);

	// Touch handlers
	const onTouchStart = (e) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
		setIsPaused(true);
	};

	const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

	const onTouchEnd = () => {
		setIsPaused(false);
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > 50;
		const isRightSwipe = distance < -50;

		if (isLeftSwipe) {
			nextSlide();
		} else if (isRightSwipe) {
			prevSlide();
		}
	};

	const slideWidth = `calc(${100 / slidesPerView}% - ${
		(gap * (slidesPerView - 1)) / slidesPerView
	}px)`;

	const translateX = `calc(-${currentIndex * (100 / slidesPerView)}% - ${
		currentIndex * gap
	}px)`;

	return (
		<div
			className="relative w-full overflow-hidden group px-4 sm:px-6 lg:px-8"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<div
				className="relative w-full"
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			>
				<div
					className="flex transition-transform duration-500 ease-in-out"
					style={{
						transform: `translateX(${translateX})`,
						gap: `${gap}px`,
					}}
				>
					{slides.map((slide, index) => (
						<div
							key={index}
							className="flex-shrink-0 transition-transform duration-300"
							style={{ width: slideWidth }}
						>
							{slide}
						</div>
					))}
				</div>
			</div>

			{/* Navigation arrows - Only show if there are more slides than visible */}
			{slides.length > slidesPerView && (
				<>
					<button
						onClick={prevSlide}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 
                     rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity
                     duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
						aria-label="Previous slide"
					>
						<ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
					</button>
					<button
						onClick={nextSlide}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 
                     rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity
                     duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
						aria-label="Next slide"
					>
						<ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
					</button>

					{/* Progress dots */}
					<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
						{Array.from({
							length: Math.ceil(
								(slides.length - slidesPerView + 1) / slidesPerView
							),
						}).map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index * slidesPerView)}
								className={`w-2 h-2 rounded-full transition-all duration-200 
                  ${
										index === Math.floor(currentIndex / slidesPerView)
											? "bg-black w-4"
											: "bg-gray-300 hover:bg-gray-400"
									}`}
								aria-label={`Go to slide group ${index + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default Carousel;
