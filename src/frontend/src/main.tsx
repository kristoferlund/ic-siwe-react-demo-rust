import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import {
  canisterId,
  idlFactory,
} from "../../declarations/ic_siwe_provider/index";
import { chains, wagmiConfig } from "./wagmi/wagmi.config.ts";

import Actors from "./ic/Actors.tsx";
import App from "./App.tsx";
import AuthGuard from "./AuthGuard.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { SiweIdentityProvider } from "ic-use-siwe-identity";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";
import { _SERVICE } from "../../declarations/ic_siwe_provider/ic_siwe_provider.did";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={darkTheme({
          accentColor: "#7b3fe4",
          accentColorForeground: "white",
          borderRadius: "large",
          overlayBlur: "none",
        })}
      >
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
      </RainbowKitProvider>
    </WagmiConfig>
    <Toaster />
  </React.StrictMode>
);
