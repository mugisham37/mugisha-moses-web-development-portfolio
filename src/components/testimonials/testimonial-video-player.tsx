"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TestimonialVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string | null;
  clientName: string;
  className?: string;
}

export function TestimonialVideoPlayer({
  videoUrl,
  posterUrl,
  clientName,
  className = "",
}: TestimonialVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={`relative aspect-video overflow-hidden border-2 border-white ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={posterUrl || undefined}
        onEnded={handleVideoEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl.replace(".mp4", ".webm")} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Overlay */}
      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black"
          >
            <Button
              variant="accent"
              size="lg"
              onClick={handlePlayPause}
              className="h-16 w-16 rounded-full p-0"
            >
              <span className="text-2xl">{isPlaying ? "⏸" : "▶"}</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Label */}
      <div className="bg-opacity-75 absolute bottom-2 left-2 bg-black px-2 py-1">
        <span className="font-mono text-xs text-white uppercase">
          {clientName} • Video Testimonial
        </span>
      </div>

      {/* Brutalist Corner Accent */}
      <div className="bg-brutalist-yellow absolute top-0 right-0 h-4 w-4" />
    </div>
  );
}
