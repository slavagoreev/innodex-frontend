import abi from './abi.json';
import { BaseEthereum, configureEthereum } from './lib';

import { AbiItem } from 'web3-utils';

const address = '0x29723Ac634583D8e7332eF0554A5b4857674701e';

class Ethereum extends BaseEthereum {
  constructor(account: string) {
    super(account, address, abi as AbiItem[]);
  }

  // async getImage (id: number): Promise<Image> {
  //   return await this.contract.methods.images(id).call({ from: this.account })
  // }
  //
  // async buyImage (title: string, url: string): Promise<Image> {
  //   return await this.contract.methods.buyImage(title, url).send({ from: this.account, value: 10**18 })
  // }
  //
  // async getAllImages (): Promise<Image[]> {
  //   return (await this.contract.methods.getAllImages().call({ from: this.account })).filter((x: Image) => x.is_claimed)
  //   // const promises = []
  //   // for (let i = 1; i < 1001; i++) {
  //   //   promises.push(this.getImage(i))
  //   // }
  //   // return (await Promise.all(promises)).filter(x => x.is_claimed)
  // }
}

const { useEthereumInit, useEthereum } = configureEthereum(Ethereum);

export { useEthereumInit, useEthereum };
