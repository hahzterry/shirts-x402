"use client";

import { EchoProvider } from "@merit-systems/echo-next-sdk/client";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  // ⚠️ `connectkit` pulls in @walletconnect/ethereum-provider at module load,
  // and WalletConnect touches `indexedDB` immediately — which does not exist
  // in the Node.js runtime Next uses for static generation. Deferring the
  // ConnectKitProvider until after mount keeps it out of the server render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <EchoProvider config={{ appId: process.env.NEXT_PUBLIC_ECHO_APP_ID! }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {mounted ? (
            <ConnectKitProvider>{children}</ConnectKitProvider>
          ) : (
            children
          )}
        </QueryClientProvider>
      </WagmiProvider>
    </EchoProvider>
  );
}