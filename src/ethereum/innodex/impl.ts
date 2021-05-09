import { Instrument } from '../../types/Instrument';
import { InstrumentImpl } from '../instrument/impl';
import { BaseEthereum, configureEthereum } from '../lib';

import abi from './abi.json';

import { AbiItem } from 'web3-utils';

const address = '0xa10Df981b12479dD27CF9c04aA5B342e1E30a5c3';

export class InnoDEX extends BaseEthereum {
  constructor(account: string) {
    super(account, address, abi as AbiItem[]);
  }

  async getInstrument(assetAddress: string): Promise<Instrument> {
    return await this.contract.methods
      .getInstrument(assetAddress, '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5')
      .call({ from: this.account });
  }

  async addInstrument(instrumentAddress: string): Promise<InstrumentImpl> {
    return await this.contract.methods
      .addInstrument(instrumentAddress)
      .send({ from: this.account });
  }

  async getAllInstruments(): Promise<string[]> {
    return await this.contract.methods.getAllInstruments().call({ from: this.account });
  }
}

const { useEthereumInit, useEthereum: useInnoDEX } = configureEthereum(InnoDEX);

export { useEthereumInit, useInnoDEX };
