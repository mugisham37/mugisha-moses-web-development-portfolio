import * as React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = "md", responsive = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          // Grid columns
          {
            "grid-cols-1": cols === 1,
            "grid-cols-2": cols === 2,
            "grid-cols-3": cols === 3,
            "grid-cols-4": cols === 4,
            "grid-cols-5": cols === 5,
            "grid-cols-6": cols === 6,
            "grid-cols-12": cols === 12,
          },
          // Responsive grid columns (if enabled)
          responsive && {
            "sm:grid-cols-2": cols >= 2,
            "md:grid-cols-3": cols >= 3,
            "lg:grid-cols-4": cols >= 4,
            "xl:grid-cols-5": cols >= 5,
            "2xl:grid-cols-6": cols >= 6,
          },
          // Gap spacing
          {
            "gap-0": gap === "none",
            "gap-2": gap === "sm",
            "gap-4": gap === "md",
            "gap-6": gap === "lg",
            "gap-8": gap === "xl",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, start, end, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Column span
          span && {
            "col-span-1": span === 1,
            "col-span-2": span === 2,
            "col-span-3": span === 3,
            "col-span-4": span === 4,
            "col-span-5": span === 5,
            "col-span-6": span === 6,
            "col-span-12": span === 12,
          },
          // Column start
          start && {
            "col-start-1": start === 1,
            "col-start-2": start === 2,
            "col-start-3": start === 3,
            "col-start-4": start === 4,
            "col-start-5": start === 5,
            "col-start-6": start === 6,
            "col-start-7": start === 7,
            "col-start-8": start === 8,
            "col-start-9": start === 9,
            "col-start-10": start === 10,
            "col-start-11": start === 11,
            "col-start-12": start === 12,
          },
          // Column end
          end && {
            "col-end-1": end === 1,
            "col-end-2": end === 2,
            "col-end-3": end === 3,
            "col-end-4": end === 4,
            "col-end-5": end === 5,
            "col-end-6": end === 6,
            "col-end-7": end === 7,
            "col-end-8": end === 8,
            "col-end-9": end === 9,
            "col-end-10": end === 10,
            "col-end-11": end === 11,
            "col-end-12": end === 12,
            "col-end-13": end === 13,
          },
          className
        )}
        {...props}
      />
    );
  }
);
GridItem.displayName = "GridItem";

export { Grid, GridItem };