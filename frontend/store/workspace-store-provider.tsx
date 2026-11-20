"use client";

import { configureStore } from "@reduxjs/toolkit";
import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { leadsApi } from "./leads-api";

export default function WorkspaceStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => configureStore({
    reducer: { [leadsApi.reducerPath]: leadsApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(leadsApi.middleware),
  }));

  return <Provider store={store}>{children}</Provider>;
}
