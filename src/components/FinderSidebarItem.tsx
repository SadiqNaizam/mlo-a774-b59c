import React from 'react';
import { type LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface FinderSidebarItemProps {
  /**
   * The icon component to display (e.g., from lucide-react).
   */
  icon: LucideIcon;
  /**
   * The text label for the sidebar item.
   */
  label: string;
  /**
   * Function to call when the item is clicked.
   */
  onClick: () => void;
  /**
   * Whether the item is currently active/selected.
   * @default false
   */
  isActive?: boolean;
  /**
   * Optional additional CSS classes.
   */
  className?: string;
}

const FinderSidebarItem: React.FC<FinderSidebarItemProps> = ({
  icon: IconComponent,
  label,
  onClick,
  isActive = false,
  className,
}) => {
  console.log(`FinderSidebarItem loaded: ${label}, isActive: ${isActive}`);

  const handleClick = () => {
    console.log(`FinderSidebarItem clicked: ${label}`);
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'flex items-center w-full px-3 py-1.5 text-sm rounded-md text-left focus:outline-none transition-colors duration-100 ease-in-out',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75', // Standard focus outline
        isActive
          ? 'bg-blue-500 text-white' // Active state: macOS-like selection blue
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700', // Inactive state with hover
        className
      )}
      aria-current={isActive ? 'page' : undefined}
      title={label} // Tooltip for truncated labels
    >
      <IconComponent 
        className={clsx(
          'mr-2.5 h-4 w-4 flex-shrink-0',
          isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400' // Icon color consistent with text or distinct
        )} 
        aria-hidden="true" 
      />
      <span className="truncate flex-grow">{label}</span>
    </button>
  );
};

export default FinderSidebarItem;