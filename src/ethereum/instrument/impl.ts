import { Instrument } from '../../types/Instrument';
import { BaseEthereum } from '../lib';

import abi from './abi.json';
import bytecode from './instrument_bytecode.json';

import { AbiItem } from 'web3-utils';

export class InstrumentImpl extends BaseEthereum {
  constructor(account: string, address?: string) {
    super(account, address || '0xEf784c5F412891f63A0Fd0d917bA4c5F41dB7887', abi as AbiItem[]);
  }

  async getMetadata(): Promise<Instrument> {
    return await this.contract.methods.getMetadata().call({ from: this.account });
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
