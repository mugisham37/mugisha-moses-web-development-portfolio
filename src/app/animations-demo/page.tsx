"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import {
  EnhancedScrollReveal,
  ScrollCounter,
  MultiDirectionalReveal,
  ScrollTextReveal,
} from "@/components/animations/enhanced-scroll-reveal";
import {
  BrutalistHover,
  InteractiveCard,
  MagneticHover,
  RippleEffect,
  FloatingActionButton,
  TextHoverEffect,
} from "@/components/animations/hover-effects";
import {
  ParallaxContainer,
  BackgroundParallax,
  ParallaxText,
  VelocityParallax,
  MouseParallax,
  BrutalistParallaxBackground,
} from "@/components/animations/parallax-effects";
import {
  BrutalistSpinner,
  MechanicalLoading,
  GlitchLoading,
  BrutalistProgressBar,
  BrutalistSkeleton,
  TypewriterLoading,
  LoadingOverlay,
  PulseDots,
  MatrixLoading,
  CardLoading,
} from "@/components/animations/loading-animations";
import {
  SwipeGesture,
  PullToRefresh,
  LongPressGesture,
  PinchZoom,
  DragToDismiss,
  MultiTouchGesture,
} from "@/components/animations/gesture-recognition";
import { StaggeredPageContent } from "@/components/animations/page-transitions";

