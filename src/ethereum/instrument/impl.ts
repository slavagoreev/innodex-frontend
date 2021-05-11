import { Instrument } from '../../types/Instrument';
import { OrderBookQty } from '../../types/OrderBookQty';
import { BaseEthereum } from '../lib';

import abi from './abi.json';
import bytecode from './instrument_bytecode.json';

import { AbiItem } from 'web3-utils';

export class InstrumentImpl extends BaseEthereum {
  constructor(account: string, public address: string) {
    super(account, address || '0xB9a2B41203F8A03eb41F2e386D0f9bF619ABacFE', abi as AbiItem[]);
  }

  async getSpotPrice(type = 1): Promise<number> {
    // false = bid spot price
    return await this.contract.methods.getSpotPrice(type).call({ from: this.account });
  }

  async getMetadata(): Promise<Instrument> {
    const { ...data }: Instrument = await this.contract.methods
      .getMetadata()
      .call({ from: this.account });

    data.address = this.address;
    data.spotPrice = (await this.getSpotPrice()) / 10 ** 18;

    return data;
  }

  async getOrderBookRecords(): Promise<OrderBookQty[]> {
    return await this.contract.methods.getOrderBookRecords().call({ from: this.account });
  }

  async limitOrder(toBuy: boolean, price: number, qty: number, flags: number): Promise<string> {
    return await this.contract.methods
      .limitOrder(toBuy, price, qty, flags)
      .send({ from: this.account });
  }

  async marketOrder(toBuy: boolean, qty: number): Promise<string> {
    return await this.contract.methods.marketOrder(toBuy, qty).send({ from: this.account });
  }

  async marketOrderTryout(toBuy: boolean, qty: number): Promise<string> {
    return await this.contract.methods.marketOrder(toBuy, qty).call({ from: this.account });
  }
}

export function createContract(
  asset1: string,
  asset2 = '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5',
  priceStep = 1
) {
  const contract = new window.web3.eth.Contract(abi as AbiItem[]);

  return contract.deploy({
    data: bytecode.object,
    arguments: [asset1, asset2, priceStep],
  });
}
