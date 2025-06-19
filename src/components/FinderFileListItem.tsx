import React from 'react';
import { FileText, Folder } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils.ts exists for cn

interface FinderFileListItemProps {
  id: string;
  name: string;
  type: 'file' | 'folder';
  dateModified: string; // e.g., "Yesterday, 10:30 AM" or "Jan 5, 2023"
  size: string;         // e.g., "1.5 MB", "2 items", or "—"
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string, type: 'file' | 'folder') => void;
}

const FinderFileListItem: React.FC<FinderFileListItemProps> = ({
  id,
  name,
  type,
  dateModified,
  size,
  isSelected,
  onSelect,
  onOpen,
}) => {
  console.log(`FinderFileListItem loaded for: ${name}, selected: ${isSelected}`);

  const IconComponent = type === 'folder' ? Folder : FileText;

  return (
    <div
      className={cn(
        "flex items-center p-1 px-2 rounded-md cursor-default text-sm",
        "transition-colors duration-100 ease-in-out",
        isSelected
          ? "bg-blue-500 text-white hover:bg-blue-500/90"
          : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
      )}
      onClick={() => onSelect(id)}
      onDoubleClick={() => onOpen(id, type)}
      role="row"
      aria-selected={isSelected}
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpen(id, type);
        }
      }}
    >
      <div className="w-8 flex-shrink-0 flex items-center justify-center mr-2">
        <IconComponent 
          className={cn(
            "h-5 w-5",
            type === 'folder' && (isSelected ? "text-blue-100" : "text-blue-500 dark:text-blue-400"),
            type === 'file' && (isSelected ? "text-gray-100" : "text-gray-500 dark:text-gray-400")
          )}
        />
      </div>
      <div className="flex-grow min-w-0 w-[40%] truncate pr-2">
        {name}
      </div>
      <div className={cn("w-[30%] text-xs text-right pr-3 truncate", isSelected ? "text-gray-100" : "text-gray-500 dark:text-gray-400")}>
        {dateModified}
      </div>
      <div className={cn("w-[20%] text-xs text-right pr-1 truncate", isSelected ? "text-gray-100" : "text-gray-500 dark:text-gray-400")}>
        {size}
      </div>
    </div>
  );
};

export default FinderFileListItem;