import React from 'react';
import { motion } from 'framer-motion';
// No specific lucide-react icons are used for traffic lights, using styled divs instead.
// No shadcn/ui components are directly used for the window frame itself.

interface AppWindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode; // e.g., an img tag or a Lucide icon component
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: string | number; height: string | number };
  zIndex: number;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize?: (id: string) => void; // Optional maximize functionality
  onFocus: (id: string) => void;
  // Resizing is not included in this version to keep complexity managed, focuses on description.
}

const AppWindow: React.FC<AppWindowProps> = ({
  id,
  title,
  icon,
  children,
  initialPosition = { x: 100, y: 100 }, // Default initial position
  initialSize = { width: '640px', height: '480px' }, // Default initial size
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}) => {
  console.log(`AppWindow '${title}' loaded with id: ${id}, zIndex: ${zIndex}`);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent window focus when clicking close
    onClose(id);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent window focus
    onMinimize(id);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent window focus
    if (onMaximize) {
      onMaximize(id);
    }
  };

  return (
    <motion.div
      drag
      dragHandle=".drag-handle" // Specifies that dragging is initiated by the title bar
      dragMomentum={false} // Disables momentum for a more OS-like feel
      initial={{ x: initialPosition.x, y: initialPosition.y }}
      style={{
        position: 'absolute',
        zIndex: zIndex,
        width: initialSize.width,
        height: initialSize.height,
      }}
      onMouseDown={() => onFocus(id)} // Bring to front on any mousedown on the window
      className="bg-neutral-200/70 dark:bg-neutral-800/70 backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden flex flex-col border border-neutral-400/30 dark:border-neutral-700/40"
      // animate={{ scale: 1 }} // Can be used for open/close animations later
      // exit={{ scale: 0.9, opacity: 0 }} // For animations
    >
      {/* Title Bar */}
      <div className="drag-handle h-8 bg-neutral-300/50 dark:bg-neutral-900/50 flex items-center px-3 select-none cursor-grab active:cursor-grabbing border-b border-neutral-400/30 dark:border-neutral-700/40 shrink-0">
        {/* Traffic Lights */}
        <div className="flex space-x-2 items-center">
          <button
            onClick={handleClose}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 active:bg-red-700 focus:outline-none transition-colors duration-150"
            aria-label="Close window"
          ></button>
          <button
            onClick={handleMinimize}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none transition-colors duration-150"
            aria-label="Minimize window"
          ></button>
          {onMaximize ? (
            <button
              onClick={handleMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 active:bg-green-700 focus:outline-none transition-colors duration-150"
              aria-label="Maximize window"
            ></button>
          ) : (
            <div
              className="w-3 h-3 bg-neutral-400 dark:bg-neutral-600 rounded-full opacity-50"
              title="Maximize disabled"
            ></div>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 text-center text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate px-2">
          {icon && <span className="mr-1.5 sm:mr-2 inline-block align-middle w-4 h-4">{icon}</span>}
          {title}
        </div>

        {/* Spacer to balance traffic lights for title centering */}
        {/* Approx width of 3 buttons (0.75rem * 3) + 2 spaces (0.5rem * 2) = 2.25rem + 1rem = 3.25rem = 52px */}
        <div className="w-[calc(0.75rem*3+0.5rem*2)] shrink-0"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-800">
        {/* The child component (e.g., FinderWindowView, TextEditorAppView) will be rendered here */}
        {children}
      </div>
    </motion.div>
  );
};

export default AppWindow;