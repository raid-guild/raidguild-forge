import { decodePaymentResponseHeader } from "@x402/fetch";

export type X402PaymentOption = {
  scheme: string;
  network: string;
  amount: string;
  payTo: string;
  maxTimeoutSeconds?: number;
  asset?: string;
  extra?: {
    name?: string;
    version?: string;
  };
};

export type X402Metadata = {
  x402Version: number;
  accepts: X402PaymentOption[];
  error?: string;
  resource?: {
    url: string;
    mimeType?: string;
  };
};

export type X402DisplayDetails = {
  assetLabel: string;
  fileLabel: string;
  networkLabel: string;
  paymentLabel: string;
  requiredAmountLabel: string;
  recipientLabel: string;
  schemeLabel: string;
  timeoutLabel?: string;
};

export class X402PurchaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "X402PurchaseError";
  }
}

const networkLabels: Record<string, string> = {
  "eip155:8453": "Base",
};

const assetSymbolsByName: Record<string, string> = {
  "USD Coin": "USDC",
};

const assetDecimalsByAddress: Record<string, number> = {
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": 6,
};

const mimeTypeLabels: Record<string, string> = {
  "application/zip": "ZIP build package",
};

export async function fetchX402Metadata(endpoint: string): Promise<X402Metadata> {
  const response = await fetch(
    `/api/x402/metadata?endpoint=${encodeURIComponent(endpoint)}`,
  );
  const payload: unknown = await response.json();

  if (isX402Metadata(payload)) {
    return payload;
  }

  if (!response.ok) {
    throw new Error(getReadableErrorFromPayload(payload));
  }

  throw new Error("The x402 endpoint did not return payment metadata.");
}

export function getPreferredPaymentOption(metadata: X402Metadata) {
  return metadata.accepts[0];
}

export function getX402DisplayDetails(
  metadata: X402Metadata,
): X402DisplayDetails | null {
  const paymentOption = getPreferredPaymentOption(metadata);

  if (!paymentOption) {
    return null;
  }

  const assetLabel = formatAssetLabel(paymentOption);
  const networkLabel = formatNetworkLabel(paymentOption.network);
  const fileLabel = metadata.resource?.mimeType
    ? formatMimeTypeLabel(metadata.resource.mimeType)
    : "Gated download";

  return {
    assetLabel,
    fileLabel,
    networkLabel,
    paymentLabel: `${formatAmount(paymentOption)} ${assetLabel}`,
    requiredAmountLabel: formatAmount(paymentOption),
    recipientLabel: truncateAddress(paymentOption.payTo),
    schemeLabel: formatSchemeLabel(paymentOption.scheme),
    timeoutLabel: paymentOption.maxTimeoutSeconds
      ? `${paymentOption.maxTimeoutSeconds}s payment window`
      : undefined,
  };
}

export function getDownloadFileName(slug: string, metadata?: X402Metadata | null) {
  const mimeType = metadata?.resource?.mimeType;
  const extension = mimeType === "application/zip" ? "zip" : "download";

  return `${slug}.${extension}`;
}

export async function getX402PurchaseErrorMessage(
  response: Response,
  details?: X402DisplayDetails | null,
) {
  const responseText = await getResponseText(response);
  const paymentHeaderMessage = getPaymentHeaderMessage(response.headers);
  const responseMessage = getReadableErrorMessage(responseText);
  const message = responseMessage ?? paymentHeaderMessage;
  const lowerMessage = message?.toLowerCase() ?? "";

  if (response.status === 402) {
    if (
      lowerMessage.includes("insufficient") ||
      lowerMessage.includes("balance") ||
      lowerMessage.includes("funds") ||
      lowerMessage.includes("failed to verify payment")
    ) {
      return details
        ? `Payment was not completed. Confirm your wallet has at least ${details.paymentLabel} available on ${details.networkLabel}.`
        : "Payment was not completed. Your wallet does not appear to have enough funds for this purchase.";
    }

    if (message) {
      return `Payment was not completed. ${message}`;
    }

    return details
      ? `Payment was not completed. Confirm your wallet has at least ${details.paymentLabel} available on ${details.networkLabel}.`
      : "Payment was not completed. Confirm your wallet has enough funds and try again.";
  }

  if (message) {
    return `Purchase request failed. ${message}`;
  }

  return `Purchase request failed with HTTP ${response.status}.`;
}

