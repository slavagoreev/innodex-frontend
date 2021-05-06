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

import styles from './OrderBookPage.module.scss';

import cx from 'classnames';

export const OrderBookPage = () => {
  const innoDEX = useInnoDEX();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

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
          onClick={() => history.push(`/token/${params.id}`)}
        >
          <img src={chevronLeft} width={24} height={24} />
        </Button>
        <TextSkeleton width={110} height={18}>
          {!isLoading && instrument && <h5 className="mb-0">Order book for «{instrument.name}»</h5>}
        </TextSkeleton>
      </div>
      <TextSkeleton randomizeWidth height={20} style={{ marginBottom: 5 }} count={20}>
        {!isLoading && instrument && <h1>OrderBook</h1>}
      </TextSkeleton>
    </div>
  );
};
