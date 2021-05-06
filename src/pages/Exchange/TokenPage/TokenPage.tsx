import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import { Button, ButtonGroup, InputGroup } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import chevronLeft from '../../../assets/chevron_left.svg';
import {
  generateStockPrice,
  getStyledChartOptions,
} from '../../../components/Instruments/InstrumentItem/InstrumentItem.utils';
import { TextSkeleton } from '../../../components/Skeleton/TextSkeleton';
import { useInnoDEX } from '../../../ethereum/innodex/impl';
import { InstrumentImpl } from '../../../ethereum/instrument/impl';
import { Token } from '../../../ethereum/token/impl';
import { Instrument } from '../../../types/Instrument';

import styles from './TokenPage.module.scss';

import cx from 'classnames';

export const TokenPage = () => {
  const innoDEX = useInnoDEX();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [range, prices] = useMemo(
    () => generateStockPrice(instrument?.name || '', Number(instrument?.spotPrice) || 100),
    [instrument]
  );

  const instrumentInstanceRef = useRef<InstrumentImpl | null>(null);
  const firstTokenRef = useRef<Token | null>(null);
  const secondTokenRef = useRef<Token | null>(null);

  const [isBuyLoading, setBuyLoading] = useState(false);
  const [buyAllowed, setBuyAllowance] = useState(false);

  const [isSellLoading, setSellLoading] = useState(false);
  const [sellAllowed, setSellAllowance] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      instrumentInstanceRef.current = new InstrumentImpl(innoDEX.account, params.id);

      try {
        const metadata = await instrumentInstanceRef.current?.getMetadata();

        setInstrument(metadata);

        firstTokenRef.current = new Token(innoDEX.account, metadata.firstAssetAddress);
        secondTokenRef.current = new Token(innoDEX.account, metadata.secondAssetAddress);

        setBuyAllowance(Number(await firstTokenRef.current?.checkAllowance(metadata.address)) > 0);
        setSellAllowance(
          Number(await secondTokenRef.current?.checkAllowance(metadata.address)) > 0
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleBuyClick = async () => {
    if (buyAllowed) {
      history.push(`/order-book/${params.id}`);
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
      history.push(`/order-book/${params.id}`);
    } else if (instrument) {
      setSellLoading(true);
      await secondTokenRef.current?.approveAccess(instrument.address);
      await secondTokenRef.current?.getAccountBalance();
      setSellLoading(false);
      setSellAllowance(true);
    }
  };

  return (
    <div className="d-flex flex-column w-100">
      <div className={cx(styles.topButtons, 'mb-4')}>
        <TextSkeleton height={33} width={140} className="mr-3" count={2}>
          {!isLoading && firstTokenRef.current && secondTokenRef.current && (
            <>
              <ButtonGroup size="sm" className="mr-3">
                <Button disabled={isBuyLoading} variant="secondary" onClick={handleBuyClick}>
                  {buyAllowed ? 'Buy' : `Allow buying ${firstTokenRef.current?.tokenName}`}
                </Button>
                {buyAllowed && (
                  <InputGroup.Prepend>
                    <InputGroup.Text className={styles.tokenName}>
                      Balance {firstTokenRef.current?.accountBalance}{' '}
                      {firstTokenRef.current?.symbol}
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                )}
              </ButtonGroup>
              <ButtonGroup size="sm" className="mr-3">
                <Button disabled={isSellLoading} variant="secondary" onClick={handleSellClick}>
                  {sellAllowed ? 'Sell' : `Allow selling ${secondTokenRef.current?.tokenName}`}
                </Button>
                {sellAllowed && (
                  <InputGroup.Prepend>
                    <InputGroup.Text className={styles.tokenName}>
                      Balance {secondTokenRef.current?.accountBalance}{' '}
                      {secondTokenRef.current?.symbol}
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                )}
              </ButtonGroup>
            </>
          )}
        </TextSkeleton>
      </div>
      <div className={cx(styles.content, 'd-flex flex-column h-100 w-100')}>
        <div className="d-flex align-items-center mb-4">
          <Button
            variant="light"
            style={{ borderRadius: '50%', padding: '4px 5px', marginRight: 15 }}
            onClick={() => history.push('/')}
          >
            <img src={chevronLeft} width={24} height={24} />
          </Button>
          <TextSkeleton width={300} height={18}>
            {!isLoading && instrument && (
              <h5 className="mb-0">
                Trading pair «{firstTokenRef.current?.tokenName} /{' '}
                {secondTokenRef.current?.tokenName}»
              </h5>
            )}
          </TextSkeleton>
          <div className="ml-auto">
            <TextSkeleton width={180} height={16}>
              {!isLoading && instrument && <strong>Spot price: {instrument.spotPrice} WETH</strong>}
            </TextSkeleton>
          </div>
        </div>
        <TextSkeleton width="100%" height={300}>
          {!isLoading && instrument && (
            <Chart
              options={{
                ...getStyledChartOptions(
                  prices[0] < prices[prices.length - 1] ? '#cf3a51' : '#229717'
                ),
                yaxis: {
                  decimalsInFloat: 1,
                  opposite: true,
                },
                xaxis: {
                  categories: range,
                  type: 'datetime',
                  labels: {
                    format: 'hh:mm',
                  },
                },
                chart: {
                  toolbar: {
                    show: false,
                  },
                  animations: {
                    enabled: false,
                  },
                  selection: {
                    enabled: true,
                    xaxis: {},
                  },
                },
                tooltip: {
                  x: {
                    format: 'hh:mm d MMM yyyy',
                  },
                  custom({ series, seriesIndex, dataPointIndex, w }) {
                    return `<div class="px-2 py-1">${series[seriesIndex][dataPointIndex]}</div>`;
                  },
                },
              }}
              series={[{ name: instrument.name, data: prices }]}
              type="area"
              width="100%"
              height="300"
            />
          )}
        </TextSkeleton>
      </div>
    </div>
  );
};
