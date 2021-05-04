import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

import { Instrument } from '../../../types/Instrument';

import { defaultChartOptions, generateStockPrice } from './InstrumentItem.utils';

import styles from './InstrumentItem.module.scss';

import cx from 'classnames';

export type InstrumentItemProps = { instrument: Instrument };

export const InstrumentItem = ({ instrument }: InstrumentItemProps) => {
  const [range, prices] = useMemo(generateStockPrice, []);

  return (
    <div className={cx(styles.item, 'd-flex justify-content-between align-items-center')}>
      <div className={styles.data}>
        <h6>{instrument.name}</h6>
        <p className={styles.spot}>59.3 WETH</p>
      </div>
      <div className={styles.chart}>
        <Chart
          options={{
            ...defaultChartOptions,
            xaxis: { categories: range },
          }}
          series={[{ name: instrument.name, data: prices }]}
          type="area"
          width="100"
          height="50"
        />
      </div>
    </div>
  );
};
