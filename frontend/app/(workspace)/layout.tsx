import type { ReactNode } from "react";
import WorkspaceShell from "@/components/layout/workspace-shell";
import WorkspaceStoreProvider from "@/store/workspace-store-provider";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <WorkspaceStoreProvider><WorkspaceShell>{children}</WorkspaceShell></WorkspaceStoreProvider>;
}
