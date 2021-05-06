import { BaseEthereum } from '../lib';

import abi from './abi.json';

import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

export class Token extends BaseEthereum {
  tokenName = '';
  symbol = '';
  accountBalance = '';

  constructor(account: string, public address: string) {
    super(account, address, abi as AbiItem[]);

    this.name().then((name) => (this.tokenName = name));
    this.getAccountBalance();
    this.getSymbol();
  }

  async getAccountBalance(): Promise<string> {
    const balanceInWEI = await this.contract.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    this.accountBalance = Web3.utils.fromWei(balanceInWEI);

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

  async checkAllowance(instrumentAddress: string): Promise<number> {
    return await this.contract.methods
      .allowance(this.account, instrumentAddress)
      .call({ from: this.account });
  }
}
