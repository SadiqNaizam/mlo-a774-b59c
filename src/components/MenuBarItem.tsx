import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Apple } from 'lucide-react'; // ChevronRight is usually included by shadcn's DropdownMenuSubTrigger
import { cn } from '@/lib/utils';

export interface MenuItemType {
  label: React.ReactNode;
  onClick?: () => void;
  shortcut?: string;
  disabled?: boolean;
  isSeparator?: boolean;
  subItems?: MenuItemType[];
  icon?: React.ReactNode;
}

interface MenuBarItemProps {
  label?: React.ReactNode; // Text or custom element for the menu bar item. Not used if isAppleMenu is true.
  items: MenuItemType[];
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  isAppleMenu?: boolean; // If true, displays Apple logo instead of label
  onOpenChange?: (open: boolean) => void; // Callback for dropdown open/close state
}

const renderMenuItems = (menuItems: MenuItemType[]): React.ReactNode => {
  return menuItems.map((item, index) => {
    const key = typeof item.label === 'string' ? item.label + index : `item-${index}`;

    if (item.isSeparator) {
      return <DropdownMenuSeparator key={`sep-${index}`} className="bg-neutral-200 dark:bg-neutral-700 my-1" />;
    }

    if (item.subItems && item.subItems.length > 0) {
      return (
        <DropdownMenuSub key={key}>
          <DropdownMenuSubTrigger
            disabled={item.disabled}
            className={cn(
              "flex items-center text-sm rounded-sm px-2.5 py-1.5 relative select-none outline-none transition-colors cursor-default",
              "hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              "dark:hover:bg-blue-500 dark:hover:text-white dark:focus:bg-blue-500 dark:focus:text-white"
            )}
          >
            {item.icon && <span className="mr-2 h-4 w-4 flex-shrink-0">{item.icon}</span>}
            <span className="flex-grow">{item.label}</span>
            {/* ChevronRight is automatically added by DropdownMenuSubTrigger */}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
              className={cn(
                "min-w-[200px] bg-neutral-50/90 dark:bg-neutral-800/90 backdrop-blur-md ",
                "border border-neutral-300 dark:border-neutral-700 rounded-md shadow-lg p-1",
                "animate-in slide-in-from-left-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2"
              )}
            >
              {renderMenuItems(item.subItems)}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem
        key={key}
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(
          "flex items-center text-sm rounded-sm px-2.5 py-1.5 relative select-none outline-none transition-colors cursor-default",
          "hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          "dark:hover:bg-blue-500 dark:hover:text-white dark:focus:bg-blue-500 dark:focus:text-white"
        )}
      >
        {item.icon && <span className="mr-2 h-4 w-4 flex-shrink-0">{item.icon}</span>}
        <span className="flex-grow">{item.label}</span>
        {item.shortcut && <DropdownMenuShortcut className="ml-auto pl-5 opacity-70">{item.shortcut}</DropdownMenuShortcut>}
      </DropdownMenuItem>
    );
  });
};

const MenuBarItem: React.FC<MenuBarItemProps> = ({
  label,
  items,
  className,
  triggerClassName,
  contentClassName,
  isAppleMenu = false,
  onOpenChange,
}) => {
  console.log(`MenuBarItem loaded: ${isAppleMenu ? 'Apple Menu' : label}`);

  const triggerContent = isAppleMenu ? (
    <Apple className="h-4 w-4 fill-current text-black dark:text-white group-hover:text-white group-data-[state=open]:text-white" aria-label="Apple Menu"/>
  ) : (
    label
  );

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          "group h-full flex items-center px-2.5 text-xs font-medium focus:outline-none transition-colors duration-100 cursor-default select-none",
          "text-black dark:text-white",
          "hover:bg-neutral-600/70 hover:text-white", // macOS-like hover for dark menu bar
          "data-[state=open]:bg-neutral-600/90 data-[state=open]:text-white", // macOS-like open state for dark menu bar
          // For light menu bar, you might use:
          // "hover:bg-neutral-200 dark:hover:bg-neutral-700",
          // "data-[state=open]:bg-neutral-300 dark:data-[state=open]:bg-neutral-600",
          triggerClassName
        )}
      >
        <button className="h-full flex items-center">{triggerContent}</button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className={cn(
            "min-w-[220px] bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-xl",
            "border border-neutral-300 dark:border-neutral-700 rounded-md shadow-2xl p-1",
            "z-50", // Ensure it's above other elements like AppWindow
            "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            contentClassName
          )}
        >
          {renderMenuItems(items)}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default MenuBarItem;