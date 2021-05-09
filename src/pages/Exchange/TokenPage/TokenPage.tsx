import React, { useContext, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Button, ButtonGroup, InputGroup } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import chevronLeft from '../../../assets/chevron_left.svg';
import {
  generateStockPrice,
  getStyledChartOptions,
} from '../../../components/Instruments/InstrumentItem/InstrumentItem.utils';
import { TextSkeleton } from '../../../components/Skeleton/TextSkeleton';
import { ExchangeContext } from '../ExchangeContext';

import { TopControls } from './TopControls';

import styles from './TokenPage.module.scss';

import cx from 'classnames';

export const TokenPage = () => {
  const { instrument, isLoading, firstTokenRef, secondTokenRef } = useContext(ExchangeContext);

  const history = useHistory();
  const [range, prices] = useMemo(
    () => generateStockPrice(instrument?.name || '', Number(instrument?.spotPrice)),
    [instrument]
  );

  return (
    <div className="d-flex flex-column w-100">
      <TopControls />
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
                  opposite: true,
                  decimalsInFloat: 10,
                  logarithmic: true,
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
