"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextProps {
  isSidebarOpen: boolean;
  toggleSidebarState: (_value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  isSidebarOpen: true,
  toggleSidebarState: () => {},
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setSidebarState] = useState<boolean>(false);
  const toggleSidebarState = (value: boolean) => setSidebarState(value);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebarState }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => useContext(SidebarContext);
