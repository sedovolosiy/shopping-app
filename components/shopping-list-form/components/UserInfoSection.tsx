// components/UserInfoSection.tsx - Компонент для информации о пользователе

import React from 'react';
import { Label } from '@/components/ui/label';
import { UserInfoSectionProps } from '../types';

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  userId,
  setUserId,
  listName,
  setListName,
  isEditingExistingList,
  isDesktop = false,
  isTablet = false,
}) => {
  if (isDesktop) {
    return (
      <div className="desktop-card-section space-y-4">
        <h3 className="desktop-section-title">Информация о списке</h3>
        
        <div className="desktop-form-group">
          <Label htmlFor="user-id" className="desktop-label">
            ID пользователя
          </Label>
          <input 
            type="text"
            id="user-id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Введите ваш email или ID" 
            className="desktop-input"
            readOnly={isEditingExistingList}
          />
          {userId && (
            <p className="desktop-helper-text">
              Списки будут сохранены под этим ID
            </p>
          )}
        </div>

        <div className="desktop-form-group">
          <Label htmlFor="list-name" className="desktop-label">
            Название списка
          </Label>
          <input 
            type="text"
            id="list-name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Например: Еженедельные покупки" 
            className="desktop-input"
          />
          <p className="desktop-helper-text">Необязательное поле</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="form-input-group">
        <Label htmlFor="user-id" className={`form-label ${isTablet ? 'tablet-text-lg' : ''}`}>
          ID пользователя
        </Label>
        <input 
          type="text"
          id="user-id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Введите ваш email или ID" 
          className={`form-input ${isTablet ? 'h-14 text-lg' : ''}`}
          readOnly={isEditingExistingList}
        />
        {userId && (
          <p className="text-xs text-gray-500 mt-1">
            Списки будут сохранены под этим ID
          </p>
        )}
      </div>

      <div className="form-input-group">
        <Label htmlFor="list-name" className="form-label">
          Название списка
        </Label>
        <input 
          type="text"
          id="list-name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="Например: Еженедельные покупки" 
          className="form-input"
        />
        <p className="text-xs text-gray-500 mt-1">Необязательное поле</p>
      </div>
    </>
  );
};

UserInfoSection.displayName = 'UserInfoSection';
