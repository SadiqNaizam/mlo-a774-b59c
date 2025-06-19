import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Components
import AppWindow from '@/components/AppWindow';
import GlobalHeader from '@/components/layout/GlobalHeader';
import FinderFileListItem from '@/components/FinderFileListItem';
import FinderSidebarItem from '@/components/FinderSidebarItem';
import { MenuItemType } from '@/components/MenuBarItem'; // Assuming MenuBarItem exports this

// Shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Lucide Icons
import {
  Compass as FinderAppIcon,
  Folder as FolderIcon,
  FileText as FileIcon,
  Home as HomeIcon,
  Download as DownloadsIcon,
  Zap as ApplicationsIcon,
  Clock as RecentsIcon,
  ArrowLeft,
  ArrowRight,
  Search as SearchIcon,
  Star,
  Settings,
  Trash2,
  HardDrive,
  Users,
  ImageIcon,
  Music2Icon,
  VideoIcon,
  CloudIcon,
  ListTree,
} from 'lucide-react';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  dateModified: string;
  size: string;
  icon?: React.ElementType;
  children?: FileSystemItem[];
  filePath?: string; // For opening apps/files via routing
  mimeType?: string; // e.g. 'image/jpeg'
}

const mockFileSystem: FileSystemItem = {
  id: 'root',
  name: 'Macintosh HD',
  type: 'folder',
  icon: HardDrive,
  dateModified: 'N/A',
  size: 'N/A',
  children: [
    {
      id: 'desktop', name: 'Desktop', type: 'folder', icon: HomeIcon, dateModified: 'Today, 10:00 AM', size: '2 items', children: [
        { id: 'desktop-img', name: 'photo.jpg', type: 'file', icon: ImageIcon, dateModified: 'Yesterday, 3:45 PM', size: '2.1 MB', mimeType: 'image/jpeg' },
        { id: 'desktop-txt', name: 'notes.txt', type: 'file', icon: FileIcon, dateModified: 'Today, 9:15 AM', size: '12 KB', filePath: '/text-editor-app?file=notes.txt' },
      ],
    },
    {
      id: 'documents', name: 'Documents', type: 'folder', icon: Users, dateModified: 'Today, 11:20 AM', size: '3 items', children: [
        { id: 'doc-report', name: 'AnnualReport.pdf', type: 'file', icon: FileIcon, dateModified: 'Last week', size: '5.6 MB' },
        { id: 'doc-folder-work', name: 'Work Projects', type: 'folder', icon: FolderIcon, dateModified: 'Today, 11:00 AM', size: '1 item', children: [
            { id: 'work-project-alpha', name: 'ProjectAlpha.docx', type: 'file', icon: FileIcon, dateModified: 'Today, 10:30 AM', size: '1.2 MB' },
        ]},
        { id: 'doc-recipes', name: 'Recipes.txt', type: 'file', icon: FileIcon, dateModified: 'Yesterday, 8:00 PM', size: '3 KB', filePath: '/text-editor-app?file=recipes.txt' },
      ],
    },
    {
      id: 'downloads', name: 'Downloads', type: 'folder', icon: DownloadsIcon, dateModified: 'Today, 1:00 PM', size: '1 item', children: [
        { id: 'dl-app', name: 'CoolApp.dmg', type: 'file', icon: FileIcon, dateModified: 'Today, 12:55 PM', size: '120 MB' },
      ],
    },
    {
      id: 'applications', name: 'Applications', type: 'folder', icon: ApplicationsIcon, dateModified: 'Two days ago', size: '2 items', children: [
        { id: 'app-calc', name: 'Calculator', type: 'file', icon: FileIcon, dateModified: 'A month ago', size: '800 KB', filePath: '/calculator-app' },
        { id: 'app-textedit', name: 'TextEdit', type: 'file', icon: FileIcon, dateModified: 'A month ago', size: '1.1 MB', filePath: '/text-editor-app' },
      ],
    },
    { id: 'pictures', name: 'Pictures', type: 'folder', icon: ImageIcon, dateModified: 'Yesterday', size: '10 items', children: [] },
    { id: 'music', name: 'Music', type: 'folder', icon: Music2Icon, dateModified: 'Three days ago', size: '50 items', children: [] },
    { id: 'movies', name: 'Movies', type: 'folder', icon: VideoIcon, dateModified: 'Last month', size: '5 items', children: [] },
    { id: 'icloud', name: 'iCloud Drive', type: 'folder', icon: CloudIcon, dateModified: 'Today', size: 'Syncing...', children: [] },
  ],
};

