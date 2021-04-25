import React, { ReactElement, useState } from 'react';
import { Button } from 'react-bootstrap';

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
    const [account, setAccount] = useState<string | undefined>(undefined);

    if (window.ethereum === undefined) {
      return <>Metamask is not installed</>;
    }

    if (!account) {
      return <MetamaskRequest onAccount={(x: string) => setAccount(x)} />;
    }

    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();

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

  return <Button onClick={connectMetamask}>Connect MetaMask account</Button>;
}
