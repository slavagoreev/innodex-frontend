import React, { memo, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import chevronLeft from '../../../assets/chevron_left.svg';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { TextSkeleton } from '../../../components/Skeleton/TextSkeleton';
import { useInnoDEX } from '../../../ethereum/innodex/impl';
import { InstrumentImpl } from '../../../ethereum/instrument/impl';
import { Instrument } from '../../../types/Instrument';
import { OrderBookQty } from '../../../types/OrderBookQty';

import styles from './OrderBookPage.module.scss';

import cx from 'classnames';

export const OrderBookSkeletons = () => (
  <>
    {Array(10)
      .fill(0)
      .map((_, id) => (
        <Skeleton key={id} randomizeWidth height={20} style={{ marginBottom: 5 }} />
      ))}
  </>
);

const _OrderBookPage = () => {
  const innoDEX = useInnoDEX();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [orderBook, setOrderBook] = useState<OrderBookQty[]>([]);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const impl = new InstrumentImpl(innoDEX.account, params.id);

    impl
      .getMetadata()
      .then((item) => {
        setInstrument(item);

        impl
          .getOrderBookRecords()
          .then(setOrderBook)
          .finally(() => setLoading(false));
      })
      .catch(() => setLoading(false));
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
      {!isLoading && instrument ? (
        orderBook.map((item) => (
          <div key={item.price}>
            {item.price} — {item.qty}
          </div>
        ))
      ) : (
        <OrderBookSkeletons />
      )}
    </div>
  );
};

export const OrderBookPage = memo(_OrderBookPage);
