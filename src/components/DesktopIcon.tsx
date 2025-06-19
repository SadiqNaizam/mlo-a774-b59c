import React from 'react';
import clsx from 'clsx';

export interface DesktopIconProps {
  /** Unique identifier for the icon. */
  id: string;
  /** Text label displayed below the icon. */
  label: string;
  /**
   * The icon to display. Can be a React component (e.g., from lucide-react)
   * or a string URL to an image.
   */
  icon: React.ComponentType<{ className?: string; [key: string]: any; }> | string;
  /** The type of item the icon represents (e.g., file, folder, application). */
  type: 'file' | 'folder' | 'drive' | 'app' | 'link';
  /** Callback function triggered on double-click or Enter/Space key press. */
  onOpen: (id: string, type: DesktopIconProps['type'], targetPath?: string) => void;
  /** Optional target path or identifier associated with the icon (e.g., file path, URL). */
  targetPath?: string;
  /** Boolean indicating if the icon is currently selected. */
  isSelected: boolean;
  /** Callback function triggered on single click to select the icon. */
  onSelect: (id: string) => void;
  /** Optional additional CSS classes for the root element. */
  className?: string;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  label,
  icon,
  type,
  onOpen,
  targetPath,
  isSelected,
  onSelect,
  className,
}) => {
  console.log(`DesktopIcon loaded: ${label} (ID: ${id})`);

  const handleClick = (event: React.MouseEvent) => {
    // Stop propagation if the click is part of a double click sequence
    // This can be managed by more complex logic if needed, but for basic selection this is fine.
    if (event.detail === 1) { // event.detail counts clicks
        onSelect(id);
    }
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click handler from potentially interfering
    onOpen(id, type, targetPath);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(id, type, targetPath);
    }
  };

  const IconElement = typeof icon === 'string'
    ? <img src={icon} alt={`${label} icon`} className="w-12 h-12 mb-1 object-contain pointer-events-none" />
    : React.createElement(icon, { className: "w-12 h-12 mb-1 text-neutral-700 dark:text-neutral-300 pointer-events-none" });


  return (
    <div
      role="button"
      aria-selected={isSelected}
      aria-label={label}
      tabIndex={0}
      className={clsx(
        "flex flex-col items-center p-2 w-24 h-28 text-center cursor-default select-none rounded-md",
        "transition-colors duration-100 ease-in-out",
        isSelected ? "bg-blue-500/30 dark:bg-blue-400/40" : "hover:bg-black/10 dark:hover:bg-white/10",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/70 dark:focus:ring-blue-300/70",
        className
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      title={label} // Tooltip for mouse users
    >
      {IconElement}
      <span
        className={clsx(
          "text-xs text-neutral-900 dark:text-neutral-100 break-words line-clamp-2 leading-tight px-0.5",
          isSelected ? "bg-blue-600 !text-white dark:bg-blue-500 dark:!text-white rounded-sm" : ""
        )}
        // Using pointer-events-none here to ensure clicks always register on the parent div.
        // This simplifies click/double-click handling.
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </span>
    </div>
  );
};

export default DesktopIcon;