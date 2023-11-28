import { arbitrum, base, mainnet, optimism, polygon, zora } from "wagmi/chains";
import { configureChains, createConfig } from "wagmi";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";

export const supportedChains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
];

export const { chains, publicClient } = configureChains(supportedChains, [
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
