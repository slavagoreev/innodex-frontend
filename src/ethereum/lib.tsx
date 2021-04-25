import React, { ReactElement, useState } from 'react';
import { Button } from 'react-bootstrap';

import { FullScreenPlate } from '../components/Misc/FullScreenPlate';
import { LoadingScreen } from '../components/Misc/LoadingScreen';

import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

declare global {
  interface Window {
    web3: Web3;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}

export class BaseEthereum {
  constructor(
    public account: string,
    address: string,
    abi: AbiItem[] | AbiItem,
    protected contract = new window.web3.eth.Contract(abi, address)
  ) {
    window.web3.defaultAccount = account;
  }
}

export function configureEthereum<T extends BaseEthereum>(Adapter: { new (account: string): T }) {
  let ethereum: T | undefined = undefined;

  function useEthereumInit(): ReactElement | undefined {
    const [isLoading, setLoading] = useState(true);
    const [account, setAccount] = useState<string | undefined>(undefined);

    if (window.ethereum === undefined) {
      return (
        <FullScreenPlate>
          <h3>MetaMask is not installed</h3>
        </FullScreenPlate>
      );
    }

    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((x: string[]) => {
        setAccount(x[0]);
      })
      .finally(() => setLoading(false));

    if (isLoading) {
      return <LoadingScreen />;
    }

    if (!account) {
      return <MetamaskRequest onAccount={(x: string) => setAccount(x)} />;
    }

    window.web3 = new Web3(window.ethereum);

    ethereum = new Adapter(account);
  }

  function useEthereum(): T {
    return ethereum as T;
  }

  return { useEthereumInit, useEthereum };
}

function MetamaskRequest({ onAccount }: { onAccount: (x: string) => void }) {
  function connectMetamask() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((x: string[]) => onAccount(x[0]));
  }

  return (
    <FullScreenPlate>
      <h3>MetaMask integration required</h3>
      <h5 className="text-muted mb-4">
        Please, log in using your MetaMask account to start trading
      </h5>
      <Button className="d-inline-block" variant="outline-secondary" onClick={connectMetamask}>
        Connect MetaMask account
      </Button>
    </FullScreenPlate>
  );
}
