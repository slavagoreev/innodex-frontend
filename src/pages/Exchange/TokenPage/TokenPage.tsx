import React, { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import chevronLeft from '../../../assets/chevron_left.svg';
import {
  generateStockPrice,
  getStyledChartOptions,
} from '../../../components/Instruments/InstrumentItem/InstrumentItem.utils';
import { TextSkeleton } from '../../../components/Skeleton/TextSkeleton';
import { useInnoDEX } from '../../../ethereum/innodex/impl';
import { InstrumentImpl } from '../../../ethereum/instrument/impl';
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

  useEffect(() => {
    setLoading(true);

    const impl = new InstrumentImpl(innoDEX.account, params.id);

    impl
      .getMetadata()
      .then(setInstrument)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className={cx(styles.content, 'd-flex flex-column h-100 w-100')}>
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="light"
          style={{ borderRadius: '50%', padding: '4px 5px', marginRight: 15 }}
          onClick={() => history.push('/')}
        >
          <img src={chevronLeft} width={24} height={24} />
        </Button>
        <TextSkeleton width={110} height={18}>
          {!isLoading && instrument && <h5 className="mb-0">Trading pair «{instrument.name}»</h5>}
        </TextSkeleton>
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
                  easing: 'easein',
                  animateGradually: {
                    enabled: true,
                    delay: 10,
                  },
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
  );
};
