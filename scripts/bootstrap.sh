#!/usr/bin/env bash
set -euo pipefail

echo "🚀 De-concierge bootstrap starting..."

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found. Please install pnpm (https://pnpm.io/installation) and re-run."
  exit 1
fi

pnpm install

echo "✅ Workspace dependencies installed."
echo "Next steps:"
echo "  1. Scaffold contracts in packages/contracts (Scaffold-ETH 2)."
echo "  2. Scaffold Next.js frontend in packages/frontend."
echo "  3. Install service dependencies in packages/services."

