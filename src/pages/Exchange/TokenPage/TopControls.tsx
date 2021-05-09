import React, { useContext } from 'react';
import { Button, ButtonGroup, InputGroup } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { TextSkeleton } from '../../../components/Skeleton/TextSkeleton';
import { ExchangeContext } from '../ExchangeContext';

import styles from './TokenPage.module.scss';

import cx from 'classnames';

export const TopControls = () => {
  const params = useParams<{ id: string }>();
  const {
    instrument,
    isLoading,
    firstTokenRef,
    secondTokenRef,
    isBuyLoading,
    setBuyLoading,
    buyAllowed,
    setBuyAllowance,
    isSellLoading,
    setSellLoading,
    sellAllowed,
    setSellAllowance,
  } = useContext(ExchangeContext);
  const history = useHistory();

  const handleBuyClick = async () => {
    if (buyAllowed) {
      history.push(`/order-book/${params.id}/#buy`);
    } else if (instrument) {
      setBuyLoading(true);
      await firstTokenRef.current?.approveAccess(instrument.address);
      await firstTokenRef.current?.getAccountBalance();
      setBuyLoading(false);
      setBuyAllowance(true);
    }
  };

  const handleSellClick = async () => {
    if (sellAllowed) {
      history.push(`/order-book/${params.id}/#sell`);
    } else if (instrument) {
      setSellLoading(true);
      await secondTokenRef.current?.approveAccess(instrument.address);
      await secondTokenRef.current?.getAccountBalance();
      setSellLoading(false);
      setSellAllowance(true);
    }
  };

  return (
    <div className={cx(styles.topButtons, 'mb-4')}>
      <TextSkeleton height={33} width={180} className="mr-3" count={2}>
        {!isLoading && firstTokenRef.current && secondTokenRef.current && (
          <>
            <ButtonGroup size="sm" className="mr-3">
              <Button
                disabled={isBuyLoading || Number(secondTokenRef.current?.accountBalance) === 0}
                variant="secondary"
                onClick={handleBuyClick}
              >
                {buyAllowed ? 'Buy' : `Allow buying ${firstTokenRef.current?.tokenName}`}
              </Button>
              <Button
                disabled={isSellLoading || Number(firstTokenRef.current?.accountBalance) === 0}
                variant="secondary"
                onClick={handleSellClick}
              >
                {sellAllowed ? 'Sell' : `Allow selling ${secondTokenRef.current?.tokenName}`}
              </Button>
              {buyAllowed && (
                <InputGroup.Prepend>
                  <InputGroup.Text className={styles.tokenName}>
                    Balance {firstTokenRef.current?.accountBalance} {firstTokenRef.current?.symbol}
                  </InputGroup.Text>
                </InputGroup.Prepend>
              )}
            </ButtonGroup>
            {sellAllowed && (
              <ButtonGroup size="sm" className="mr-3">
                <InputGroup.Prepend>
                  <InputGroup.Text className={styles.tokenName}>
                    Balance {secondTokenRef.current?.accountBalance}{' '}
                    {secondTokenRef.current?.symbol}
                  </InputGroup.Text>
                </InputGroup.Prepend>
              </ButtonGroup>
            )}
          </>
        )}
      </TextSkeleton>
    </div>
  );
};
