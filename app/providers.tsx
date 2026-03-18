// app/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import PushNotificationProvider from "@/components/PushNotificationProvider";
import ActivityTracker from "@/components/ActivityTracker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PushNotificationProvider>
        <ActivityTracker>
          {children}
        </ActivityTracker>
      </PushNotificationProvider>
    </SessionProvider>
  );
}
