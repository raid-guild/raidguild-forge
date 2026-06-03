type WalletConnector = {
  id: string;
  name: string;
  rdns?: string | readonly string[];
};

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
