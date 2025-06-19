import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // For toast notifications

// Custom Components
import AppWindow from '@/components/AppWindow';
import GlobalHeader from '@/components/layout/GlobalHeader';
import MenuBarItem, { type MenuItemType } from '@/components/MenuBarItem'; // Ensure MenuItemType is exported or defined

// Shadcn/UI Components
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Lucide Icons
import {
  FilePlus, FolderOpen, Save, SaveAll, Printer, X, // File Menu
  Undo2, Redo2, Scissors, Copy, ClipboardPaste, CheckSquare, // Edit Menu
  Minimize2, ExternalLink, // Window Menu
  StickyNote // App Icon
} from 'lucide-react';

const TextEditorAppView = () => {
  console.log('TextEditorAppView loaded');
  const navigate = useNavigate();
  const [textValue, setTextValue] = useState(
    `Welcome to TextEditor (Mock)!\n\nThis is a simple demonstration of a text editor interface.\n\nFeatures:\n- Type and edit text.\n- Mock File/Edit menus.\n- Mock Save/Open actions.\n\nTry typing something or exploring the menus above.\n`
  );
  const [isSaved, setIsSaved] = useState(false);
  const [windowTitle, setWindowTitle] = useState("Untitled Document");

  const handleClose = () => {
    console.log('TextEditorAppView: Close action triggered.');
    // Potentially check for unsaved changes here
    navigate('/'); // Navigate to root (MainDesktopInterface) as per App.tsx
  };

  const handleMinimize = () => {
    console.log('TextEditorAppView: Minimize action triggered (mock).');
    toast.info("Window minimized (simulated)");
  };

  const handleMaximize = () => {
    console.log('TextEditorAppView: Maximize action triggered (mock).');
    toast.info("Window zoom toggled (simulated)");
  };
  
  const handleFocus = (id: string) => {
    console.log(`TextEditorAppView: Window ${id} focused (mock).`);
    // Logic to bring window to front if managing multiple windows would go here
  };

  const mockAction = (actionName: string, newTitle?: string) => {
    console.log(`Mock action: ${actionName}`);
    toast.success(actionName, { description: "Action simulated successfully." });
    if (actionName.toLowerCase().includes('save')) {
      setIsSaved(true);
      if(newTitle) setWindowTitle(newTitle);
      else if (windowTitle === "Untitled Document") setWindowTitle("My Document"); // Mock save changes title
      setTimeout(() => setIsSaved(false), 2500);
    }
    if (actionName.toLowerCase().includes('open')) {
        setTextValue("Opened mock_document.txt:\n\nThis document was 'opened' via a mock action.\nIt contains some placeholder text.");
        setWindowTitle("mock_document.txt");
    }
    if (actionName.toLowerCase().includes('new')) {
        setTextValue("New document created.\n\nStart typing here...");
        setWindowTitle("Untitled Document 2");
    }
  };

  const fileMenuItems: MenuItemType[] = [
    { label: 'New', onClick: () => mockAction('File > New', "Untitled Document 2"), shortcut: '⌘N', icon: <FilePlus size={16} /> },
    { label: 'Open...', onClick: () => mockAction('File > Open...'), shortcut: '⌘O', icon: <FolderOpen size={16} /> },
    { isSeparator: true },
    { label: 'Save', onClick: () => mockAction('File > Save'), shortcut: '⌘S', icon: <Save size={16} /> },
    { label: 'Save As...', onClick: () => mockAction('File > Save As...', "Saved As Document"), shortcut: '⇧⌘S', icon: <SaveAll size={16} /> },
    { isSeparator: true },
    { label: 'Print...', onClick: () => mockAction('File > Print...'), shortcut: '⌘P', icon: <Printer size={16} /> },
    { isSeparator: true },
    { label: 'Close Window', onClick: handleClose, shortcut: '⌘W', icon: <X size={16} /> },
  ];

  const editMenuItems: MenuItemType[] = [
    { label: 'Undo', onClick: () => mockAction('Edit > Undo'), shortcut: '⌘Z', icon: <Undo2 size={16} /> },
    { label: 'Redo', onClick: () => mockAction('Edit > Redo'), shortcut: '⇧⌘Z', icon: <Redo2 size={16} /> },
    { isSeparator: true },
    { label: 'Cut', onClick: () => mockAction('Edit > Cut'), shortcut: '⌘X', icon: <Scissors size={16} /> },
    { label: 'Copy', onClick: () => mockAction('Edit > Copy'), shortcut: '⌘C', icon: <Copy size={16} /> },
    { label: 'Paste', onClick: () => mockAction('Edit > Paste'), shortcut: '⌘V', icon: <ClipboardPaste size={16} /> },
    { isSeparator: true },
    { label: 'Select All', onClick: () => mockAction('Edit > Select All'), shortcut: '⌘A', icon: <CheckSquare size={16} /> },
  ];
  
  const formatMenuItems: MenuItemType[] = [ // Simple mock Format menu
    { label: 'Make Plain Text', onClick: () => mockAction('Format > Make Plain Text') },
    { label: 'Font', subItems: [
        { label: 'Show Fonts', onClick: () => mockAction('Format > Font > Show Fonts')},
        { label: 'Bold', onClick: () => mockAction('Format > Font > Bold'), shortcut: '⌘B'},
        { label: 'Italic', onClick: () => mockAction('Format > Font > Italic'), shortcut: '⌘I'},
    ]},
  ];

  const windowMenuItems: MenuItemType[] = [
    { label: 'Minimize', onClick: handleMinimize, shortcut: '⌘M', icon: <Minimize2 size={16}/> },
    { label: 'Zoom', onClick: handleMaximize, icon: <ExternalLink size={16}/> },
  ];

  const appSpecificMenus = (
    <>
      <MenuBarItem label="File" items={fileMenuItems} />
      <MenuBarItem label="Edit" items={editMenuItems} />
      <MenuBarItem label="Format" items={formatMenuItems} />
      <MenuBarItem label="Window" items={windowMenuItems} />
    </>
  );
  
  const appIcon = <StickyNote className="w-4 h-4" />;

  return (
    // This div acts as the container for the page content.
    // GlobalHeader is fixed at the top. AppWindow is absolutely positioned.
    <div className="relative w-full h-screen overflow-hidden bg-transparent">
      <GlobalHeader
        activeAppName="TextEditor"
        appSpecificMenus={appSpecificMenus}
      />
      
      <AppWindow
        id="textEditorApp"
        title={windowTitle}
        icon={appIcon}
        // initialPosition and initialSize will use AppWindow's defaults if not specified
        // Or, provide specific values:
        initialPosition={{ x: (window.innerWidth - 700) / 2 > 0 ? (window.innerWidth - 700) / 2 : 50, y: 60 }}
        initialSize={{ width: 700, height: 550 }}
        zIndex={40} // Below GlobalHeader menus (z-50)
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onFocus={handleFocus}
      >
        <div className="flex flex-col h-full bg-white dark:bg-neutral-900 text-black dark:text-white">
          {/* Toolbar Area */}
          <div className="p-1.5 border-b border-neutral-200 dark:border-neutral-700 flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 select-none shrink-0">
            <Button variant="ghost" size="sm" onClick={() => mockAction('Toolbar > Save')} className="flex items-center text-xs px-2 py-1 h-auto">
              <Save size={14} className="mr-1.5" /> Save
            </Button>
            <Button variant="ghost" size="sm" onClick={() => mockAction('Toolbar > Open...')} className="flex items-center text-xs px-2 py-1 h-auto">
              <FolderOpen size={14} className="mr-1.5" /> Open...
            </Button>
            {isSaved && <span className="text-xs text-green-600 dark:text-green-400 ml-auto mr-2 animate-pulse">Saved!</span>}
          </div>

          {/* Text Area */}
          <ScrollArea className="flex-1 p-0"> {/* Ensure ScrollArea itself doesn't add conflicting padding for textarea */}
            <Textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Start typing..."
              className="w-full h-full min-h-[calc(550px-80px)] p-4 text-sm md:text-base
                         resize-none border-none focus:ring-0 focus-visible:ring-0 
                         bg-white dark:bg-neutral-900 
                         text-black dark:text-white 
                         font-mono"
              style={{ lineHeight: '1.65' }} 
              aria-label="Text editor content"
            />
          </ScrollArea>
        </div>
      </AppWindow>
    </div>
  );
};

export default TextEditorAppView;