const sidebarNavigationItems = [
  { id: 'recents', name: 'Recents', path: '/Recents', icon: RecentsIcon, specialView: true }, // Special handling for recents
  { id: 'desktop', name: 'Desktop', path: '/Desktop', icon: HomeIcon },
  { id: 'documents', name: 'Documents', path: '/Documents', icon: Users },
  { id: 'downloads', name: 'Downloads', path: '/Downloads', icon: DownloadsIcon },
  { id: 'applications', name: 'Applications', path: '/Applications', icon: ApplicationsIcon },
  { id: 'pictures', name: 'Pictures', path: '/Pictures', icon: ImageIcon },
  { id: 'music', name: 'Music', path: '/Music', icon: Music2Icon },
  { id: 'movies', name: 'Movies', path: '/Movies', icon: VideoIcon },
  { id: 'icloud', name: 'iCloud Drive', path: '/iCloud Drive', icon: CloudIcon },
  { id: 'settingspath', name: 'System Settings', path: '/system-settings', icon: Settings, isExternalRoute: true},
  { id: 'trash', name: 'Trash', path: '/Trash', icon: Trash2, specialView: true },
];

const pinnedMockItems: FileSystemItem[] = [
    mockFileSystem.children![0], // Desktop
    mockFileSystem.children![1].children![1], // Work Projects Folder
    mockFileSystem.children![3].children![0] // Calculator App
];


const getItemFromPath = (path: string, fs: FileSystemItem): FileSystemItem | null => {
  if (path === '/') return fs;
  const parts = path.split('/').filter(Boolean);
  let current: FileSystemItem | undefined = fs;
  for (const part of parts) {
    current = current?.children?.find(child => child.name === part);
    if (!current) return null;
  }
  return current || null;
};

