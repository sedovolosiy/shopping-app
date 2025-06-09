export interface SavedList {
  id: string;
  name: string;
  createdAt: string;
  storeId: string;
  status: 'active' | 'completed';
  items: Array<{
    id: string;
    name: string;
    category: string;
    purchased: boolean;
  }>;
}

export interface SavedListsViewProps {
  userId: string;
  savedLists: SavedList[];
  isLoading: boolean;
  onSelectList: (list: SavedList) => void;
  onCreateNew: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  onDeleteList?: (listId: string) => Promise<void>;
}
