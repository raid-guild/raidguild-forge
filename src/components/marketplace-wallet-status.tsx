"use client";

import { WalletCards } from "lucide-react";
import { useState } from "react";
import { useConnect, useConnection, useDisconnect } from "wagmi";

import { Button } from "@/components/ui/button";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { marketplacePaymentChain } from "@/lib/wagmi";
import {
  getPreferredWalletConnector,
  getWalletErrorMessage,
  withWalletTimeout,
} from "@/lib/wallet";

type MarketplaceWalletStatusProps = {
  location: string;
};

export function MarketplaceWalletStatus({ location }: MarketplaceWalletStatusProps) {
  const { address, chainId, isConnected } = useConnection();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isWrongNetwork = isConnected && chainId !== marketplacePaymentChain.id;

  async function handleConnect() {
    const connector = getPreferredWalletConnector(connectors);

    setError(null);
    trackEvent(analyticsEvents.marketplaceWalletConnectClick, { location });

    if (!connector) {
      setError("No browser wallet was detected.");
      return;
    }

    try {
      setIsConnecting(true);
      await withWalletTimeout(
        connectAsync({ connector }),
        `${connector.name} did not respond. Check for an open wallet prompt and try again.`,
      );
    } catch (connectError) {
      setError(getWalletErrorMessage(connectError, "Wallet connection was cancelled."));
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <div className="border border-moloch-800/14 bg-scroll-100 p-3 text-moloch-800 shadow-[4px_4px_0_rgba(41,16,10,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <WalletCards
            aria-hidden="true"
            className="shrink-0 text-moloch-500"
            size={18}
            strokeWidth={1.8}
          />
          <div className="min-w-0">
            <p className="type-label-sm text-moloch-500">Wallet</p>
            <p className="truncate font-mono text-sm leading-5 text-moloch-800/68">
              {isConnected && address ? truncateAddress(address) : "Not connected"}
            </p>
          </div>
        </div>
        {isConnected ? (
          <Button
            type="button"
            variant="secondary"
            className="h-9 px-3"
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            type="button"
            className="h-9 px-3"
            disabled={isConnecting}
            onClick={handleConnect}
          >
            {isConnecting ? "Connecting" : "Connect"}
          </Button>
        )}
      </div>
      {isWrongNetwork ? (
        <p className="type-body-md mt-3 text-moloch-800/68">
          Checkout uses {marketplacePaymentChain.name}.
        </p>
      ) : null}
      {error ? <p className="type-body-md mt-3 text-moloch-500">{error}</p> : null}
    </div>
  );
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