const FinderWindowView: React.FC = () => {
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState<string>('/Desktop');
  const [history, setHistory] = useState<string[]>(['/Desktop']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    console.log('FinderWindowView loaded or path changed:', currentPath);
  }, [currentPath]);

  const currentDirectoryItems = useMemo(() => {
    const dir = getItemFromPath(currentPath, mockFileSystem);
    return dir?.children || [];
  }, [currentPath]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return currentDirectoryItems;
    return currentDirectoryItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentDirectoryItems, searchTerm]);

  const navigateToPath = useCallback((newPath: string, isNavAction = false) => {
    const targetItem = getItemFromPath(newPath, mockFileSystem);
    if (targetItem && targetItem.type === 'folder') {
        setCurrentPath(newPath);
        setSelectedItemId(null);
        if (!isNavAction) { // Only update history if not from back/forward
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newPath);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    } else if (targetItem && targetItem.type === 'file' && targetItem.filePath) {
        // This is opening a file/app
        console.log(`Navigating to external route: ${targetItem.filePath}`);
        navigate(targetItem.filePath);
    } else {
        console.warn(`Path not found or not a folder: ${newPath}`);
    }
  }, [history, historyIndex, navigate]);

  const handleSidebarItemClick = (path: string, isExternalRoute?: boolean, specialView?: boolean) => {
    if (isExternalRoute && path) {
        navigate(path);
        return;
    }
    if (specialView) {
        // Handle special views like Recents or Trash if implemented
        console.log(`Accessing special view: ${path}`);
        // For now, just treat as regular path or clear items
        setCurrentPath(path); // Or set to a state indicating special view
        return;
    }
    navigateToPath(path);
  };
  
  const handleTableItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      navigateToPath(`${currentPath === '/' ? '' : currentPath}/${item.name}`);
    } else if (item.filePath) {
      console.log(`Opening file/app: ${item.name} via path: ${item.filePath}`);
      navigate(item.filePath);
    } else {
      console.log(`Double-clicked file: ${item.name} (no action defined)`);
    }
  };

  const handlePinnedItemOpen = (item: FileSystemItem) => {
    if (item.type === 'folder') {
        const findPath = (root: FileSystemItem, targetId: string, currentP = ""): string | null => {
            if (root.id === targetId) return currentP + "/" + root.name;
            if (!root.children) return null;
            for (const child of root.children) {
                const childPath = currentP + (currentP === "/" ? "" : "/") + root.name;
                if (child.id === targetId) return (childPath === "/" ? "" : childPath) + "/" + child.name;
                if (child.type === 'folder') {
                    const found = findPath(child, targetId, (childPath === "/" ? "" : childPath));
                    if (found) return found;
                }
            }
            return null;
        };
        // Attempt to find the full path of the pinned folder to navigate to it
        // This is simplified; a real system would store full paths or more robust references.
        // For root items, need special handling for path.
        let itemPath = item.name; // Default for root items
        if (mockFileSystem.children?.some(c => c.id === item.id)) {
            itemPath = `/${item.name}`;
        } else {
            // This simple search won't work well for deeply nested items without full paths stored.
            // For demo, assume pinned items are top-level or we navigate to their defined filePath if it's an app.
             console.warn("Cannot determine full path for deeply nested pinned folder:", item.name);
        }
        navigateToPath(itemPath);

    } else if (item.filePath) {
      navigate(item.filePath);
    }
  };


  const breadcrumbParts = useMemo(() => {
    const parts = currentPath.split('/').filter(Boolean);
    return [{ name: mockFileSystem.name, path: '/' }, ...parts.map((part, index, arr) => {
      const path = '/' + arr.slice(0, index + 1).join('/');
      return { name: part, path };
    })];
  }, [currentPath]);

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      navigateToPath(history[newIndex], true);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      navigateToPath(history[newIndex], true);
    }
  };
  
  const finderAppMenus: MenuItemType[] = [
    { label: 'File', subItems: [
      { label: 'New Finder Window', onClick: () => console.log("New Finder Window (mock)") , shortcut: "⌘N"},
      { label: 'New Folder', onClick: () => console.log("New Folder (mock)"), shortcut: "⇧⌘N" },
      { label: 'Get Info', onClick: () => console.log("Get Info (mock)"), shortcut: "⌘I", disabled: !selectedItemId },
      { isSeparator: true },
      { label: 'Close Window', onClick: () => navigate('/'), shortcut: "⌘W" },
    ]},
    { label: 'Edit', subItems: [
      { label: 'Undo', onClick: () => console.log("Undo (mock)"), shortcut: "⌘Z" },
      { label: 'Redo', onClick: () => console.log("Redo (mock)"), shortcut: "⇧⌘Z" },
      { isSeparator: true },
      { label: 'Cut', onClick: () => console.log("Cut (mock)"), shortcut: "⌘X", disabled: !selectedItemId },
      { label: 'Copy', onClick: () => console.log("Copy (mock)"), shortcut: "⌘C", disabled: !selectedItemId },
      { label: 'Paste', onClick: () => console.log("Paste (mock)"), shortcut: "⌘V" },
    ]},
    { label: 'View', subItems: [
        { label: 'as Icons', onClick: () => console.log("View as Icons (mock)") },
        { label: 'as List', onClick: () => console.log("View as List (mock)") },
        { label: 'as Columns', onClick: () => console.log("View as Columns (mock)") },
    ]},
    { label: 'Go', subItems: [
        { label: 'Back', onClick: handleGoBack, shortcut: "⌘[", disabled: historyIndex === 0 },
        { label: 'Forward', onClick: handleGoForward, shortcut: "⌘]", disabled: historyIndex === history.length - 1 },
        { isSeparator: true },
        ...sidebarNavigationItems.filter(i => !i.specialView && !i.isExternalRoute).map(item => ({ label: item.name, onClick: () => navigateToPath(item.path) }))
    ]},
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-transparent overflow-hidden">
      {/* GlobalHeader is rendered here as per instructions, though typically it's one level up in a macOS sim */}
      <GlobalHeader activeAppName="Finder" appSpecificMenus={finderAppMenus} />

      <div className="flex-grow relative p-4 md:p-8"> {/* Padding to not have AppWindow flush against edges */}
        <AppWindow
          id="finder-main-window"
          title="Finder"
          icon={<FinderAppIcon size={16} className="text-blue-500" />}
          initialPosition={{ x: 50, y: 20 }} // Y adjusted for GlobalHeader
          initialSize={{ width: 'calc(100vw - 100px)', height: 'calc(100vh - 120px)' }} // Adjusted for padding and GlobalHeader
          zIndex={20} // Example zIndex
          onClose={() => navigate('/')} // Navigate to main desktop on close
          onMinimize={() => console.log('Finder minimize action')}
          onMaximize={() => console.log('Finder maximize action')}
          onFocus={() => console.log('Finder focus action')}
        >
          {/* Actual Finder UI within the AppWindow */}
          <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-800">
            {/* Toolbar */}
            <div className="flex items-center p-2 border-b border-neutral-200 dark:border-neutral-700 space-x-2 select-none">
              <Button variant="ghost" size="sm" onClick={handleGoBack} disabled={historyIndex === 0}>
                <ArrowLeft size={18} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleGoForward} disabled={historyIndex >= history.length - 1}>
                <ArrowRight size={18} />
              </Button>
              <div className="flex-grow">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbParts.map((part, index) => (
                      <React.Fragment key={part.path}>
                        <BreadcrumbItem>
                          {index === breadcrumbParts.length - 1 ? (
                            <BreadcrumbPage className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{part.name}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); navigateToPath(part.path);}} className="text-sm">
                              {part.name}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbParts.length - 1 && <BreadcrumbSeparator />}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="w-48">
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 text-sm"
                  icon={<SearchIcon size={14} className="text-neutral-400" />}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <ScrollArea className="w-56 bg-neutral-200/60 dark:bg-neutral-900/50 p-2 border-r border-neutral-200 dark:border-neutral-700">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 px-2 mt-1 mb-1 uppercase">Favorites</p>
                  {sidebarNavigationItems.map((item) => (
                    <FinderSidebarItem
                      key={item.id}
                      label={item.name}
                      icon={item.icon}
                      isActive={!item.specialView && !item.isExternalRoute && currentPath.startsWith(item.path)}
                      onClick={() => handleSidebarItemClick(item.path, item.isExternalRoute, item.specialView)}
                    />
                  ))}
                </div>
              </ScrollArea>

              {/* Content Pane */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Pinned Items using FinderFileListItem */}
                 <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 uppercase">Pinned Items</h3>
                    {pinnedMockItems.length > 0 ? (
                        <ScrollArea orientation="horizontal" className="whitespace-nowrap">
                             <div className="flex space-x-3 pb-2">
                                {pinnedMockItems.map(item => (
                                <div key={`pinned-${item.id}`} className="w-60 flex-shrink-0">
                                    <FinderFileListItem
                                    id={item.id}
                                    name={item.name}
                                    type={item.type}
                                    dateModified={item.dateModified}
                                    size={item.size}
                                    isSelected={selectedItemId === item.id && currentPath === "pinned"} // Simplified selection context
                                    onSelect={() => {setSelectedItemId(item.id); setCurrentPath("pinned");}} // Simplified
                                    onOpen={() => handlePinnedItemOpen(item)}
                                    />
                                </div>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                         <p className="text-sm text-neutral-400">No pinned items.</p>
                    )}
                </div>
                
                {/* File/Folder Table List */}
                <ScrollArea className="flex-1 p-1">
                  <Table>
                    <TableHeader className="sticky top-0 bg-neutral-100 dark:bg-neutral-800 z-10">
                      <TableRow>
                        <TableHead className="w-10"></TableHead> {/* Icon */}
                        <TableHead>Name</TableHead>
                        <TableHead>Date Modified</TableHead>
                        <TableHead className="text-right">Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length > 0 ? filteredItems.map((item) => {
                        const ItemIcon = item.icon || (item.type === 'folder' ? FolderIcon : FileIcon);
                        return (
                          <TableRow
                            key={item.id}
                            onClick={() => setSelectedItemId(item.id)}
                            onDoubleClick={() => handleTableItemDoubleClick(item)}
                            className={`cursor-default ${selectedItemId === item.id ? 'bg-blue-500/20 dark:bg-blue-500/30' : 'hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70'}`}
                          >
                            <TableCell className="py-1.5">
                              <ItemIcon size={18} className={item.type === 'folder' ? "text-blue-500" : "text-neutral-500 dark:text-neutral-400"} />
                            </TableCell>
                            <TableCell className="py-1.5 font-medium text-neutral-800 dark:text-neutral-200">{item.name}</TableCell>
                            <TableCell className="py-1.5 text-neutral-600 dark:text-neutral-400">{item.dateModified}</TableCell>
                            <TableCell className="py-1.5 text-right text-neutral-600 dark:text-neutral-400">{item.size}</TableCell>
                          </TableRow>
                        );
                      }) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                                {searchTerm ? "No items match your search." : (currentPath === "/Recents" || currentPath === "/Trash" ? `This folder is empty.` : "This folder is empty.")}
                            </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
                 {/* Status Bar */}
                <div className="p-1.5 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 text-center">
                    {filteredItems.length} item{filteredItems.length !== 1 && 's'}
                    {selectedItemId && `, ${getItemFromPath(currentPath, mockFileSystem)?.children?.find(i=>i.id === selectedItemId)?.size || '...'} selected`}
                </div>
              </div>
            </div>
          </div>
        </AppWindow>
      </div>
    </div>
  );
};

export default FinderWindowView;