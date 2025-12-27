/**
 * Simple UI state management using React Context
 * This serves as a lightweight alternative to Zustand for transient UI state
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIState {
  // Sidebar state
  isSidebarOpen: boolean;
  
  // Filter states
  filterYear: number | null;
  filterVisionId: number | null;
  filterStatus: string | null;
  
  // Search state
  searchQuery: string;
  
  // Command palette state
  isCommandPaletteOpen: boolean;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setFilterYear: (year: number | null) => void;
  setFilterVisionId: (visionId: number | null) => void;
  setFilterStatus: (status: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  isSidebarOpen: true,
  filterYear: null,
  filterVisionId: null,
  filterStatus: null,
  searchQuery: '',
  isCommandPaletteOpen: false,
};

const UIContext = createContext<UIStore | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>(initialState);

  const actions: UIActions = {
    toggleSidebar: () => {
      setState((prev) => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
    },
    
    setSidebarOpen: (isOpen: boolean) => {
      setState((prev) => ({ ...prev, isSidebarOpen: isOpen }));
    },
    
    setFilterYear: (year: number | null) => {
      setState((prev) => ({ ...prev, filterYear: year }));
    },
    
    setFilterVisionId: (visionId: number | null) => {
      setState((prev) => ({ ...prev, filterVisionId: visionId }));
    },
    
    setFilterStatus: (status: string | null) => {
      setState((prev) => ({ ...prev, filterStatus: status }));
    },
    
    setSearchQuery: (query: string) => {
      setState((prev) => ({ ...prev, searchQuery: query }));
    },
    
    toggleCommandPalette: () => {
      setState((prev) => ({ ...prev, isCommandPaletteOpen: !prev.isCommandPaletteOpen }));
    },
    
    setCommandPaletteOpen: (isOpen: boolean) => {
      setState((prev) => ({ ...prev, isCommandPaletteOpen: isOpen }));
    },
    
    resetFilters: () => {
      setState((prev) => ({
        ...prev,
        filterYear: null,
        filterVisionId: null,
        filterStatus: null,
        searchQuery: '',
      }));
    },
  };

  const value: UIStore = {
    ...state,
    ...actions,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUIStore(): UIStore {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUIStore must be used within a UIProvider');
  }
  return context;
}
