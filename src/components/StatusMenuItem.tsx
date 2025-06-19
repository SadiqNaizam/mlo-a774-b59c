import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface StatusMenuItemProps {
  /** Content displayed in the menu bar, e.g., an icon from lucide-react or text like time. */
  triggerContent: React.ReactNode;
  /** Accessibility label for the trigger button, crucial for icon-only triggers. */
  label: string;
  /** Optional ReactNode to display in a popover when the item is clicked. */
  popoverContent?: React.ReactNode;
  /** Optional click handler if no popoverContent is provided. Used for direct actions. */
  onTriggerClick?: () => void;
  /** Additional CSS classes for styling the trigger button. */
  className?: string;
  /** Additional CSS classes for styling the PopoverContent container. */
  popoverContentClassName?: string;
}

/**
 * StatusMenuItem is a component for individual status icons/indicators
 * on the right side of a TopMenuBar (e.g., mock Wi-Fi, Battery, Spotlight icon, Clock).
 * It displays triggerContent (e.g. an icon or text) and, on click, can open a
 * ShadCN Popover displaying more information or controls.
 * If popoverContent is not provided, onTriggerClick can be used for direct actions.
 */
const StatusMenuItem: React.FC<StatusMenuItemProps> = ({
  triggerContent,
  label,
  popoverContent,
  onTriggerClick,
  className = '',
  popoverContentClassName = '',
}) => {
  console.log(`StatusMenuItem loaded for: ${label}`);

  const triggerElement = (
    <Button
      variant="ghost" // Using ghost variant for a less obtrusive, menu-item like appearance
      aria-label={label}
      onClick={!popoverContent ? onTriggerClick : undefined} // Click is handled by PopoverTrigger if popoverContent exists
      // Base styling inspired by macOS menu bar items:
      // - Fixed height (approx 22-24px)
      // - Minimal horizontal padding
      // - Subtle hover/active/open states
      // - Small corner radius
      className={`
        h-[24px] px-1.5 text-sm
        flex items-center justify-center 
        rounded-[4px] border border-transparent /* Slightly rounded corners */
        hover:bg-black/10 dark:hover:bg-white/10 
        active:bg-black/15 dark:active:bg-white/15
        data-[state=open]:bg-black/15 dark:data-[state=open]:bg-white/15 /* Popover open state */
        focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500
        select-none /* Prevent text selection for text-based triggers */
        whitespace-nowrap /* Prevent text wrapping for triggers like time */
        ${className}
      `}
    >
      {triggerContent}
    </Button>
  );

  if (popoverContent) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          {triggerElement}
        </PopoverTrigger>
        <PopoverContent
          side="bottom" // Popover appears below the trigger
          align="end"   // Aligns to the right edge of the trigger (common for status items)
          sideOffset={6} // Small gap between trigger and popover
          alignOffset={-4} // Fine-tune alignment if needed, moves popover slightly left from perfect end alignment
          className={`
            w-auto min-w-[200px] p-0 /* Reset default padding, content should manage its own */
            shadow-2xl rounded-lg 
            bg-neutral-50/80 dark:bg-neutral-900/80 /* Translucent background */
            backdrop-blur-xl /* Frosted glass effect */
            border border-neutral-300/50 dark:border-neutral-700/50 /* Subtle border */
            text-neutral-900 dark:text-neutral-100
            overflow-hidden /* Ensures content respects rounded corners of popover */
            focus:outline-none /* Remove focus ring from popover content itself */
            ${popoverContentClassName}
          `}
        >
          {popoverContent}
        </PopoverContent>
      </Popover>
    );
  }

  return triggerElement; // If no popoverContent, return the button itself for direct click action
};

export default StatusMenuItem;