"use client";

import { Button } from "@/components/ui/button";
import { StarIcon, StarOffIcon } from "lucide-react";
import { useState, useEffect, forwardRef } from "react";
import { toast } from "sonner";
import { toggleStarMarked } from "../actions";

export const MarkedToggleButton = forwardRef(
  ({ markedForRevision, id, onClick, className, children, ...props }, ref) => {
    const [isMarked, setIsMarked] = useState(markedForRevision);

    useEffect(() => {
      setIsMarked(markedForRevision);
    }, [markedForRevision]);

    const handleToggle = async (event) => {
      // Call parent onClick (DropdownMenuItem compatibility)
      onClick?.(event);

      const newMarkedState = !isMarked;
      setIsMarked(newMarkedState);

      try {
        const res = await toggleStarMarked(id, newMarkedState);
        const { success, error, isMarked } = res;

        if (isMarked && success && !error) {
          toast.success("Added to Favorites successfully");
        } else {
          toast.success("Removed from Favorites successfully");
        }
      } catch (error) {
        console.error("Failed to toggle mark for revision:", error);
        setIsMarked(!newMarkedState); // revert on failure
        toast.error("Something went wrong");
      }
    };

    return (
      <Button
        ref={ref}
        variant="ghost"
        className={`flex items-center justify-start w-full px-2 py-1.5 text-sm rounded-md cursor-pointer ${className || ""}`}
        onClick={handleToggle}
        {...props}
      >
        {isMarked ? (
          <StarIcon size={16} className="text-red-500 mr-2" />
        ) : (
          <StarOffIcon size={16} className="text-gray-500 mr-2" />
        )}
        {children || (isMarked ? "Remove Favorite" : "Add to Favorite")}
      </Button>
    );
  }
);

MarkedToggleButton.displayName = "MarkedToggleButton";
