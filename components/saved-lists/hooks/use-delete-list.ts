import { useState } from 'react';

export const useDeleteList = (onDeleteList?: (listId: string) => Promise<void>, onRefresh?: () => void) => {
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = (listId: string) => {
    setListToDelete(listId);
  };

  const handleDeleteConfirm = async () => {
    if (!listToDelete || !onDeleteList) return;
    
    try {
      setIsDeleting(true);
      await onDeleteList(listToDelete);
      setListToDelete(null);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting list:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setListToDelete(null);
    }
  };

  return {
    listToDelete,
    isDeleting,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDeleteCancel
  };
};
