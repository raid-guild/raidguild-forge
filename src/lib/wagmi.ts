import { createConfig, http, injected } from "wagmi";
import { base } from "viem/chains";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: false,
      target: "metaMask",
      unstable_shimAsyncInject: 1_000,
    }),
    injected({
      shimDisconnect: false,
      unstable_shimAsyncInject: 1_000,
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

export const marketplacePaymentChain = base;
export const marketplacePaymentNetwork = "eip155:8453";
