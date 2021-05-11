import { BaseEthereum } from '../lib';

import abi from './abi.json';

import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

export class Token extends BaseEthereum {
  tokenName = '';
  symbol = '';
  decimals = 5;
  accountBalance = '';

  constructor(account: string, public address: string) {
    super(account, address, abi as AbiItem[]);

    this.name().then((name) => (this.tokenName = name));
    this.getAccountBalance();
    this.getSymbol();
  }

  async getAccountBalance(): Promise<string> {
    const decimals = await this.getDecimals();

    const balanceInWEI = await this.contract.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    this.accountBalance = String(balanceInWEI / 10 ** decimals);

    return this.accountBalance;
  }

  async approveAccess(instrumentAddress: string): Promise<number> {
    return await this.contract.methods
      .approve(instrumentAddress, Web3.utils.toWei('100000000000000000000'))
      .send({ from: this.account });
  }

  async name(): Promise<string> {
    return await this.contract.methods.name().call({ from: this.account });
  }

  async getSymbol(): Promise<string> {
    this.symbol = await this.contract.methods.symbol().call({ from: this.account });

    return this.symbol;
  }

  async getDecimals(): Promise<number> {
    this.decimals = await this.contract.methods.decimals().call({ from: this.account });

    return this.decimals;
  }

  async checkAllowance(instrumentAddress: string): Promise<number> {
    return await this.contract.methods
      .allowance(this.account, instrumentAddress)
      .call({ from: this.account });
  }
}
