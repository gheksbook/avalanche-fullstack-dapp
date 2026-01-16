'use client';

import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useChainId
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { toast, Toaster } from 'sonner';
import { avalancheFuji } from 'wagmi/chains';

const CONTRACT_ADDRESS = '0x072e33661a358e794f17745a1ac746374ffd0146';

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [inputValue, setInputValue] = useState('');
  const chainId = useChainId();

  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  const {
    writeContract,
    isPending: isWriting,
  } = useWriteContract();

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() });
      toast.success('Wallet connected!');
    } catch {
      toast.error('Failed to connect wallet');
    }
  };

  const handleSetValue = async () => {
    if (!inputValue) return;

    if (chainId !== avalancheFuji.id) {
      toast.error('Wrong network! Switch to Fuji Testnet');
      return;
    }

    toast('Waiting for wallet approval...');

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [BigInt(inputValue)],
      });

      toast.success('Transaction sent!');
      setTimeout(() => refetch(), 1500);
    } catch (err: any) {
      if (err?.code === 4001) {
        toast.warning('Transaction rejected by user');
      } else {
        toast.error('Transaction failed');
      }
    }
  };

  return (
    <main className="app-container">
  <Toaster richColors position="top-center" />
  <div className="card">
    <h1 className="heading">Day 3 – Avalanche dApp</h1>

    {!isConnected ? (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="btn btn-connect"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    ) : (
      <div className="wallet-box">
        <span className="wallet-label">Wallet Address</span>
        <span className="wallet-address">{shorten(address!)}</span>

        <button
          onClick={() => {
            disconnect();
            toast.info('Wallet disconnected');
          }}
          className="btn btn-disconnect"
        >
          Disconnect Wallet
        </button>
      </div>
    )}

    <div className="section">
      <span className="section-label">Stored Value</span>
      {isReading ? (
        <span className="value loading">Loading...</span>
      ) : (
        <span className="value">{value?.toString()}</span>
      )}
      <button className="btn-link" onClick={() => refetch()}>
        Refresh
      </button>
    </div>

    <div className="section">
      <span className="section-label">Update Value</span>
      <input
        type="number"
        value={inputValue}
        placeholder="Enter new value"
        onChange={(e) => setInputValue(e.target.value)}
        className="input"
      />

      <button
        onClick={handleSetValue}
        disabled={isWriting}
        className="btn btn-action"
      >
        {isWriting ? 'Updating...' : 'Set Value'}
      </button>
    </div>

    <p className="footer-note">
      Smart contract = single source of truth
    </p>
  </div>
</main>

  );
}
