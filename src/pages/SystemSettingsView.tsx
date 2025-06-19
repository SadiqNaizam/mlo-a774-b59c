import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppWindow from '@/components/AppWindow';
import GlobalHeader from '@/components/layout/GlobalHeader';
import MenuBarItem, { MenuItemType } from '@/components/MenuBarItem'; // For appSpecificMenus
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"; // For appSpecificMenus

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Lucide Icons
import { Monitor, Volume2, Wifi, Palette, Info, Settings, Sun, Moon } from 'lucide-react';

const SystemSettingsView = () => {
  console.log('SystemSettingsView loaded');
  const navigate = useNavigate();

  // --- AppWindow Handlers ---
  const handleCloseWindow = () => {
    console.log('SystemSettingsView AppWindow closed by user');
    navigate('/'); // Navigate to main desktop (root route)
  };

  const handleMinimizeWindow = () => {
    console.log('SystemSettingsView AppWindow minimized (simulated)');
    // Actual implementation would involve global window state management
  };

  const handleFocusWindow = () => {
    console.log('SystemSettingsView AppWindow focused (simulated)');
    // Actual implementation would adjust zIndex
  };

  // --- Mock State for Settings ---
  const [brightness, setBrightness] = useState([50]);
  const [nightLight, setNightLight] = useState(false);
  const [outputVolume, setOutputVolume] = useState([75]);
  const [inputVolume, setInputVolume] = useState([60]);
  const [muteSound, setMuteSound] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Assuming this would affect AppWindow or global theme

  // --- Styling constants ---
  const settingItemClass = "flex items-center justify-between py-3 first:pt-0 last:pb-0 border-b dark:border-neutral-700 last:border-b-0";
  const settingLabelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";
  const settingControlClass = "flex items-center space-x-2";

  // --- App Specific Menus for GlobalHeader ---
  const appSpecificMenusForSettings: MenuItemType[] = [
    {
      label: "System Settings",
      subItems: [
        { label: "About System Settings", onClick: () => alert("About System Settings (Mock)") },
        { isSeparator: true },
        { label: "Preferences...", onClick: () => alert("Preferences... (Mock)"), shortcut: "⌘," },
        { isSeparator: true },
        { label: "Hide System Settings", onClick: () => alert("Hide System Settings (Mock)"), shortcut: "⌘H" },
        { label: "Hide Others", onClick: () => alert("Hide Others (Mock)"), shortcut: "⌥⌘H" },
        { label: "Show All", onClick: () => alert("Show All (Mock)") },
        { isSeparator: true },
        { label: "Quit System Settings", onClick: handleCloseWindow, shortcut: "⌘Q" },
      ],
    },
    {
      label: "Edit",
      subItems: [
        { label: "Undo", onClick: () => alert("Undo (Mock)"), shortcut: "⌘Z", disabled: true },
        { label: "Redo", onClick: () => alert("Redo (Mock)"), shortcut: "⇧⌘Z", disabled: true },
        { isSeparator: true },
        { label: "Cut", onClick: () => alert("Cut (Mock)"), shortcut: "⌘X", disabled: true },
        { label: "Copy", onClick: () => alert("Copy (Mock)"), shortcut: "⌘C", disabled: true },
        { label: "Paste", onClick: () => alert("Paste (Mock)"), shortcut: "⌘V", disabled: true },
        { label: "Select All", onClick: () => alert("Select All (Mock)"), shortcut: "⌘A", disabled: true },
      ],
    },
    {
      label: "View",
      subItems: [
        { label: "Customize Toolbar...", onClick: () => alert("Customize Toolbar... (Mock)"), disabled: true },
      ],
    },
    {
      label: "Window",
      subItems: [
        { label: "Minimize", onClick: handleMinimizeWindow, shortcut: "⌘M" },
        { label: "Zoom", onClick: () => alert("Zoom (Mock)"), disabled: true },
        { isSeparator: true },
        { label: "Bring All to Front", onClick: () => alert("Bring All to Front (Mock)") },
      ],
    },
    {
      label: "Help",
      subItems: [
        { label: "System Settings Help", onClick: () => alert("System Settings Help (Mock)") },
      ],
    },
  ];
  
  const renderedAppSpecificMenus = (
    <>
      {appSpecificMenusForSettings.map((menu, index) => (
        <MenuBarItem key={index} label={menu.label} items={menu.subItems || []} />
      ))}
    </>
  );


  // --- Settings Panel Content ---
  const settingsPanelContent = (
    <div className="p-1 sm:p-2 md:p-3"> {/* Padding for the content within AppWindow's scrollable area */}
      <Tabs defaultValue="display" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 mb-3 p-1 rounded-lg sticky top-0 z-10 bg-neutral-200/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <TabsTrigger value="display" className="flex items-center justify-center text-xs sm:text-sm space-x-1 sm:space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm py-1.5 sm:py-2">
            <Monitor size={16} /> <span>Display</span>
          </TabsTrigger>
          <TabsTrigger value="sound" className="flex items-center justify-center text-xs sm:text-sm space-x-1 sm:space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm py-1.5 sm:py-2">
            <Volume2 size={16} /> <span>Sound</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center justify-center text-xs sm:text-sm space-x-1 sm:space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm py-1.5 sm:py-2">
            <Wifi size={16} /> <span>Network</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center justify-center text-xs sm:text-sm space-x-1 sm:space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm py-1.5 sm:py-2">
            <Palette size={16} /> <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center justify-center text-xs sm:text-sm space-x-1 sm:space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm py-1.5 sm:py-2">
            <Info size={16} /> <span>General</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="display">
          <Card> {/* Shadcn Card handles its own bg/text colors */}
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Monitor size={18} className="mr-2" /> Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-4">
              <div className={settingItemClass}>
                <Label htmlFor="brightness" className={settingLabelClass}>Brightness</Label>
                <div className={settingControlClass + " w-1/2 md:w-2/5"}>
                   <Slider id="brightness" value={brightness} onValueChange={setBrightness} max={100} step={1} />
                   <span className="text-xs w-10 text-right tabular-nums">{brightness[0]}%</span>
                </div>
              </div>
              <div className={settingItemClass}>
                <Label htmlFor="resolution" className={settingLabelClass}>Resolution</Label>
                <Select defaultValue="1920x1080">
                  <SelectTrigger className="w-[160px] sm:w-[180px] text-xs sm:text-sm">
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1280x720">1280 x 720</SelectItem>
                    <SelectItem value="1920x1080">1920 x 1080</SelectItem>
                    <SelectItem value="2560x1440">2560 x 1440</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={settingItemClass}>
                <Label htmlFor="night-light" className={settingLabelClass}>Night Shift</Label>
                <Switch id="night-light" checked={nightLight} onCheckedChange={setNightLight} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sound">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Volume2 size={18} className="mr-2" /> Sound Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-4">
              <div className={settingItemClass}>
                <Label htmlFor="output-volume" className={settingLabelClass}>Output Volume</Label>
                 <div className={settingControlClass + " w-1/2 md:w-2/5"}>
                    <Slider id="output-volume" value={outputVolume} onValueChange={setOutputVolume} max={100} step={1} />
                    <span className="text-xs w-10 text-right tabular-nums">{outputVolume[0]}%</span>
                </div>
              </div>
              <div className={settingItemClass}>
                <Label htmlFor="input-volume" className={settingLabelClass}>Input Volume</Label>
                 <div className={settingControlClass + " w-1/2 md:w-2/5"}>
                    <Slider id="input-volume" value={inputVolume} onValueChange={setInputVolume} max={100} step={1} />
                    <span className="text-xs w-10 text-right tabular-nums">{inputVolume[0]}%</span>
                </div>
              </div>
              <div className={settingItemClass}>
                <Label htmlFor="mute-sound" className={settingLabelClass}>Mute All Sounds</Label>
                <Switch id="mute-sound" checked={muteSound} onCheckedChange={setMuteSound} />
              </div>
              <Accordion type="single" collapsible className="w-full pt-2">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-sm hover:no-underline">Advanced Sound Options</AccordionTrigger>
                  <AccordionContent className="pt-1 pb-2">
                    <p className="text-xs p-2 text-neutral-600 dark:text-neutral-400">
                      Mock placeholder for advanced sound settings (e.g., sound effects, balance).
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Wifi size={18} className="mr-2" /> Network Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-4">
              <div className={settingItemClass}>
                <Label htmlFor="wifi-enabled" className={settingLabelClass}>Wi-Fi</Label>
                <Switch id="wifi-enabled" checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
              </div>
              {wifiEnabled && (
                <Accordion type="single" collapsible className="w-full pt-2">
                  <AccordionItem value="known-networks">
                    <AccordionTrigger className="text-sm hover:no-underline">Known Networks</AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2">
                      <ul className="space-y-1 p-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <li>Home Wi-Fi (Connected)</li>
                        <li>OfficeNet_5G</li>
                        <li>GuestNetwork</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
               <div className={settingItemClass}>
                <Label htmlFor="vpn" className={settingLabelClass}>VPN</Label>
                <Select defaultValue="none">
                  <SelectTrigger className="w-[160px] sm:w-[180px] text-xs sm:text-sm">
                    <SelectValue placeholder="VPN Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not Connected</SelectItem>
                    <SelectItem value="work_vpn">Company VPN (Simulated)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Palette size={18} className="mr-2" /> Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-4">
              <div className={settingItemClass}>
                <Label htmlFor="dark-mode" className={settingLabelClass}>Appearance</Label>
                <div className={settingControlClass}>
                    <Sun className={`mr-1 h-4 w-4 ${!darkMode ? 'text-yellow-500' : 'text-neutral-500'}`} />
                    <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} />
                    <Moon className={`ml-1 h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-neutral-500'}`} />
                </div>
              </div>
               <div className={settingItemClass}>
                <Label htmlFor="accent-color" className={settingLabelClass}>Accent Color</Label>
                <Select defaultValue="blue">
                  <SelectTrigger className="w-[160px] sm:w-[180px] text-xs sm:text-sm">
                    <SelectValue placeholder="Accent color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={settingItemClass}>
                <Label htmlFor="sidebar-icon-size" className={settingLabelClass}>Sidebar Icon Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-[160px] sm:w-[180px] text-xs sm:text-sm">
                    <SelectValue placeholder="Icon size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-lg"><Info size={18} className="mr-2"/> General & About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4 text-sm">
                    <div className={settingItemClass}>
                        <p className={settingLabelClass}>OS Name:</p>
                        <p>mloMac OS Simulator</p>
                    </div>
                    <div className={settingItemClass}>
                        <p className={settingLabelClass}>Version:</p>
                        <p>1.0.0 (Pre-release)</p>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-2">
                        This is a simulated OS interface. Changes here are for demonstration only.
                    </p>
                    <Accordion type="single" collapsible className="w-full pt-2">
                        <AccordionItem value="updates">
                            <AccordionTrigger className="text-sm hover:no-underline">Software Update (Mock)</AccordionTrigger>
                            <AccordionContent className="pt-1 pb-2 text-xs">Your system is up to date. (Simulated)</AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="storage">
                            <AccordionTrigger className="text-sm hover:no-underline">Storage (Mock)</AccordionTrigger>
                            <AccordionContent className="pt-1 pb-2 text-xs">
                                <Label htmlFor="storage-bar" className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 block">Used: 72 GB of 256 GB (Simulated)</Label>
                                <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "28%" }}></div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    // This outer div ensures the page takes full screen and GlobalHeader is positioned correctly.
    // Background would typically be the desktop wallpaper from a higher-level component.
    <div className="w-screen h-screen overflow-hidden bg-transparent flex flex-col">
      <GlobalHeader 
        activeAppName="System Settings" 
        appSpecificMenus={renderedAppSpecificMenus} 
      />
      {/* main area below header, AppWindow will be positioned absolutely within this relative container */}
      <main className="flex-grow relative"> 
        <AppWindow
          id="systemSettings"
          title="System Settings"
          icon={<Settings size={14} className="text-neutral-600 dark:text-neutral-400"/>} // Icon for the AppWindow title bar
          initialPosition={{ x: "center", y: 70 }} // Centered horizontally, below header
          initialSize={{ width: 'clamp(450px, 60vw, 750px)', height: 'clamp(400px, 75vh, 650px)' }}
          zIndex={20} // Example zIndex, should be managed dynamically in a real desktop
          onClose={handleCloseWindow}
          onMinimize={handleMinimizeWindow}
          onMaximize={() => console.log("Maximize System Settings (Simulated)")}
          onFocus={handleFocusWindow}
        >
          {settingsPanelContent}
        </AppWindow>
      </main>
    </div>
  );
};

export default SystemSettingsView;