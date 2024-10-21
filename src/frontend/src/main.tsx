import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  canisterId,
  idlFactory,
} from "../../ic_siwe_provider/declarations/index";

import Actors from "./ic/Actors.tsx";
import App from "./App.tsx";
import AuthGuard from "./AuthGuard.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { SiweIdentityProvider } from "ic-use-siwe-identity";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { _SERVICE } from "../../ic_siwe_provider/declarations/ic_siwe_provider.did";
import { wagmiConfig } from "./wagmi/wagmi.config.ts";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SiweIdentityProvider<_SERVICE>
          canisterId={canisterId}
          idlFactory={idlFactory}
        >
          <Actors>
            <AuthGuard>
              <App />
            </AuthGuard>
          </Actors>
        </SiweIdentityProvider>
      </QueryClientProvider>
    </WagmiProvider>
    <Toaster />
  </React.StrictMode>
);
