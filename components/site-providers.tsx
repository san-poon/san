"use client";

import { createAgent, registerTools } from "@ui-sdk/react/agent";
import { Preferences } from "@ui-sdk/react/preferences";
import {
  Toast,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "@ui-sdk/react/toast";
import { useEffect } from "react";
import { colorScheme } from "@/lib/preferences";

type UiAgent = ReturnType<typeof createAgent>;

declare global {
  interface Window {
    __sanUiAgent?: () => UiAgent;
  }
}

export function SiteProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const agent = createAgent({ allow: () => true });
    const unregister = registerTools(agent, { allow: () => true });
    window.__sanUiAgent = () => agent;
    return () => {
      unregister();
      window.__sanUiAgent = undefined;
    };
  }, []);

  return (
    <Preferences preferences={[colorScheme]}>
      {children}
      <ToastRegion data-agent-hidden align="center" side="bottom">
        {() => (
          <Toast>
            <ToastTitle />
            <ToastDescription />
          </Toast>
        )}
      </ToastRegion>
    </Preferences>
  );
}
