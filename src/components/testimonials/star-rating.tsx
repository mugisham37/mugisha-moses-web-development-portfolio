"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onChange,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onChange) {
      onChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovering(false);
      setHoverRating(0);
    }
  };

  const displayRating = isHovering ? hoverRating : rating;

  return (
    <div className={`flex gap-1 ${className}`} onMouseLeave={handleMouseLeave}>
      {[...Array(maxRating)].map((_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= displayRating;

        return (
          <motion.button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleStarClick(starRating)}
            onMouseEnter={() => handleStarHover(starRating)}
            className={` ${sizeClasses[size]} ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} ${isFilled ? "text-brutalist-yellow" : "text-gray-600"} transition-colors duration-200 disabled:cursor-default`}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
          >
            ★
          </motion.button>
        );
      })}
    </div>
  );
}
