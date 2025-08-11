"use client";

import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { FormErrors } from "@/lib/form-validation";

interface FormErrorDisplayProps {
  errors: FormErrors;
  className?: string;
}

export function FormErrorDisplay({
  errors,
  className = "",
}: FormErrorDisplayProps) {
  const errorCount = Object.values(errors).reduce(
    (count, fieldErrors) => count + fieldErrors.length,
    0
  );

  if (errorCount === 0) return null;

  return (
    <Card className={`border-red-500 bg-red-900/20 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <Typography variant="h4" className="mb-2 text-red-400">
            FORM ERRORS ({errorCount})
          </Typography>

          <div className="space-y-2">
            {Object.entries(errors).map(([field, fieldErrors]) => (
              <div key={field}>
                <Typography
                  variant="caption"
                  className="font-bold text-red-300 uppercase"
                >
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  :
                </Typography>
                <ul className="ml-4 space-y-1">
                  {fieldErrors.map((error, index) => (
                    <li key={index}>
                      <Typography variant="caption" className="text-red-200">
                        • {error.message}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface FieldErrorProps {
  error?: string;
  className?: string;
}

export function FieldError({ error, className = "" }: FieldErrorProps) {
  if (!error) return null;

  return (
    <div className={`mt-1 flex items-center gap-2 ${className}`}>
      <svg
        className="h-4 w-4 flex-shrink-0 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <Typography variant="caption" className="text-red-400">
        {error}
      </Typography>
    </div>
  );
}

interface FormSuccessDisplayProps {
  message: string;
  className?: string;
}

export function FormSuccessDisplay({
  message,
  className = "",
}: FormSuccessDisplayProps) {
  return (
    <Card className={`border-green-500 bg-green-900/20 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <Typography variant="h4" className="mb-2 text-green-400">
            SUCCESS
          </Typography>
          <Typography variant="body" className="text-green-200">
            {message}
          </Typography>
        </div>
      </div>
    </Card>
  );
}

interface FormLoadingDisplayProps {
  message?: string;
  className?: string;
}

export function FormLoadingDisplay({
  message = "Processing your request...",
  className = "",
}: FormLoadingDisplayProps) {
  return (
    <Card className={`border-yellow-500 bg-yellow-900/20 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 animate-spin text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>

        <div className="flex-1">
          <Typography variant="h4" className="mb-2 text-yellow-400">
            PROCESSING
          </Typography>
          <Typography variant="body" className="text-yellow-200">
            {message}
          </Typography>
        </div>
      </div>
    </Card>
  );
}
