"use client";

import { createAgent, registerTools } from "@ui-sdk/react/agent";
import { Preferences } from "@ui-sdk/react/preferences";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "@ui-sdk/react/toast";
import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";
import { colorScheme } from "@/lib/preferences";
import { CONTROLS } from "@/lib/site-content";

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
      <ToastRegion
        align="center"
        data-agent-hidden
        maxVisible={1}
        side="bottom"
      >
        {() => (
          <Toast className="items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-0.5">
              <ToastTitle />
              <ToastDescription />
            </div>
            <ToastClose
              aria-label={CONTROLS.toastDismissLabel}
              className="rounded-full text-[var(--ink-muted)] hover:bg-[var(--surface-container)] hover:text-[var(--ink)]"
            >
              <CloseIcon className="size-3.5" />
            </ToastClose>
          </Toast>
        )}
      </ToastRegion>
    </Preferences>
  );
}
