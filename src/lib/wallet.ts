type WalletConnector = {
  id: string;
  name: string;
  rdns?: string | readonly string[];
};

const walletRequestTimeoutMs = 90_000;

export function getPreferredWalletConnector<T extends WalletConnector>(
  connectors: readonly T[],
) {
  return (
    connectors.find(isMetaMaskConnector) ??
    connectors.find((connector) => connector.id === "injected") ??
    connectors[0]
  );
}

function isMetaMaskConnector(connector: WalletConnector) {
  const rdnsValues = Array.isArray(connector.rdns)
    ? connector.rdns
    : connector.rdns
      ? [connector.rdns]
      : [];

  return (
    connector.id.toLowerCase().includes("metamask") ||
    connector.name.toLowerCase().includes("metamask") ||
    rdnsValues.some((rdns) => rdns.toLowerCase().includes("metamask"))
  );
}

export async function withWalletTimeout<T>(
  promise: Promise<T>,
  timeoutMessage: string,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error(timeoutMessage)),
          walletRequestTimeoutMs,
        );
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export function getWalletErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }

  if (error.message.includes("Provider not found")) {
    return "No browser wallet was detected.";
  }

  const lowerMessage = error.message.toLowerCase();

  if (lowerMessage.includes("user rejected") || lowerMessage.includes("user denied")) {
    return "Wallet request was cancelled.";
  }

  return error.message;
}
