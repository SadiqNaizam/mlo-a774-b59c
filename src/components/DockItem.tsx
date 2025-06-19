import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DockItemProps {
  id: string; // Unique identifier for the app, e.g., "finder", "calculator"
  name: string; // Application name for tooltip and accessibility, e.g., "Finder"
  icon: React.ReactNode; // The icon element, e.g., <img /> or <SvgIcon />
  isRunning?: boolean; // Optional flag to show a running indicator dot
  onClick?: (id: string) => void; // Callback for click events (e.g., to launch or focus the app)
  href?: string; // Optional path for react-router-dom Link, for direct navigation
  className?: string; // Optional additional CSS classes for the root element
}

const DockItem: React.FC<DockItemProps> = ({
  id,
  name,
  icon,
  isRunning = false,
  onClick,
  href,
  className,
}) => {
  console.log(`DockItem loaded for app: ${name}, id: ${id}`);

  const handleItemClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(id);
    }
    // If this component is wrapped in a Link, navigation will also occur.
    // If it's a button, this click handler manages its primary action.
  };

  // Animation properties for hover effect
  const motionProps = {
    whileHover: { y: -12, scale: 1.45 }, // Magnification effect
    transition: { type: "spring", stiffness: 400, damping: 12 }
  };

  // The visual representation of the dock item (icon and running dot)
  const itemVisuals = (
    <motion.div
      className="relative p-1 flex flex-col items-center justify-center"
      {...motionProps} // Apply motion to the visual container for magnification
    >
      <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-150 group-hover:saturate-150">
        {icon}
      </div>
      {isRunning && (
        <div
          className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full shadow-sm border border-neutral-500/50 dark:border-neutral-400/50"
          aria-label="Running indicator"
          title={`${name} is running`}
        />
      )}
    </motion.div>
  );

  // Base classes for the interactive element (Link or button)
  const baseInteractiveClasses = "flex flex-col items-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg";
  const combinedClassName = `${baseInteractiveClasses} ${className || ''}`.trim();

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        {href ? (
          <Link
            to={href}
            onClick={handleItemClick}
            aria-label={`Open ${name}`}
            className={combinedClassName}
            data-testid={`dock-item-${id}`}
          >
            {itemVisuals}
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleItemClick}
            aria-label={`Open ${name}`}
            className={combinedClassName}
            data-testid={`dock-item-${id}`}
          >
            {itemVisuals}
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-neutral-800/90 dark:bg-neutral-900/90 text-white text-xs px-3 py-1.5 rounded-md shadow-xl backdrop-blur-sm border border-neutral-700/50"
      >
        <p className="font-medium">{name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default DockItem;