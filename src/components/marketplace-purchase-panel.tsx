"use client";

import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import {
  CheckCircle2,
  Download,
  FileArchive,
  LoaderCircle,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { WalletClient } from "viem";
import {
  useConnect,
  useConnection,
  useReadContract,
  useSwitchChain,
  useWalletClient,
} from "wagmi";

import { Button } from "@/components/ui/button";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { marketplacePaymentChain, marketplacePaymentNetwork } from "@/lib/wagmi";
import {
  getPreferredWalletConnector,
  getWalletErrorMessage as getSharedWalletErrorMessage,
  withWalletTimeout,
} from "@/lib/wallet";
import {
  fetchX402Metadata,
  getDownloadFileName,
  getPreferredPaymentOption,
  getX402PurchaseErrorMessage,
  getX402DisplayDetails,
  X402PurchaseError,
  type X402DisplayDetails,
  type X402Metadata,
} from "@/lib/x402";

type MarketplacePurchasePanelProps = {
  endpoint: string;
  kitSlug: string;
};

type PurchaseState = "idle" | "connecting" | "switching" | "purchasing" | "success";

const erc20BalanceAbi = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function MarketplacePurchasePanel({
  endpoint,
  kitSlug,
}: MarketplacePurchasePanelProps) {
  const { address, chainId, isConnected } = useConnection();
  const { connectAsync, connectors } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient({ chainId: marketplacePaymentChain.id });
  const [metadata, setMetadata] = useState<X402Metadata | null>(null);
  const [details, setDetails] = useState<X402DisplayDetails | null>(null);
  const [metadataStatus, setMetadataStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [purchaseState, setPurchaseState] = useState<PurchaseState>("idle");
  const [download, setDownload] = useState<{
    fileName: string;
    url: string;
  } | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isWrongNetwork = isConnected && chainId !== marketplacePaymentChain.id;
  const paymentOption = metadata ? getPreferredPaymentOption(metadata) : undefined;
  const requiredAmount = getRequiredAmount(paymentOption?.amount);
  const assetAddress = getAssetAddress(paymentOption?.asset);
  const shouldReadBalance =
    Boolean(address) &&
    Boolean(assetAddress) &&
    requiredAmount !== null &&
    isConnected &&
    !isWrongNetwork;
  const { data: tokenBalance, isLoading: isBalanceLoading } = useReadContract({
    address: assetAddress ?? undefined,
    abi: erc20BalanceAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: marketplacePaymentChain.id,
    query: {
      enabled: shouldReadBalance,
    },
  });
  const hasInsufficientBalance =
    shouldReadBalance &&
    typeof tokenBalance === "bigint" &&
    requiredAmount !== null &&
    tokenBalance < requiredAmount;
  const isBusy =
    purchaseState === "connecting" ||
    purchaseState === "switching" ||
    purchaseState === "purchasing";

  useEffect(() => {
    let isMounted = true;

    async function loadMetadata() {
      try {
        const nextMetadata = await fetchX402Metadata(endpoint);

        if (!isMounted) {
          return;
        }

        setMetadata(nextMetadata);
        setDetails(getX402DisplayDetails(nextMetadata));
        setMetadataError(null);
        setMetadataStatus("ready");
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setMetadataError(
          loadError instanceof Error
            ? loadError.message
            : "Payment details could not be loaded from the x402 endpoint.",
        );
        setMetadataStatus("error");
      }
    }

    loadMetadata();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  useEffect(() => {
    return () => {
      if (download) {
        URL.revokeObjectURL(download.url);
      }
    };
  }, [download]);

  async function handlePurchase() {
    setError(null);

    try {
      if (purchaseState === "success" && download) {
        triggerDownload(download.url, download.fileName);
        return;
      }

      trackEvent(analyticsEvents.marketplaceKitPurchaseClick, { kit: kitSlug });

      if (!isConnected) {
        const connector = getPreferredWalletConnector(connectors);

        if (!connector) {
          throw new Error("No browser wallet was detected.");
        }

        setPurchaseState("connecting");
        await withWalletTimeout(
          connectAsync({ connector }),
          `${connector.name} did not respond. Check for an open wallet prompt and try again.`,
        );
        setPurchaseState("idle");
        return;
      }

      if (isWrongNetwork) {
        setPurchaseState("switching");
        await withWalletTimeout(
          switchChainAsync({ chainId: marketplacePaymentChain.id }),
          "Network switch timed out. Check your wallet extension and try again.",
        );
        setPurchaseState("idle");
        return;
      }

      if (!walletClient || !address) {
        throw new Error("Wallet is connected, but the signer is not ready yet.");
      }

      if (hasInsufficientBalance && details) {
        throw new X402PurchaseError(getInsufficientBalanceMessage(details));
      }

      setPurchaseState("purchasing");
      const response = await createPaymentFetch(walletClient, address)(endpoint);

      if (!response.ok) {
        throw new X402PurchaseError(
          await getX402PurchaseErrorMessage(response, details),
        );
      }

      const blob = await response.blob();
      const fileName = getDownloadFileName(kitSlug, metadata);
      const downloadUrl = URL.createObjectURL(blob);

      if (download) {
        URL.revokeObjectURL(download.url);
      }

      setDownload({ fileName, url: downloadUrl });
      triggerDownload(downloadUrl, fileName);
      setPurchaseState("success");
      trackEvent(analyticsEvents.marketplaceKitPurchaseSuccess, { kit: kitSlug });
    } catch (purchaseError) {
      setPurchaseState("idle");
      setError(getWalletErrorMessage(purchaseError, "Purchase could not be completed."));
      trackEvent(analyticsEvents.marketplaceKitPurchaseError, { kit: kitSlug });
    }
  }

  return (
    <aside className="min-w-0 border border-moloch-800/15 bg-scroll-100 p-5 shadow-[8px_8px_0_rgba(41,16,10,0.08)]">
      <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-moloch-500 text-scroll-100">
        <FileArchive aria-hidden="true" size={22} strokeWidth={1.8} />
      </div>
      <p className="type-label-sm mb-2 text-moloch-500">Access</p>
      <h2 className="type-heading-md mb-3">Buy the kit files.</h2>
      <p className="type-body-md mb-5 text-moloch-800/72">
        Purchase unlocks the downloadable build package from the configured x402
        endpoint.
      </p>

      <div className="grid gap-3 border-y border-moloch-800/12 py-4">
        <InfoRow
          label="Price"
          value={metadataStatus === "ready" && details ? details.paymentLabel : "Loading"}
        />
        <InfoRow
          label="Network"
          value={metadataStatus === "ready" && details ? details.networkLabel : "Loading"}
        />
        <InfoRow
          label="Download"
          value={metadataStatus === "ready" && details ? details.fileLabel : "Loading"}
        />
        <InfoRow
          label="License"
          value={metadataStatus === "ready" && details ? details.schemeLabel : "Loading"}
        />
        {isConnected && !isWrongNetwork ? (
          <InfoRow
            label="Balance"
            value={getBalanceStatusLabel(
              shouldReadBalance,
              isBalanceLoading,
              hasInsufficientBalance,
            )}
          />
        ) : null}
      </div>

      {metadataStatus === "error" ? (
        <p className="type-body-md mt-4 text-moloch-500">
          {metadataError ?? "Payment details could not be loaded from the x402 endpoint."}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3">
        <Button
          type="button"
          className="w-full gap-2"
          disabled={
            isBusy ||
            (purchaseState !== "success" &&
              (metadataStatus === "loading" ||
                metadataStatus === "error" ||
                hasInsufficientBalance))
          }
          onClick={handlePurchase}
        >
          {getButtonIcon(purchaseState, isConnected, isWrongNetwork, download)}
          {getButtonLabel(purchaseState, isConnected, isWrongNetwork, download)}
        </Button>
        <p className="type-body-md text-moloch-800/62">
          {getPurchaseHint(isConnected, isWrongNetwork, purchaseState, details)}
        </p>
      </div>

      {purchaseState === "success" ? (
        <div className="mt-5 border border-moloch-500/35 bg-moloch-100/55 p-4 text-moloch-800">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2
              aria-hidden="true"
              className="shrink-0 text-moloch-500"
              size={18}
              strokeWidth={1.8}
            />
            <p className="type-label-sm text-moloch-500">Purchase complete</p>
          </div>
          <p className="type-body-md text-moloch-800/74">
            Your kit files are unlocked and the download has started.
          </p>
          {download ? (
            <p className="mt-2 break-all font-mono text-sm leading-6 text-moloch-800/58">
              {download.fileName}
            </p>
          ) : null}
        </div>
      ) : null}

      {hasInsufficientBalance && details ? (
        <p className="type-body-md mt-4 text-moloch-500">
          {getInsufficientBalanceMessage(details)}
        </p>
      ) : null}

      {error ? <p className="type-body-md mt-4 text-moloch-500">{error}</p> : null}

      {details ? (
        <div className="mt-5 grid gap-2 border-t border-moloch-800/12 pt-4">
          {details.timeoutLabel ? (
            <InfoRow label="Timeout" value={details.timeoutLabel} />
          ) : null}
          <InfoRow label="Recipient" value={details.recipientLabel} />
        </div>
      ) : null}

      <p className="mt-4 break-all font-mono text-sm leading-6 text-moloch-800/54">
        {endpoint}
      </p>
    </aside>
  );
}

function createPaymentFetch(walletClient: WalletClient, address: string) {
  const signer = {
    address: address as `0x${string}`,
    signTypedData: async (message: {
      domain: Record<string, unknown>;
      types: Record<string, unknown>;
      primaryType: string;
      message: Record<string, unknown>;
    }) =>
      walletClient.signTypedData({
        account: address as `0x${string}`,
        domain: message.domain,
        types: message.types,
        primaryType: message.primaryType,
        message: message.message,
      }),
  };

  const client = new x402Client((_x402Version, paymentRequirements) => {
    const preferred = paymentRequirements.find(
      (option) =>
        option.scheme === "exact" && option.network === marketplacePaymentNetwork,
    );

    return preferred ?? paymentRequirements[0];
  });

  registerExactEvmScheme(client, {
    signer,
    networks: [marketplacePaymentNetwork],
  });

  return wrapFetchWithPayment(globalThis.fetch.bind(globalThis), client);
}

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener noreferrer";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="type-label-sm text-moloch-800/55">{label}</p>
      <p className="type-body-md text-right text-moloch-800/78">{value}</p>
    </div>
  );
}

function getButtonLabel(
  purchaseState: PurchaseState,
  isConnected: boolean,
  isWrongNetwork: boolean,
  download: { fileName: string; url: string } | null,
) {
  if (purchaseState === "success" && download) {
    return "Download Again";
  }

  if (purchaseState === "connecting") {
    return "Connecting";
  }

  if (purchaseState === "switching") {
    return "Switching";
  }

  if (purchaseState === "purchasing") {
    return "Purchasing";
  }

  if (!isConnected) {
    return "Connect Wallet";
  }

  if (isWrongNetwork) {
    return "Switch to Base";
  }

  return "Buy Kit Files";
}

function getButtonIcon(
  purchaseState: PurchaseState,
  isConnected: boolean,
  isWrongNetwork: boolean,
  download: { fileName: string; url: string } | null,
) {
  if (purchaseState === "success" && download) {
    return <Download aria-hidden="true" size={16} strokeWidth={1.8} />;
  }

  if (
    purchaseState === "connecting" ||
    purchaseState === "switching" ||
    purchaseState === "purchasing"
  ) {
    return <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />;
  }

  if (!isConnected || isWrongNetwork) {
    return <WalletCards aria-hidden="true" size={16} strokeWidth={1.8} />;
  }

  return <Download aria-hidden="true" size={16} strokeWidth={1.8} />;
}

function getPurchaseHint(
  isConnected: boolean,
  isWrongNetwork: boolean,
  purchaseState: PurchaseState,
  details: X402DisplayDetails | null,
) {
  if (purchaseState === "success") {
    return "Use Download Again if your browser blocked the automatic download.";
  }

  if (!isConnected) {
    if (details) {
      return `Connect a wallet with ${details.assetLabel} available on ${details.networkLabel}.`;
    }

    return "Connect a wallet to purchase this kit.";
  }

  if (isWrongNetwork) {
    return `Switch your connected wallet to ${
      details?.networkLabel ?? marketplacePaymentChain.name
    } before purchasing.`;
  }

  return "Your wallet will be asked to authorize the x402 payment.";
}

function getRequiredAmount(amount?: string) {
  if (!amount || !/^\d+$/.test(amount)) {
    return null;
  }

  return BigInt(amount);
}

function getAssetAddress(asset?: string) {
  if (!asset || !/^0x[a-fA-F0-9]{40}$/.test(asset)) {
    return null;
  }

  return asset as `0x${string}`;
}

function getBalanceStatusLabel(
  shouldReadBalance: boolean,
  isBalanceLoading: boolean,
  hasInsufficientBalance: boolean,
) {
  if (!shouldReadBalance) {
    return "Unavailable";
  }

  if (isBalanceLoading) {
    return "Checking";
  }

  return hasInsufficientBalance ? "Insufficient" : "Ready";
}

function getInsufficientBalanceMessage(details: X402DisplayDetails) {
  return `Your connected wallet needs at least ${details.paymentLabel} on ${details.networkLabel} to buy this kit.`;
}

function getWalletErrorMessage(error: unknown, fallback: string) {
  if (error instanceof X402PurchaseError) {
    return error.message;
  }

  return getSharedWalletErrorMessage(error, fallback);
}
