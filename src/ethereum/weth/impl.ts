import { Instrument } from '../../types/Instrument';
import { OrderBookQty } from '../../types/OrderBookQty';
import { BaseEthereum } from '../lib';

import abi from './abi.json';
import bytecode from './instrument_bytecode.json';

import { AbiItem } from 'web3-utils';

export class WETHImpl extends BaseEthereum {
  constructor(
    public account: string,
    public address = '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5'
  ) {
    super(account, address, abi as AbiItem[]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async convert(amount: any): Promise<number> {
    return await this.contract.methods.deposit().send({ from: this.account, value: amount });
  }

  async balanceOf(): Promise<number> {
    return await this.contract.methods.balanceOf(this.account).call({ from: this.account });
  }
}
