import { Instrument } from '../types/Instrument';

import abi from './abi.json';
import { BaseEthereum, configureEthereum } from './lib';

import { AbiItem } from 'web3-utils';

const address = '0x29723Ac634583D8e7332eF0554A5b4857674701e';

class Ethereum extends BaseEthereum {
  constructor(account: string) {
    super(account, address, abi as AbiItem[]);
  }

  async getInstrument(assetAddress: string): Promise<Instrument> {
    return await this.contract.methods
      .getInstrument(assetAddress, '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5')
      .call({ from: this.account });
  }

  // async buyImage (title: string, url: string): Promise<Image> {
  //   return await this.contract.methods.buyImage(title, url).send({ from: this.account, value: 10**18 })
  // }

  async getAllInstruments(): Promise<string[]> {
    return await this.contract.methods.getAllInstruments().call({ from: this.account });
  }
}

const { useEthereumInit, useEthereum } = configureEthereum(Ethereum);

export { useEthereumInit, useEthereum };
