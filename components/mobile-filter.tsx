"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FilterProps {
  onApplyFilters: (filters: any) => void;
  onClose: () => void;
}

const MobileFilter: React.FC<FilterProps> = ({ onApplyFilters, onClose }) => {
  // Default filter states
  const [sortOption, setSortOption] = useState("category");
  const [showCompleted, setShowCompleted] = useState(true);
  const [categories, setCategories] = useState<string[]>([
    "Фрукты и овощи",
    "Молочные продукты",
    "Мясо и рыба",
    "Бакалея"
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleApply = () => {
    onApplyFilters({
      sortOption,
      showCompleted,
      selectedCategories,
      priceRange
    });
    onClose();
  };

  const handleReset = () => {
    setSortOption("category");
    setShowCompleted(true);
    setSelectedCategories(categories);
    setPriceRange([0, 5000]);
  };

  return (
    <div className="space-y-6">
      {/* Sort options */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">Сортировка</h4>
        <RadioGroup value={sortOption} onValueChange={setSortOption}>
          <div className="flex items-center space-x-2 py-2">
            <RadioGroupItem value="category" id="sort-category" />
            <Label htmlFor="sort-category">По категориям</Label>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <RadioGroupItem value="price" id="sort-price" />
            <Label htmlFor="sort-price">По цене</Label>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <RadioGroupItem value="name" id="sort-name" />
            <Label htmlFor="sort-name">По названию</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Display options */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">Отображение</h4>
        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="show-completed" 
            checked={showCompleted}
            onCheckedChange={(checked) => setShowCompleted(checked as boolean)}
          />
          <Label htmlFor="show-completed">Показывать выполненные</Label>
        </div>
      </div>
      
      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">Категории</h4>
        <div className="space-y-1 max-h-[200px] overflow-auto py-1">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2 py-2">
              <Checkbox 
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price range */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <h4 className="font-medium text-gray-800 dark:text-gray-200">Диапазон цен</h4>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {priceRange[0]}₽ - {priceRange[1]}₽
          </span>
        </div>
        <Slider
          defaultValue={[0, 5000]}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
        />
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full"
        >
          Сбросить
        </Button>
        <Button
          onClick={handleApply}
          className="w-full"
        >
          Применить
        </Button>
      </div>
    </div>
  );
};

export default MobileFilter;
