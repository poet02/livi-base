import React from 'react';

export interface DraggableItem {
  id: string;
  content: React.ReactElement;
}

export const createDraggableItem = (
  id: string,
  content: React.ReactElement
): DraggableItem => ({
  id,
  content,
});

export const useDraggableList = (initialItems: DraggableItem[] = []) => {
  const [items, setItems] = React.useState<DraggableItem[]>(initialItems);

  const addItem = (itemId: string, content: React.ReactElement) => {
    setItems(prev => [...prev, createDraggableItem(itemId, content)]);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, content: React.ReactElement) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, content } : item
    ));
  };

  const reorderItems = (newItems: DraggableItem[]) => {
    setItems(newItems);
  };

  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    reorderItems,
  };
};

