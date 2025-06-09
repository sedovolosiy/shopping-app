// types.ts - Общие типы для формы списка покупок

export interface Store {
  id: string;
  name: string;
}

export interface ShoppingListFormProps {
  rawText: string;
  setRawText: (text: string) => void;
  selectedStoreId: string;
  setSelectedStoreId: (storeId: string) => void;
  onOptimize: (userId: string, listName?: string) => void;
  isOptimized: boolean;
  userId: string;
  setUserId: (userId: string) => void;
  listName: string;
  setListName: (listName: string) => void;
  availableStores: Store[];
  onAddStore: (storeName: string) => Promise<Store | null>;
  isLoading?: boolean;
  onReset?: () => void;
  isEditingExistingList?: boolean;
  useAI: boolean;
  setUseAI: (v: boolean) => void;
}

export interface UserInfoSectionProps {
  userId: string;
  setUserId: (userId: string) => void;
  listName: string;
  setListName: (listName: string) => void;
  isEditingExistingList: boolean;
  isDesktop?: boolean;
  isTablet?: boolean;
}

export interface AIToggleSectionProps {
  useAI: boolean;
  setUseAI: (v: boolean) => void;
  isDesktop?: boolean;
}

export interface StoreSectionProps {
  selectedStoreId: string;
  setSelectedStoreId: (storeId: string) => void;
  availableStores: Store[];
  onAddStore: (storeName: string) => Promise<Store | null>;
  isDesktop?: boolean;
}

export interface ShoppingListTextAreaProps {
  rawText: string;
  setRawText: (text: string) => void;
  isDesktop?: boolean;
  isTablet?: boolean;
}

export interface ActionButtonsProps {
  onOptimize: (userId: string, listName?: string) => void;
  onReset?: () => void;
  userId: string;
  listName: string;
  rawText: string;
  selectedStoreId: string;
  isOptimized: boolean;
  isLoading: boolean;
  isDesktop?: boolean;
  isTablet?: boolean;
}
