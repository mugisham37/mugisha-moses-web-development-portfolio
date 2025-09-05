"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingState {
  text: string;
  description?: string;
}

interface OnboardingLoaderProps {
  loading: boolean;
  onComplete: () => void;
  formData: {
    name: string;
    projectType: string;
    timeline: string;
    budget: string;
  };
}

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <motion.svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        delay: 0.1,
        type: "tween",
        ease: "easeOut",
        duration: 0.3,
      }}
    >
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </motion.svg>
  );
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
      {/* Progress indicator matching stepper design */}
      <div className="flex items-center space-x-4 mb-8">
        {loadingStates.map((_, index) => (
          <React.Fragment key={index}>
            <motion.div
              className={`flex h-8 w-8 items-center justify-center font-semibold border-2 transition-all duration-300 ${
                index <= value
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-400 border-gray-300"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index === value ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {index < value ? (
                <CheckIcon className="h-4 w-4 text-white" />
              ) : index === value ? (
                <motion.div
                  className="h-3 w-3 bg-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </motion.div>
            {index < loadingStates.length - 1 && (
              <div className="relative h-0.5 w-12 bg-gray-300 overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: index < value ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <h3 className="text-xl font-bold text-black">
            {loadingStates[value]?.text}
          </h3>
          {loadingStates[value]?.description && (
            <p className="text-gray-600 text-sm">
              {loadingStates[value].description}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Loading animation */}
      <motion.div
        className="flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-black rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default function OnboardingLoader({
  loading,
  onComplete,
  formData,
}: OnboardingLoaderProps) {
  const [currentState, setCurrentState] = useState(0);

  // Create personalized loading states based on form data
  const getProjectTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      website: "Website",
      "web-app": "Web Application",
      "mobile-app": "Mobile App",
      "e-commerce": "E-commerce Platform",
      portfolio: "Portfolio Site",
      other: "Custom Project",
    };
    return labels[type] || "Project";
  };

  const getTimelineLabel = (timeline: string) => {
    const labels: { [key: string]: string } = {
      asap: "ASAP",
      "1-2-months": "1-2 Month",
      "3-6-months": "3-6 Month",
      "just-exploring": "Exploratory",
    };
    return labels[timeline] || timeline;
  };

  const getBudgetLabel = (budget: string) => {
    const labels: { [key: string]: string } = {
      "under-5k": "Under $5K",
      "5k-15k": "$5K-$15K",
      "15k-30k": "$15K-$30K",
      "30k-50k": "$30K-$50K",
      "50k-plus": "$50K+",
      discuss: "Custom Budget",
    };
    return labels[budget] || budget;
  };

  const loadingStates: LoadingState[] = [
    {
      text: `Processing ${formData.name}'s Information`,
      description: "Reviewing your contact details and preferences",
    },
    {
      text: `Analyzing ${getProjectTypeLabel(
        formData.projectType
      )} Requirements`,
      description: "Understanding your project vision and scope",
    },
    {
      text: `Planning ${getTimelineLabel(formData.timeline)} Timeline`,
      description: "Organizing project milestones and deliverables",
    },
    {
      text: `Preparing ${getBudgetLabel(formData.budget)} Proposal`,
      description: "Creating a customized project proposal",
    },
    {
      text: "Finalizing Your Project Brief",
      description: "Almost ready to start your journey!",
    },
  ];

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }

    const timeout = setTimeout(() => {
      if (currentState < loadingStates.length - 1) {
        setCurrentState((prev) => prev + 1);
      } else {
        // Complete the loading after showing the final state
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, 500); // Very fast progression - 500ms per step

    return () => clearTimeout(timeout);
  }, [currentState, loading, loadingStates.length, onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center"
        >
          {/* Backdrop with blur matching modal design */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(8px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-black/20"
          />

          {/* Loader content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-white border border-gray-200 shadow-2xl p-12 max-w-lg w-full mx-4 min-h-[400px] flex items-center justify-center"
          >
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