export default function AnimationsDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(45);
  const [dismissedCards, setDismissedCards] = useState<number[]>([]);

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleCardDismiss = (index: number) => {
    setDismissedCards((prev) => [...prev, index]);
  };

  const demoSections = [
    {
      title: "Enhanced Scroll Reveals",
      content: (
        <div className="space-y-8">
          <EnhancedScrollReveal direction="up" brutalistEffect>
            <Card className="p-6">
              <Typography variant="h3" className="text-brutalist-yellow">
                Slide Up Animation
              </Typography>
              <Typography variant="body" className="text-white">
                This card slides up with brutalist 3D effects when scrolled into
                view.
              </Typography>
            </Card>
          </EnhancedScrollReveal>

          <EnhancedScrollReveal direction="left" delay={0.2}>
            <Card className="p-6">
              <Typography variant="h3" className="text-brutalist-yellow">
                Slide Left Animation
              </Typography>
              <Typography variant="body" className="text-white">
                This card slides from the left with a slight delay.
              </Typography>
            </Card>
          </EnhancedScrollReveal>

          <EnhancedScrollReveal direction="scale" delay={0.4}>
            <Card className="p-6">
              <Typography variant="h3" className="text-brutalist-yellow">
                Scale Animation
              </Typography>
              <Typography variant="body" className="text-white">
                This card scales in with mechanical precision.
              </Typography>
            </Card>
          </EnhancedScrollReveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MultiDirectionalReveal
              directions={["up", "down", "left", "right", "scale"]}
              staggerDelay={0.1}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-4">
                  <Typography variant="h4" className="text-brutalist-yellow">
                    Card {index + 1}
                  </Typography>
                  <Typography variant="body" className="text-white">
                    Multi-directional reveal animation.
                  </Typography>
                </Card>
              ))}
            </MultiDirectionalReveal>
          </div>

          <div className="text-center">
            <ScrollCounter
              end={1337}
              suffix="+"
              className="text-brutalist-yellow text-4xl font-bold"
            />
            <Typography variant="body" className="text-white">
              Projects Completed
            </Typography>
          </div>

          <ScrollTextReveal
            text="This text reveals with a typewriter effect when scrolled into view!"
            className="text-brutalist-yellow font-mono text-2xl font-bold"
          />
        </div>
      ),
    },
    {
      title: "Hover Effects",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <BrutalistHover variant="default">
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-brutalist-yellow">
                  Default Hover
                </Typography>
                <Typography variant="body" className="text-white">
                  Classic brutalist shadow effect
                </Typography>
              </Card>
            </BrutalistHover>

            <BrutalistHover variant="glitch">
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-brutalist-yellow">
                  Glitch Hover
                </Typography>
                <Typography variant="body" className="text-white">
                  Digital glitch animation
                </Typography>
              </Card>
            </BrutalistHover>

            <BrutalistHover variant="mechanical">
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-brutalist-yellow">
                  Mechanical
                </Typography>
                <Typography variant="body" className="text-white">
                  3D mechanical movement
                </Typography>
              </Card>
            </BrutalistHover>

            <BrutalistHover variant="shake">
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-brutalist-yellow">
                  Shake Hover
                </Typography>
                <Typography variant="body" className="text-white">
                  Vibration effect on hover
                </Typography>
              </Card>
            </BrutalistHover>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {(["lift", "tilt", "glow", "invert", "scale"] as const).map((effect) => (
              <InteractiveCard
                key={effect}
                hoverEffect={effect}
                className="p-4 text-center"
              >
                <Typography
                  variant="h4"
                  className="text-brutalist-yellow capitalize"
                >
                  {effect}
                </Typography>
                <Typography variant="body" className="text-white">
                  Interactive card effect
                </Typography>
              </InteractiveCard>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <MagneticHover strength={0.3}>
              <Button variant="primary">Magnetic Button</Button>
            </MagneticHover>

            <RippleEffect rippleColor="#FFFF00">
              <Button variant="secondary">Ripple Effect</Button>
            </RippleEffect>
          </div>

          <div className="space-y-4">
            <Typography variant="h3" className="text-brutalist-yellow">
              Text Hover Effects
            </Typography>
            <div className="space-y-2">
              <TextHoverEffect
                text="GLITCH TEXT EFFECT"
                effect="glitch"
                className="font-mono text-2xl font-bold text-white"
              />
              <TextHoverEffect
                text="WAVE TEXT EFFECT"
                effect="wave"
                className="font-mono text-2xl font-bold text-white"
              />
              <TextHoverEffect
                text="BOUNCE TEXT EFFECT"
                effect="bounce"
                className="font-mono text-2xl font-bold text-white"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Parallax Effects",
      content: (
        <div className="space-y-8">
          <ParallaxContainer speed={0.5} className="h-64 overflow-hidden">
            <div className="from-brutalist-yellow flex h-full items-center justify-center bg-gradient-to-r to-white">
              <Typography variant="h2" className="text-black">
                PARALLAX CONTAINER
              </Typography>
            </div>
          </ParallaxContainer>

          <BackgroundParallax
            height="300px"
            layers={[
              {
                content: (
                  <div className="from-brutalist-yellow/20 h-full bg-gradient-to-b to-transparent" />
                ),
                speed: 0.3,
                zIndex: 1,
              },
              {
                content: (
                  <div className="flex h-full items-center justify-center">
                    <Typography variant="h1" className="text-white">
                      LAYERED PARALLAX
                    </Typography>
                  </div>
                ),
                speed: 0.6,
                zIndex: 2,
              },
            ]}
          />

          <ParallaxText
            text="3D PARALLAX TEXT"
            speed={0.4}
            depth={30}
            className="text-brutalist-yellow text-center font-mono text-4xl font-bold"
          />

          <VelocityParallax factor={0.3}>
            <Card className="p-8 text-center">
              <Typography variant="h3" className="text-brutalist-yellow">
                Velocity-Based Parallax
              </Typography>
              <Typography variant="body" className="text-white">
                This moves based on scroll velocity
              </Typography>
            </Card>
          </VelocityParallax>

          <MouseParallax strength={0.1}>
            <Card className="p-8 text-center">
              <Typography variant="h3" className="text-brutalist-yellow">
                Mouse Parallax
              </Typography>
              <Typography variant="body" className="text-white">
                Follows your mouse movement
              </Typography>
            </Card>
          </MouseParallax>

          <div className="relative h-64">
            <BrutalistParallaxBackground />
            <div className="relative z-10 flex h-full items-center justify-center">
              <Typography variant="h2" className="text-white">
                GEOMETRIC PARALLAX
              </Typography>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Loading Animations",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center space-y-2">
              <BrutalistSpinner size="lg" />
              <Typography variant="caption" className="text-white">
                Brutalist Spinner
              </Typography>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <MechanicalLoading />
              <Typography variant="caption" className="text-white">
                Mechanical Loading
              </Typography>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <PulseDots />
              <Typography variant="caption" className="text-white">
                Pulse Dots
              </Typography>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <GlitchLoading text="LOADING" />
            </div>
          </div>

          <div className="space-y-4">
            <Typography variant="h4" className="text-brutalist-yellow">
              Progress Bar
            </Typography>
            <BrutalistProgressBar progress={progress} />
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => setProgress(Math.max(0, progress - 10))}
              >
                -10%
              </Button>
              <Button
                variant="secondary"
                onClick={() => setProgress(Math.min(100, progress + 10))}
              >
                +10%
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Typography variant="h4" className="text-brutalist-yellow">
              Skeleton Loading
            </Typography>
            <BrutalistSkeleton lines={4} />
          </div>

          <div className="space-y-4">
            <Typography variant="h4" className="text-brutalist-yellow">
              Typewriter Loading
            </Typography>
            <TypewriterLoading
              texts={["INITIALIZING...", "LOADING DATA...", "ALMOST READY..."]}
              className="text-brutalist-yellow text-xl"
            />
          </div>

          <div className="space-y-4">
            <Typography variant="h4" className="text-brutalist-yellow">
              Matrix Loading
            </Typography>
            <MatrixLoading />
          </div>

          <div className="space-y-4">
            <Typography variant="h4" className="text-brutalist-yellow">
              Card Loading State
            </Typography>
            <CardLoading />
          </div>

          <div className="space-y-4">
            <Button
              variant="primary"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 3000);
              }}
            >
              Test Loading Overlay
            </Button>
            <LoadingOverlay isLoading={isLoading}>
              <Card className="p-8">
                <Typography variant="h3" className="text-brutalist-yellow">
                  Content Behind Overlay
                </Typography>
                <Typography variant="body" className="text-white">
                  This content will be covered by the loading overlay when
                  active.
                </Typography>
              </Card>
            </LoadingOverlay>
          </div>
        </div>
      ),
    },
    {
      title: "Gesture Recognition",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SwipeGesture
              onSwipeLeft={() => alert("Swiped Left!")}
              onSwipeRight={() => alert("Swiped Right!")}
              onSwipeUp={() => alert("Swiped Up!")}
              onSwipeDown={() => alert("Swiped Down!")}
            >
              <Card className="p-8 text-center">
                <Typography variant="h4" className="text-brutalist-yellow">
                  Swipe Gesture
                </Typography>
                <Typography variant="body" className="text-white">
                  Swipe in any direction on this card
                </Typography>
              </Card>
            </SwipeGesture>

            <LongPressGesture
              onLongPress={() => alert("Long Press Detected!")}
              duration={1000}
            >
              <Card className="p-8 text-center">
                <Typography variant="h4" className="text-brutalist-yellow">
                  Long Press
                </Typography>
                <Typography variant="body" className="text-white">
                  Hold for 1 second to trigger
                </Typography>
              </Card>
            </LongPressGesture>
          </div>

          <PullToRefresh onRefresh={handleRefresh}>
            <div className="space-y-4">
              <Typography variant="h4" className="text-brutalist-yellow">
                Pull to Refresh
              </Typography>
              <Typography variant="body" className="text-white">
                Pull down on mobile to refresh this content
              </Typography>
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="p-4">
                  <Typography variant="body" className="text-white">
                    Refreshable content item {index + 1}
                  </Typography>
                </Card>
              ))}
            </div>
          </PullToRefresh>

          <PinchZoom>
            <Card className="p-8 text-center">
              <Typography variant="h4" className="text-brutalist-yellow">
                Pinch to Zoom
              </Typography>
              <Typography variant="body" className="text-white">
                Use mouse wheel or pinch gestures to zoom this content
              </Typography>
              <div className="bg-brutalist-yellow mx-auto mt-4 h-32 w-32"></div>
            </Card>
          </PinchZoom>

          <div className="space-y-4">
            <Typography variant="h4" className="text-brutalist-yellow">
              Drag to Dismiss
            </Typography>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => {
                if (dismissedCards.includes(index)) return null;

                return (
                  <DragToDismiss
                    key={index}
                    onDismiss={() => handleCardDismiss(index)}
                    threshold={100}
                    direction="horizontal"
                  >
                    <Card className="p-4 text-center">
                      <Typography
                        variant="h4"
                        className="text-brutalist-yellow"
                      >
                        Card {index + 1}
                      </Typography>
                      <Typography variant="body" className="text-white">
                        Drag horizontally to dismiss
                      </Typography>
                    </Card>
                  </DragToDismiss>
                );
              })}
            </div>
          </div>

          <MultiTouchGesture
            onTap={() => console.log("Tap")}
            onDoubleTap={() => alert("Double Tap!")}
            onLongPress={() => alert("Long Press!")}
            onSwipe={(direction) => alert(`Swiped ${direction}!`)}
          >
            <Card className="p-8 text-center">
              <Typography variant="h4" className="text-brutalist-yellow">
                Multi-Touch Gesture
              </Typography>
              <Typography variant="body" className="text-white">
                Supports tap, double tap, long press, and swipe gestures
              </Typography>
            </Card>
          </MultiTouchGesture>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Container>
        <Section className="py-16">
          <StaggeredPageContent staggerDelay={0.1}>
            <div className="mb-16 text-center">
              <Typography
                variant="display"
                className="text-brutalist-yellow mb-4"
              >
                ANIMATION SYSTEMS
              </Typography>
              <Typography
                variant="large"
                className="mx-auto max-w-3xl text-white"
              >
                Comprehensive showcase of advanced animation and interaction
                systems with brutalist design aesthetics and performance
                optimization.
              </Typography>
            </div>

            {demoSections.map((section, index) => (
              <Section key={index} className="py-12">
                <EnhancedScrollReveal
                  direction="up"
                  delay={index * 0.1}
                  brutalistEffect
                >
                  <Typography
                    variant="h1"
                    className="text-brutalist-yellow mb-8 text-center"
                  >
                    {section.title}
                  </Typography>
                  {section.content}
                </EnhancedScrollReveal>
              </Section>
            ))}
          </StaggeredPageContent>
        </Section>
      </Container>

      <FloatingActionButton
        position="bottom-right"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </FloatingActionButton>
    </div>
  );
}
