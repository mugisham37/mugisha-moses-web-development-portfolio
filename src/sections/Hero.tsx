"use client";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { useState, useEffect } from "react";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Detect touch device
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };

    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isTouchDevice) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTouchDevice && e.touches.length > 0) {
        const touch = e.touches[0];
        setTouchPosition({ x: touch.clientX, y: touch.clientY });
        setIsHovering(true);
      }
    };

    const handleTouchEnd = () => {
      if (isTouchDevice) {
        // Keep content visible for a moment after touch ends
        setTimeout(() => setIsHovering(false), 2000);
      }
    };

    if (isTouchDevice) {
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener(
        "touchstart",
        (e) => {
          const touch = e.touches[0];
          setTouchPosition({ x: touch.clientX, y: touch.clientY });
          setIsHovering(true);
        },
        { passive: true }
      );
    } else {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchstart", handleTouchEnd);
      window.removeEventListener("resize", checkTouchDevice);
    };
  }, [isTouchDevice]);

  // Calculate responsive circle size and position - SCALED DOWN for better mobile/tablet visibility
  const getCircleSize = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 300; // Mobile - increased from 150
      if (width < 1024) return 400; // Tablet - increased from 200
      return 288; // Desktop - kept same
    }
    return 288;
  };

  const currentPosition = isTouchDevice ? touchPosition : mousePosition;
  const circleSize = getCircleSize();

  return (
    <main
      id="hero"
      className="min-h-[80vh] bg-black relative overflow-hidden lg:cursor-none"
      onMouseEnter={() => !isTouchDevice && setIsHovering(true)}
      onMouseLeave={() => !isTouchDevice && setIsHovering(false)}
    >
      {/* Pixelated Background */}
      <div className="absolute inset-0 w-full h-full">
        <PixelatedCanvas
          src="/assets/images/head-shot.jpg"
          width={1520}
          height={680}
          cellSize={3}
          dotScale={0.85}
          shape="square"
          backgroundColor="#000000"
          dropoutStrength={0.2}
          interactive
          distortionStrength={2}
          distortionRadius={120}
          distortionMode="swirl"
          followSpeed={1}
          jitterStrength={2}
          jitterSpeed={0.8}
          sampleAverage
          tintColor="#000000"
          tintStrength={0.3}
          objectFit="cover"
          fadeOnLeave
          fadeSpeed={1}
          className="w-full h-full object-cover"
          responsive
        />
      </div>

      {/* White overlay with circular cutout */}
      <div
        className="absolute inset-0 bg-white z-20"
        style={{
          maskImage: isHovering
            ? `radial-gradient(circle ${circleSize}px at ${currentPosition.x}px ${currentPosition.y}px, transparent ${circleSize}px, white ${circleSize}px)`
            : "none",
          WebkitMaskImage: isHovering
            ? `radial-gradient(circle ${circleSize}px at ${currentPosition.x}px ${currentPosition.y}px, transparent ${circleSize}px, white ${circleSize}px)`
            : "none",
        }}
      />

      {/* Main heading - responsive sizing and positioning */}
      <div
        className="relative min-h-[80vh] z-30"
        style={{
          maskImage: isHovering
            ? `radial-gradient(circle ${circleSize}px at ${currentPosition.x}px ${currentPosition.y}px, transparent ${circleSize}px, white ${circleSize}px)`
            : "none",
          WebkitMaskImage: isHovering
            ? `radial-gradient(circle ${circleSize}px at ${currentPosition.x}px ${currentPosition.y}px, transparent ${circleSize}px, white ${circleSize}px)`
            : "none",
        }}
      >
        <h1
          className="absolute 
          bottom-20 left-4 
          sm:bottom-14 sm:left-6 
          md:bottom-16 md:left-8 
          lg:bottom-20 lg:left-24 
          text-[42px] 
          sm:text-[56px] 
          md:text-[84px] 
          lg:text-[170px] 
          font-normal text-black leading-none tracking-tight
          max-w-[calc(100vw-2rem)]
          sm:max-w-[calc(100vw-3rem)]
          md:max-w-[calc(100vw-4rem)]
          lg:max-w-none
        "
        >
          <span className="block sm:inline">Moses</span>
          <span className="hidden sm:inline"> — </span>
          <span className="block sm:inline">Mugisha</span>
        </h1>
      </div>

      {/* Bottom information - responsive layout */}
      <div
        className="absolute 
          bottom-2 left-4 right-4
          sm:bottom-4 sm:left-6 sm:right-6
          md:bottom-6 md:left-8 md:right-8
          lg:bottom-8 lg:left-28 lg:right-28
          flex flex-col gap-2
          sm:flex-row sm:justify-between sm:items-end
          z-30"
        style={{
          maskImage: isHovering
            ? `radial-gradient(circle ${circleSize}px at ${currentPosition.x}px ${currentPosition.y}px, transparent ${circleSize}px, white ${circleSize}px)`
            : "none",
          WebkitMaskImage: isHovering
            ? `radial-gradient(circle ${circleSize}px at ${currentPosition.x}px ${currentPosition.y}px, transparent ${circleSize}px, white ${circleSize}px)`
            : "none",
        }}
      >
        <div className="text-xs sm:text-sm text-black">
          7° 18&apos; 38.664&quot; S 112° 45&apos; 32.1084&quot; E
        </div>
        <div className="text-xs sm:text-sm text-black sm:text-right">
          <div>Surabaya, 1:38:56 PM</div>
          <div>Tuesday, September 2, 2025</div>
        </div>
      </div>

      {/* Touch instruction for mobile - only shows briefly on first load */}
      {isTouchDevice && (
        <div className="absolute top-4 left-4 right-4 z-40 pointer-events-none">
          <div
            className={`text-white text-sm text-center bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 transition-opacity duration-1000 ${
              isHovering ? "opacity-0" : "opacity-100"
            }`}
          >
            Touch and drag to reveal content
          </div>
        </div>
      )}
    </main>
  );
}
