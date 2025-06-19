import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Though not directly used for app launching, might be needed for other links
import { FileText, Folder, HardDrive, Terminal, Image as ImageIcon } from 'lucide-react';

// Custom Components
import GlobalHeader from '@/components/layout/GlobalHeader';
import GlobalFooter from '@/components/layout/GlobalFooter';
import DesktopIcon, { DesktopIconProps } from '@/components/DesktopIcon';
import AppWindow from '@/components/AppWindow';
import { MenuBarItem } from '@/components/MenuBarItem'; // Correct import for MenuBarItem used in GlobalHeader
import type { MenuItemType } from '@/components/MenuBarItem'; // Type for menu items

// Page Views to be used as AppWindow children
import CalculatorAppView from './CalculatorAppView';
import FinderWindowView from './FinderWindowView';
import SystemSettingsView from './SystemSettingsView';
import TextEditorAppView from './TextEditorAppView';
// Placeholder for a generic view or if a component is missing
const PlaceholderAppView: React.FC<{ appName: string }> = ({ appName }) => (
  <div className="p-4 flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
    <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">{appName}</h2>
    <p className="text-gray-500 dark:text-gray-400">This is a placeholder view for {appName}.</p>
    <ImageIcon size={48} className="mt-4 text-gray-400 dark:text-gray-500" />
  </div>
);


interface WindowState {
  id: string;
  appId: string;
  title: string;
  component: React.ReactNode;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: string | number; height: string | number };
  isMinimized?: boolean;
  icon?: React.ReactNode; // For AppWindow title bar
}

const appManifest: Record<string, { 
  component: React.FC<any>; 
  title: string; 
  defaultSize?: { width: string; height: string };
  icon?: React.ReactNode;
  menus?: (actions: AppMenuActions) => React.ReactNode;
}> = {
  finder: { 
    component: FinderWindowView, 
    title: "Finder",
    icon: <Compass size={16} className="inline-block text-blue-600 dark:text-blue-400" />,
    defaultSize: { width: '700px', height: '500px' },
    menus: (actions) => (
      <>
        <MenuBarItem label="File" items={[
          { label: "New Finder Window", onClick: () => actions.openApp('finder') },
          { label: "Open...", shortcut: "⌘O", onClick: () => console.log("Finder > Open (mock)")},
          { isSeparator: true },
          { label: "Close Window", shortcut: "⌘W", onClick: () => actions.closeApp(actions.activeWindowId || '') },
        ]} />
        <MenuBarItem label="Edit" items={[
          { label: "Cut", shortcut: "⌘X", onClick: () => console.log("Finder > Cut (mock)")},
          { label: "Copy", shortcut: "⌘C", onClick: () => console.log("Finder > Copy (mock)")},
          { label: "Paste", shortcut: "⌘V", onClick: () => console.log("Finder > Paste (mock)")},
        ]} />
        <MenuBarItem label="View" items={[{ label: "as Icons", onClick: () => console.log("Finder > View > as Icons") }]} />
        <MenuBarItem label="Go" items={[{ label: "Recents", onClick: () => console.log("Finder > Go > Recents") }]} />
      </>
    ),
  },
  calculator: { 
    component: CalculatorAppView, 
    title: "Calculator", 
    icon: <Calculator size={16} className="inline-block" />,
    defaultSize: { width: "280px", height: "420px" },
    menus: () => (
      <>
        <MenuBarItem label="File" items={[{ label: "Quit Calculator", onClick: () => console.log("Calc > Quit") }]} />
        <MenuBarItem label="Edit" items={[{ label: "Copy", onClick: () => console.log("Calc > Copy") }]} />
      </>
    ),
  },
  texteditor: { 
    component: TextEditorAppView, 
    title: "TextEdit",
    icon: <StickyNote size={16} className="inline-block" />,
    defaultSize: { width: '600px', height: '450px' },
    menus: (actions) => (
      <>
        <MenuBarItem label="File" items={[
          { label: "New", shortcut: "⌘N", onClick: () => actions.openApp('texteditor', 'Untitled') },
          { label: "Open...", shortcut: "⌘O", onClick: () => console.log("TextEdit > Open (mock)")},
          { isSeparator: true },
          { label: "Save", shortcut: "⌘S", onClick: () => console.log("TextEdit > Save (mock)")},
          { isSeparator: true },
          { label: "Close Window", shortcut: "⌘W", onClick: () => actions.closeApp(actions.activeWindowId || '') },
        ]} />
        <MenuBarItem label="Edit" items={[{ label: "Undo", shortcut: "⌘Z", onClick: () => console.log("TextEdit > Undo") }]} />
      </>
    ),
  },
  settings: { 
    component: SystemSettingsView, 
    title: "System Settings",
    icon: <Settings size={16} className="inline-block" />,
    defaultSize: { width: '750px', height: '550px' },
    menus: () => (
      <>
        <MenuBarItem label="File" items={[{ label: "Close Settings", onClick: () => console.log("Settings > Close") }]} />
      </>
    ),
  },
  messages: {
    component: () => <PlaceholderAppView appName="Messages" />,
    title: "Messages",
    icon: <MessageSquare size={16} className="inline-block" />,
    defaultSize: { width: '500px', height: '600px' },
    menus: () => (<MenuBarItem label="File" items={[{ label: "New Message" }]} />)
  },
  terminal: {
    component: () => <PlaceholderAppView appName="Terminal" />,
    title: "Terminal",
    icon: <Terminal size={16} className="inline-block" />,
    defaultSize: { width: '680px', height: '420px' },
    menus: () => (<MenuBarItem label="Shell" items={[{ label: "New Window" }]} />)
  }
};