function isX402Metadata(payload: unknown): payload is X402Metadata {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const metadata = payload as X402Metadata;

  return (
    typeof metadata.x402Version === "number" &&
    Array.isArray(metadata.accepts) &&
    metadata.accepts.every(isPaymentOption)
  );
}

function isPaymentOption(option: unknown): option is X402PaymentOption {
  if (!option || typeof option !== "object") {
    return false;
  }

  const paymentOption = option as X402PaymentOption;

  return (
    typeof paymentOption.scheme === "string" &&
    typeof paymentOption.network === "string" &&
    typeof paymentOption.amount === "string" &&
    typeof paymentOption.payTo === "string"
  );
}

function formatAmount(paymentOption: X402PaymentOption) {
  const decimals = paymentOption.asset
    ? assetDecimalsByAddress[paymentOption.asset.toLowerCase()]
    : undefined;

  if (decimals === undefined) {
    return paymentOption.amount;
  }

  const amount = Number(paymentOption.amount) / 10 ** decimals;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: amount % 1 === 0 ? 2 : 0,
  }).format(amount);
}

function formatAssetLabel(paymentOption: X402PaymentOption) {
  const name = paymentOption.extra?.name;

  if (name && assetSymbolsByName[name]) {
    return assetSymbolsByName[name];
  }

  return name ?? "payment token";
}

function formatNetworkLabel(network: string) {
  return networkLabels[network] ?? network;
}

function formatMimeTypeLabel(mimeType: string) {
  return mimeTypeLabels[mimeType] ?? mimeType;
}

function formatSchemeLabel(scheme: string) {
  if (scheme === "exact") {
    return "Fixed price";
  }

  return scheme;
}

function truncateAddress(address: string) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function getResponseText(response: Response) {
  try {
    return await response.clone().text();
  } catch {
    return "";
  }
}

function getPaymentHeaderMessage(headers: Headers) {
  const header =
    headers.get("x-payment-response") ??
    headers.get("payment-response") ??
    headers.get("x402-payment-response") ??
    "";

  if (!header) {
    return null;
  }

  try {
    const paymentResponse = decodePaymentResponseHeader(header);

    return (
      paymentResponse.errorMessage ??
      paymentResponse.errorReason ??
      getReadableErrorMessage(JSON.stringify(paymentResponse))
    );
  } catch {
    return getReadableErrorMessage(header);
  }
}

function getReadableErrorMessage(text: string) {
  if (!text.trim()) {
    return null;
  }

  const parsed = parseJson(text);

  if (!parsed) {
    return text.trim();
  }

  const candidate = findStringValue(parsed, [
    "error",
    "errorMessage",
    "errorReason",
    "message",
    "reason",
    "resource",
    "detail",
    "details",
    "cause",
  ]);

  if (candidate && isUsefulErrorMessage(candidate)) {
    return candidate.trim();
  }

  if (isUsefulErrorMessage(text)) {
    return text.trim();
  }

  return null;
}

function getReadableErrorFromPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "Payment details could not be loaded from the x402 endpoint.";
  }

  const message = findStringValue(payload, [
    "error",
    "errorMessage",
    "message",
    "reason",
    "resource",
  ]);

  return (
    message ?? "Payment details could not be loaded from the x402 endpoint."
  );
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function findStringValue(value: unknown, keys: string[]): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nested = findStringValue(item, keys);

      if (nested) {
        return nested;
      }
    }

    return null;
  }

  const record = value as Record<string, unknown>;

  for (const key of keys) {
    const item = record[key];

    if (typeof item === "string") {
      return item;
    }
  }

  for (const item of Object.values(record)) {
    const nested = findStringValue(item, keys);

    if (nested) {
      return nested;
    }
  }

  return null;
}

function isUsefulErrorMessage(message: string | null | undefined) {
  if (!message) {
    return false;
  }

  const normalized = message.trim().toLowerCase();

  return (
    normalized.length > 3 &&
    normalized !== "exact" &&
    normalized !== "false" &&
    normalized !== "true"
  );
}
