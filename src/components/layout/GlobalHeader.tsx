import React from 'react';
import { Apple, Wifi, BatteryFull, Search, Clock } from 'lucide-react';
import { MenuBarItem } from '@/components/MenuBarItem'; // Assuming path based on description
import { StatusMenuItem } from '@/components/StatusMenuItem'; // Assuming path based on description
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface GlobalHeaderProps {
  activeAppName?: string;
  appSpecificMenus?: React.ReactNode; // e.g., File, Edit, View for the current app
  onAppleMenuAction?: (action: string) => void;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  activeAppName = "Finder", // Default if no app is active or focused
  appSpecificMenus,
  onAppleMenuAction,
}) => {
  console.log('GlobalHeader loaded');
  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppleMenuClick = (action: string) => {
    if (onAppleMenuAction) {
      onAppleMenuAction(action);
    } else {
      console.log(`Apple Menu Action: ${action} (mock)`);
      // Potentially show a dialog or trigger a global state change
      alert(`Apple Menu: ${action} (Simulated)`);
    }
  };

  // Placeholder Apple Menu
  const appleMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-full px-2 rounded-none hover:bg-white/20">
          <Apple className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" sideOffset={5} align="start">
        <DropdownMenuItem onClick={() => handleAppleMenuClick('About This Mac')}>About This Mac</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAppleMenuClick('System Settings...')}>System Settings...</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAppleMenuClick('App Store...')}>App Store...</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAppleMenuClick('Recent Items')}>Recent Items</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAppleMenuClick('Force Quit...')}>Force Quit...</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAppleMenuClick('Sleep')}>Sleep</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAppleMenuClick('Restart...')}>Restart...</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAppleMenuClick('Shut Down...')}>Shut Down...</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAppleMenuClick('Lock Screen')}>Lock Screen</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAppleMenuClick('Log Out User...')}>Log Out User...</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  // Placeholder for app-specific menus if not provided
  const defaultAppMenus = (
    <>
      <MenuBarItem title="File">
        <DropdownMenuItem>New Window (Mock)</DropdownMenuItem>
        <DropdownMenuItem>Open (Mock)</DropdownMenuItem>
      </MenuBarItem>
      <MenuBarItem title="Edit">
        <DropdownMenuItem>Undo (Mock)</DropdownMenuItem>
        <DropdownMenuItem>Cut (Mock)</DropdownMenuItem>
      </MenuBarItem>
      <MenuBarItem title="View">
        <DropdownMenuItem>Show Toolbar (Mock)</DropdownMenuItem>
      </MenuBarItem>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 h-6 bg-black/30 backdrop-blur-md text-white flex items-center justify-between px-3 text-xs shadow-sm z-50 select-none">
      <div className="flex items-center h-full">
        {appleMenu}
        <span className="font-semibold ml-3 mr-3">{activeAppName}</span>
        <nav className="flex items-center h-full">
            {appSpecificMenus || defaultAppMenus}
        </nav>
      </div>

      <div className="flex items-center space-x-3 h-full">
        <StatusMenuItem icon={<Wifi className="h-4 w-4" />} tooltip="Wi-Fi: Connected (Mock)">
          <div>Mock Wi-Fi Status</div>
        </StatusMenuItem>
        <StatusMenuItem icon={<BatteryFull className="h-4 w-4" />} tooltip="Battery: 95% (Mock)">
          <div>Mock Battery Status</div>
        </StatusMenuItem>
        <StatusMenuItem icon={<Search className="h-4 w-4" />} tooltip="Spotlight Search (Mock)">
          <div>Mock Search Input</div>
        </StatusMenuItem>
        <div className="px-1 h-full flex items-center hover:bg-white/20 rounded transition-colors">
            <Clock className="h-3 w-3 mr-1" />
            {currentTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;