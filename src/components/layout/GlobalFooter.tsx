import React from 'react';
import { Trash2, Compass, MessageSquare, Settings, Calculator, StickyNote } from 'lucide-react';
import { DockItem } from '@/components/DockItem'; // Assuming path based on description

interface AppConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  route?: string; // For actual navigation if needed, otherwise used as identifier
}

interface GlobalFooterProps {
  openApps?: string[]; // Array of app IDs that are currently "open"
  onDockItemClick: (appId: string) => void; // Callback when a dock item is clicked
  className?: string;
}

const mockApps: AppConfig[] = [
  { id: 'finder', name: 'Finder', icon: Compass, route: '/finder-window' },
  { id: 'messages', name: 'Messages', icon: MessageSquare, route: '/messages-app' }, // Assuming a hypothetical app
  { id: 'settings', name: 'System Settings', icon: Settings, route: '/system-settings' },
  { id: 'calculator', name: 'Calculator', icon: Calculator, route: '/calculator-app' },
  { id: 'texteditor', name: 'TextEdit', icon: StickyNote, route: '/text-editor-app' },
];

const GlobalFooter: React.FC<GlobalFooterProps> = ({
  openApps = [],
  onDockItemClick,
  className = ''
}) => {
  console.log('GlobalFooter loaded');

  return (
    <footer 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end justify-center space-x-2 p-2 bg-white/30 backdrop-blur-md shadow-2xl rounded-xl h-20 ${className} select-none z-40`}
      // Adding a min-width to prevent excessive shrinking if few items
      style={{ minWidth: '200px' }} 
    >
      {mockApps.map((app) => (
        <DockItem
          key={app.id}
          appName={app.name}
          IconComponent={app.icon}
          isRunning={openApps.includes(app.id)}
          onClick={() => onDockItemClick(app.id)}
          className="transform transition-transform duration-150 hover:scale-125 hover:-translate-y-2"
        />
      ))}
      <div className="w-px h-12 bg-gray-500/50 mx-2 self-center" /> {/* Separator */}
      <DockItem
        appName="Trash"
        IconComponent={Trash2}
        isRunning={false} // Trash is not typically "running"
        onClick={() => onDockItemClick('trash')} // Specific handler for trash
        className="transform transition-transform duration-150 hover:scale-125 hover:-translate-y-2"
      />
    </footer>
  );
};

export default GlobalFooter;