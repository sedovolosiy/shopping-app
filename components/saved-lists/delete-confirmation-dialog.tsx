'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  description?: string;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = 'Удалить список покупок?',
  description = 'Это действие нельзя будет отменить. Список покупок будет удален навсегда.'
}) => {
  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          onClose();
        }
      }}
    >
      <AlertDialogContent className="rounded-2xl border-0 shadow-2xl bg-white dark:bg-gray-900">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-lg font-bold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Отмена
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className={`rounded-xl ${
              isDeleting 
                ? 'bg-red-300 dark:bg-red-800' 
                : 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
            } text-white shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Удаление...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

DeleteConfirmationDialog.displayName = 'DeleteConfirmationDialog';
