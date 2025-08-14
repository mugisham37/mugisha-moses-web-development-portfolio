"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import {
  ViewportAnimation,
  StaggeredAnimation,
  ParallaxElement,
  AnimatedCounter,
  MagneticElement,
} from "./advanced-scroll-effects";
import {
  ScrollReveal,
  ScrollRevealStagger,
  ScrollTextReveal,
  ScrollMorph,
} from "./scroll-reveal-system";
import { useAnimationContext } from "./animation-provider";
import { cn } from "@/lib/utils";

interface AnimationShowcaseProps {
  className?: string;
}

export function AnimationShowcase({ className }: AnimationShowcaseProps) {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const { reducedMotion, performanceLevel } = useAnimationContext();

  const animationDemos = [
    {
      id: "viewport",
      title: "Viewport Animations",
      description: "Animations triggered when elements enter the viewport",
      component: (
        <div className="space-y-8">
          <ViewportAnimation variant="fadeInUp" delay={0.1}>
            <Card className="border-4 border-black bg-white">
              <CardContent className="p-6">
                <Typography variant="h3" className="text-black">
                  Fade In Up
                </Typography>
              </CardContent>
            </Card>
          </ViewportAnimation>
          
          <ViewportAnimation variant="scaleInRotate" delay={0.2} easing="elastic">
            <Card className="border-4 border-black bg-brutalist-yellow">
              <CardContent className="p-6">
                <Typography variant="h3" className="text-black">
                  Scale In Rotate
                </Typography>
              </CardContent>
            </Card>
          </ViewportAnimation>
          
          <ViewportAnimation variant="brutalistSlam" delay={0.3}>
            <Card className="border-4 border-white bg-black">
              <CardContent className="p-6">
                <Typography variant="h3" className="text-white">
                  Brutalist Slam
                </Typography>
              </CardContent>
            </Card>
          </ViewportAnimation>
        </div>
      ),
    },
    {
      id: "stagger",
      title: "Staggered Animations",
      description: "Sequential animations with delays",
      component: (
        <StaggeredAnimation staggerDelay={0.2} itemVariant="staggerRotateItem">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-4 border-black bg-white mb-4">
              <CardContent className="p-4">
                <Typography variant="body" className="text-black">
                  Staggered Item {i + 1}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </StaggeredAnimation>
      ),
    },
    {
      id: "parallax",
      title: "Parallax Effects",
      description: "Elements that move at different speeds during scroll",
      component: (
        <div className="space-y-8 min-h-[400px]">
          <ParallaxElement speed={0.2} direction="vertical">
            <Card className="border-4 border-black bg-brutalist-yellow">
              <CardContent className="p-6">
                <Typography variant="h3" className="text-black">
                  Slow Parallax
                </Typography>
              </CardContent>
            </Card>
          </ParallaxElement>
          
          <ParallaxElement speed={0.5} direction="vertical" scale={true}>
            <Card className="border-4 border-white bg-black">
              <CardContent className="p-6">
                <Typography variant="h3" className="text-white">
                  Fast Parallax + Scale
                </Typography>
              </CardContent>
            </Card>
          </ParallaxElement>
          
          <ParallaxElement speed={0.3} direction="vertical" rotate={true}>
            <Card className="border-4 border-black bg-white">
              <CardContent className="p-6">
                <Typography variant="h3" className="text-black">
                  Parallax + Rotate
                </Typography>
              </CardContent>
            </Card>
          </ParallaxElement>
        </div>
      ),
    },
    {
      id: "text",
      title: "Text Animations",
      description: "Character-by-character text reveals",
      component: (
        <div className="space-y-8">
          <ScrollTextReveal
            text="BRUTALIST DESIGN"
            className="text-4xl font-bold text-black font-mono"
            stagger={0.05}
            animation="slideUp"
          />
          
          <ScrollTextReveal
            text="MODERN DEVELOPMENT"
            className="text-3xl font-bold text-brutalist-yellow font-mono"
            stagger={0.03}
            animation="rotateIn"
          />
          
          <ScrollTextReveal
            text="EXCEPTIONAL RESULTS"
            className="text-2xl font-bold text-white font-mono"
            stagger={0.08}
            animation="scaleIn"
          />
        </div>
      ),
    },
    {
      id: "counters",
      title: "Animated Counters",
      description: "Numbers that count up when in view",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-4 border-black bg-white text-center">
            <CardContent className="p-6">
              <AnimatedCounter
                value={150}
                suffix="+"
                className="text-4xl font-bold text-black font-mono"
                duration={2}
              />
              <Typography variant="body" className="text-black mt-2">
                Projects Completed
              </Typography>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-white bg-black text-center">
            <CardContent className="p-6">
              <AnimatedCounter
                value={98}
                suffix="%"
                className="text-4xl font-bold text-brutalist-yellow font-mono"
                duration={2.5}
                delay={0.2}
              />
              <Typography variant="body" className="text-white mt-2">
                Client Satisfaction
              </Typography>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-black bg-brutalist-yellow text-center">
            <CardContent className="p-6">
              <AnimatedCounter
                value={5}
                className="text-4xl font-bold text-black font-mono"
                duration={1.5}
                delay={0.4}
              />
              <Typography variant="body" className="text-black mt-2">
                Years Experience
              </Typography>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "magnetic",
      title: "Magnetic Elements",
      description: "Elements that follow mouse movement",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MagneticElement strength={0.3}>
            <Card className="border-4 border-black bg-white cursor-pointer">
              <CardContent className="p-8 text-center">
                <Typography variant="h3" className="text-black">
                  Hover Me!
                </Typography>
                <Typography variant="body" className="text-black mt-2">
                  I follow your mouse
                </Typography>
              </CardContent>
            </Card>
          </MagneticElement>
          
          <MagneticElement strength={0.5}>
            <Card className="border-4 border-white bg-black cursor-pointer">
              <CardContent className="p-8 text-center">
                <Typography variant="h3" className="text-brutalist-yellow">
                  Strong Magnetic
                </Typography>
                <Typography variant="body" className="text-white mt-2">
                  More responsive
                </Typography>
              </CardContent>
            </Card>
          </MagneticElement>
        </div>
      ),
    },
    {
      id: "morphing",
      title: "Morphing Shapes",
      description: "Elements that change shape on scroll",
      component: (
        <div className="space-y-8">
          <ScrollMorph
            fromShape="0%"
            toShape="50%"
            duration={1}
            className="border-4 border-black bg-brutalist-yellow p-8"
          >
            <Typography variant="h3" className="text-black text-center">
              Rectangle to Circle
            </Typography>
          </ScrollMorph>
          
          <ScrollMorph
            fromShape="50%"
            toShape="0%"
            duration={1.2}
            className="border-4 border-white bg-black p-8"
          >
            <Typography variant="h3" className="text-white text-center">
              Circle to Rectangle
            </Typography>
          </ScrollMorph>
        </div>
      ),
    },
    {
      id: "reveal",
      title: "Advanced Reveals",
      description: "Complex reveal animations",
      component: (
        <ScrollRevealStagger
          animation="brutalistPunch"
          config={{ stagger: 0.2, easing: "backOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="border-4 border-black bg-white">
            <CardHeader>
              <CardTitle className="text-black">Brutalist Punch</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body" className="text-black">
                Aggressive entrance animation
              </Typography>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-white bg-black">
            <CardHeader>
              <CardTitle className="text-brutalist-yellow">Staggered</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body" className="text-white">
                Sequential reveals
              </Typography>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-black bg-brutalist-yellow">
            <CardHeader>
              <CardTitle className="text-black">Back Out Easing</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body" className="text-black">
                Elastic bounce effect
              </Typography>
            </CardContent>
          </Card>
          
          <Card className="border-4 border-black bg-white">
            <CardHeader>
              <CardTitle className="text-black">Final Item</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body" className="text-black">
                Last in sequence
              </Typography>
            </CardContent>
          </Card>
        </ScrollRevealStagger>
      ),
    },
  ];

  return (
    <div className={cn("space-y-12", className)}>
      {/* Header */}
      <ViewportAnimation variant="fadeInUp" delay={0.1}>
        <div className="text-center space-y-4">
          <Typography
            variant="h1"
            className="text-4xl md:text-6xl font-bold text-black uppercase font-mono"
          >
            ANIMATION SHOWCASE
          </Typography>
          <Typography
            variant="body"
            className="text-brutalist-charcoal-200 max-w-2xl mx-auto"
          >
            Comprehensive demonstration of the advanced animation system with
            viewport triggers, parallax effects, and performance optimization.
          </Typography>
          
          {/* Performance Info */}
          <div className="flex justify-center space-x-4 text-sm font-mono">
            <span className={cn(
              "px-3 py-1 border-2",
              reducedMotion 
                ? "border-red-500 bg-red-100 text-red-800" 
                : "border-green-500 bg-green-100 text-green-800"
            )}>
              Motion: {reducedMotion ? "REDUCED" : "ENABLED"}
            </span>
            <span className="px-3 py-1 border-2 border-blue-500 bg-blue-100 text-blue-800">
              Performance: {performanceLevel.toUpperCase()}
            </span>
          </div>
        </div>
      </ViewportAnimation>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {animationDemos.map((demo, index) => (
          <ViewportAnimation
            key={demo.id}
            variant="fadeInUp"
            delay={index * 0.1}
            className="h-full"
          >
            <Card className="border-4 border-black bg-white h-full">
              <CardHeader>
                <CardTitle className="text-black text-xl font-mono uppercase"></CardTitle>         {demo.title}
                </CardTitle>
                <Typography variant="body" className="text-brutalist-charcoal-200">
                  {demo.description}
                </Typography>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant={activeDemo === demo.id ? "accent" : "secondary"}
                  onClick={() => 
                    setActiveDemo(activeDemo === demo.id ? null : demo.id)
                  }
                  className="w-full"
                >
                  {activeDemo === demo.id ? "HIDE DEMO" : "SHOW DEMO"}
                </Button>
                
                <AnimatePresence>
                  {activeDemo === demo.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t-2 border-black">
                        {demo.component}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </ViewportAnimation>
        ))}
      </div>

      {/* Performance Tips */}
      <ViewportAnimation variant="fadeInUp" delay={0.5}>
        <Card className="border-4 border-black bg-brutalist-yellow">
          <CardHeader>
            <CardTitle className="text-black font-mono uppercase">
              Performance Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="h4" className="text-black font-bold mb-2">
                  Automatic Optimization
                </Typography>
                <ul className="space-y-1 text-black text-sm">
                  <li>• Reduced motion detection</li>
                  <li>• Device performance adaptation</li>
                  <li>• Animation throttling</li>
                  <li>• Memory management</li>
                </ul>
              </div>
              <div>
                <Typography variant="h4" className="text-black font-bold mb-2">
                  Advanced Features
                </Typography>
                <ul className="space-y-1 text-black text-sm">
                  <li>• Viewport-based triggers</li>
                  <li>• Parallax effects</li>
                  <li>• Magnetic interactions</li>
                  <li>• Morphing animations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </ViewportAnimation>
    </div>
  );
}