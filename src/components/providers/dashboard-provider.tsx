"use client";

import React, { createContext, useContext, useReducer, useState } from "react";
import ToastProvider from "./toast-provider";


type ActiveConversation = {
  type: 'single' | 'group'
  title: string,
  conversationId: string
}
interface DashboardContextType {
  activeConversation: ActiveConversation | null;
}
interface DashboardContextAction {
  type: 'CHANGE_CONVERSATION';
  value: any;
}
type DashboardDispatchContextType = ({type, value}: DashboardContextAction) => void;

const dashboardReducer = (
  state: DashboardContextType,
  action: DashboardContextAction
) => {
  switch (action.type) {
    case "CHANGE_CONVERSATION":
      return {
        ...state,
        activeConversation: action.value,
      };
    default:
      return state;
  }
};
const initialDashboardData: DashboardContextType = {
  activeConversation: null,
};

const DashboardContext = createContext<DashboardContextType>(initialDashboardData);
const DashboardDispatchContext = createContext<DashboardDispatchContextType>(() => {});

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardData);
  return (
    <DashboardContext.Provider value={state}>
      <DashboardDispatchContext.Provider value={dispatch}>
        <ToastProvider>{children}</ToastProvider>
      </DashboardDispatchContext.Provider>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
export const useDashboardDispatchContext = () => useContext(DashboardDispatchContext);


export default DashboardProvider;
