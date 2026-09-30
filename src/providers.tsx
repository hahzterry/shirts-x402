"use client";

import { EchoProvider } from "@merit-systems/echo-next-sdk/client";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  // ⚠️ ConnectKitProvider must wrap the tree at all times. We only
  // delay its *mounted* rendering to avoid SSR errors from its
  // internal walletconnect deps — but we keep it in the tree so
  // its hooks have a context to attach to on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <EchoProvider config={{ appId: process.env.NEXT_PUBLIC_ECHO_APP_ID! }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            {mounted ? children : null}
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </EchoProvider>
  );
}