// For components imported from lucide-react
const Compass = ({size, className}: {size?:number, className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
const Calculator = ({size, className}: {size?:number, className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="16" y1="10" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="8" y1="14" x2="8" y2="18"/><line x1="8" y1="10" x2="4" y2="10"/></svg>;
const StickyNote = ({size, className}: {size?:number, className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/></svg>;
const Settings = ({size, className}: {size?:number, className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 .43 1.25V12m0 0v1.18a2 2 0 0 1-.43 1.25l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15-.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-.43-1.25V12m0 0-3.46 3.46M12 12l3.46-3.46M12 12l3.46 3.46M12 12l-3.46-3.46M2 12h2M12 2v2M20 12h2M12 20v2"/><circle cx="12" cy="12" r="3"/></svg>;
const MessageSquare = ({size, className}: {size?:number, className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;


interface AppMenuActions {
  openApp: (appId: string, title?: string, ExplicitComponent?: React.FC<any>, pos?: {x:number, y:number}, size?: {width:string, height:string}) => void;
  closeApp: (windowId: string) => void;
  activeWindowId?: string;
}

const MainDesktopInterface: React.FC = () => {
  console.log('MainDesktopInterface loaded');
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState<number>(10);
  const [selectedDesktopIconId, setSelectedDesktopIconId] = useState<string | null>(null);
  
  const [activeAppName, setActiveAppName] = useState<string>("Finder");
  const [appSpecificMenus, setAppSpecificMenus] = useState<React.ReactNode>(null);

  const menuActions: AppMenuActions = {
    openApp: (appId, title, ExplicitComponent, pos, size) => handleOpenApp(appId, title, ExplicitComponent, pos, size),
    closeApp: (windowId) => handleCloseApp(windowId),
    activeWindowId: activeWindowId || undefined,
  };

  useEffect(() => {
    // Set initial menu for Finder or active app
    const activeWindow = openWindows.find(w => w.id === activeWindowId);
    const appKey = activeWindow ? activeWindow.appId : 'finder'; // Default to Finder if no window active
    const appData = appManifest[appKey];
    
    setActiveAppName(activeWindow ? activeWindow.title : "Finder");
    if (appData?.menus) {
      setAppSpecificMenus(appData.menus(menuActions));
    } else {
      // Default/fallback menus if specific app has no menu definition
      setAppSpecificMenus(
        <>
          <MenuBarItem label="File" items={[{ label: "No actions available" }]} />
        </>
      );
    }
  }, [activeWindowId, openWindows]);


  const handleOpenApp = useCallback((
    appId: string, 
    title?: string, 
    ExplicitComponent?: React.FC<any>,
    initialPos?: { x: number, y: number },
    initialSize?: { width: string | number, height: string | number }
  ) => {
    const appMeta = appManifest[appId];
    if (!appMeta && !ExplicitComponent) {
      console.warn(`No component configured for app ID: ${appId}`);
      return;
    }

    const ComponentToRender = ExplicitComponent || appMeta.component;
    const windowTitle = title || appMeta.title || "Untitled";
    const defaultSize = initialSize || appMeta.defaultSize || { width: '60vw', height: '50vh' };
    const appIcon = appMeta?.icon;

    const newWindowId = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newPosition = initialPos || { 
      x: 50 + (openWindows.length % 7) * 25, 
      y: 50 + (openWindows.length % 5) * 25 
    };

    const newWindow: WindowState = {
      id: newWindowId,
      appId: appId,
      title: windowTitle,
      component: <ComponentToRender />,
      zIndex: nextZIndex,
      position: newPosition,
      size: defaultSize,
      icon: appIcon,
    };

    setOpenWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
    handleFocusApp(newWindowId);
  }, [nextZIndex, openWindows]);

  const handleCloseApp = useCallback((windowId: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      // If closed window was active, try to focus another or default to Finder
      const remainingWindows = openWindows.filter(w => w.id !== windowId);
      if (remainingWindows.length > 0) {
        // Focus the top-most remaining window
        const topWindow = remainingWindows.sort((a,b) => b.zIndex - a.zIndex)[0];
        handleFocusApp(topWindow.id);
      } else {
        setActiveWindowId(null);
        setActiveAppName("Finder"); // Default to Finder when no windows are open
        const finderMeta = appManifest['finder'];
        if (finderMeta?.menus) setAppSpecificMenus(finderMeta.menus(menuActions));
      }
    }
  }, [activeWindowId, openWindows]);

  const handleFocusApp = useCallback((windowId: string) => {
    const windowToFocus = openWindows.find(w => w.id === windowId);
    if (!windowToFocus) return;

    setActiveWindowId(windowId);
    setActiveAppName(windowToFocus.title);
    const appMeta = appManifest[windowToFocus.appId];
    if (appMeta?.menus) {
      setAppSpecificMenus(appMeta.menus(menuActions));
    } else {
      setAppSpecificMenus(null); // Or some default
    }

    setOpenWindows(prev => 
      prev.map(w => 
        w.id === windowId 
          ? { ...w, zIndex: nextZIndex } 
          : w
      )
    );
    setNextZIndex(prev => prev + 1);
  }, [openWindows, nextZIndex]);

  const handleMinimizeApp = useCallback((windowId: string) => {
    // For now, just logs. Could hide window and show in Dock differently.
    console.log(`Minimize app: ${windowId} (mock)`);
    setOpenWindows(prev => prev.map(w => w.id === windowId ? {...w, isMinimized: true} : w));
     // Potentially remove from active display but keep in `openWindows` state
  }, []);

  const handleSelectDesktopIcon = useCallback((iconId: string) => {
    setSelectedDesktopIconId(iconId);
  }, []);

  const handleOpenDesktopIcon = useCallback((iconId: string, type: DesktopIconProps['type'], targetPath?: string) => {
    console.log(`Open desktop icon: ${iconId}, type: ${type}, target: ${targetPath}`);
    if (targetPath && appManifest[targetPath]) {
      const appMeta = appManifest[targetPath];
      // Pass the desktop icon label as the window title if it's a file
      const windowTitle = type === 'file' ? desktopIcons.find(icon => icon.id === iconId)?.label : appMeta.title;
      handleOpenApp(targetPath, windowTitle);
    } else {
      // Fallback for generic folders or unlinked items: open Finder
      handleOpenApp('finder', `Finder: ${desktopIcons.find(icon => icon.id === iconId)?.label || 'Folder'}`);
    }
  }, [handleOpenApp]);

  const desktopIcons: DesktopIconProps[] = [
    { 
      id: 'notes-txt', label: 'Project Plan.txt', 
      icon: FileText, type: 'file', targetPath: 'texteditor', 
      isSelected: selectedDesktopIconId === 'notes-txt', 
      onSelect: handleSelectDesktopIcon, onOpen: handleOpenDesktopIcon 
    },
    { 
      id: 'mac-hd', label: 'Macintosh HD', 
      icon: HardDrive, type: 'drive', targetPath: 'finder', 
      isSelected: selectedDesktopIconId === 'mac-hd', 
      onSelect: handleSelectDesktopIcon, onOpen: handleOpenDesktopIcon 
    },
    { 
      id: 'apps-folder', label: 'Applications', 
      icon: Folder, type: 'folder', targetPath: 'finder', 
      isSelected: selectedDesktopIconId === 'apps-folder', 
      onSelect: handleSelectDesktopIcon, onOpen: handleOpenDesktopIcon 
    },
     { 
      id: 'terminal-app', label: 'Terminal', 
      icon: Terminal, type: 'app', targetPath: 'terminal', 
      isSelected: selectedDesktopIconId === 'terminal-app', 
      onSelect: handleSelectDesktopIcon, onOpen: handleOpenDesktopIcon 
    },
  ];
  
  const handleAppleMenuAction = (action: string) => {
    console.log(`Apple Menu Action: ${action}`);
    if (action === 'System Settings...') {
      handleOpenApp('settings');
    } else if (action === 'About This Mac') {
        handleOpenApp('about-this-mac', 'About This Mac', () => <PlaceholderAppView appName="About This Mac" />, undefined, {width: '500px', height: '300px'});
    } else {
      alert(`Apple Menu: ${action} (Simulated)`);
    }
  };

  return (
    <div 
      className="fixed inset-0 h-screen w-screen overflow-hidden bg-cover bg-center select-none"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1536566482680-fca31930a0bd?auto=format&fit=crop&w=1920&q=80')` }}
      onClick={() => setSelectedDesktopIconId(null)} // Deselect desktop icons on wallpaper click
    >
      <GlobalHeader 
        activeAppName={activeAppName}
        appSpecificMenus={appSpecificMenus}
        onAppleMenuAction={handleAppleMenuAction}
      />

      {/* Desktop Icons Area */}
      <main className="absolute top-6 left-0 right-0 bottom-20 p-4 flex flex-col flex-wrap content-start gap-1"
        onClick={(e) => e.stopPropagation()} // Prevent wallpaper click from deselecting when clicking within desktop area but not on an icon
      >
        {desktopIcons.map((iconProps) => (
          <DesktopIcon key={iconProps.id} {...iconProps} />
        ))}
      </main>

      {/* Application Windows Area */}
      <div className="absolute inset-0 pointer-events-none">
        {openWindows.filter(w => !w.isMinimized).map((win) => (
          <div key={win.id} className="pointer-events-auto"> {/* Wrapper to re-enable pointer events */}
            <AppWindow
              id={win.id}
              title={win.title}
              icon={win.icon}
              zIndex={win.zIndex}
              initialPosition={win.position}
              initialSize={win.size}
              onClose={handleCloseApp}
              onMinimize={handleMinimizeApp} // Implement actual minimize logic if needed
              onFocus={handleFocusApp}
            >
              {win.component}
            </AppWindow>
          </div>
        ))}
      </div>
      
      <GlobalFooter
        openApps={openWindows.filter(w => !w.isMinimized).map(w => w.appId)} // Show running dot for non-minimized apps
        onDockItemClick={(appId) => {
            // If app is already open and not minimized, focus its topmost instance
            // Otherwise, open a new instance
            const runningInstances = openWindows.filter(w => w.appId === appId && !w.isMinimized);
            if (runningInstances.length > 0) {
                const topInstance = runningInstances.sort((a,b) => b.zIndex - a.zIndex)[0];
                handleFocusApp(topInstance.id);
            } else {
                handleOpenApp(appId);
            }
        }}
      />
    </div>
  );
};

export default MainDesktopInterface;