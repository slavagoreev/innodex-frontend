import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { NavLink } from 'react-router-dom';

import { Instrument } from '../../../types/Instrument';
import { weiToPrice } from '../../../utils/priceUtils';

import {
  defaultChartOptions,
  generateStockPrice,
  getStyledChartOptions,
} from './InstrumentItem.utils';

import styles from './InstrumentItem.module.scss';

import cx from 'classnames';

export type InstrumentItemProps = {
  decimals: number;
  instrument: Instrument;
  onSelect: (instrument: Instrument) => void;
};

export const InstrumentItem = ({ decimals, instrument, onSelect }: InstrumentItemProps) => {
  const [range, prices] = useMemo(
    () => generateStockPrice(instrument.name, Number(instrument.spotPrice)),
    [instrument]
  );

  return (
    <NavLink
      to={`/token/${instrument.address}`}
      activeClassName={styles.itemActive}
      className={cx(styles.item, 'd-flex justify-content-between align-items-center')}
      onClick={() => onSelect(instrument)}
    >
      <div className={styles.data}>
        <h6>{instrument.name}</h6>
        <p className={styles.spot}>{instrument.spotPrice * 10 ** decimals} WETH</p>
      </div>
      <div className={cx(styles.chart, 'd-none d-lg-flex')}>
        <Chart
          options={{
            ...defaultChartOptions,
            ...getStyledChartOptions(prices[0] < prices[prices.length - 1] ? '#cf3a51' : '#229717'),
            xaxis: {
              categories: range,
              type: 'datetime',
            },
          }}
          series={[{ name: instrument.name, data: prices }]}
          type="area"
          width="100"
          height="50"
        />
      </div>
    </NavLink>
  );
};
