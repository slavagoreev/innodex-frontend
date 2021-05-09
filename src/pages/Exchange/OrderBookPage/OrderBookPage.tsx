import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import chevronLeft from '../../../assets/chevron_left.svg';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { TextSkeleton } from '../../../components/Skeleton/TextSkeleton';
import { useInnoDEX } from '../../../ethereum/innodex/impl';
import { InstrumentImpl } from '../../../ethereum/instrument/impl';
import { Instrument } from '../../../types/Instrument';
import { OrderBookQty } from '../../../types/OrderBookQty';
import { ExchangeContext } from '../ExchangeContext';
import { TopControls } from '../TokenPage/TopControls';

import { CreateOrderModal } from './CreateOrderModal';

import styles from './OrderBookPage.module.scss';

import cx from 'classnames';

export const OrderBookSkeletons = () => (
  <>
    {Array(10)
      .fill(0)
      .map((_, id) => (
        <Skeleton key={id} randomizeWidth height={24} style={{ marginBottom: 5 }} />
      ))}
  </>
);

const _OrderBookPage = () => {
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const { instrumentInstanceRef, instrument } = useContext(ExchangeContext);
  const [order, setOrder] = useState<OrderBookQty | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBookQty[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const [show, setShow] = useState(false);

  useEffect(() => {
    setLoading(true);
    instrumentInstanceRef.current
      ?.getOrderBookRecords()
      .then(setOrderBook)
      .finally(() => setLoading(false));
  }, [params.id]);

  const sortedOrderBook = orderBook.sort((a, b) => b.qty - a.qty);
  const maxPrice = sortedOrderBook.length > 0 ? sortedOrderBook[0].qty : 1;

  return (
    <div className="d-flex flex-column w-100 h-100">
      <TopControls />
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
            {!isLoading && instrument && (
              <h5 className="mb-0">Order book for «{instrument.name}»</h5>
            )}
          </TextSkeleton>
        </div>
        {!isLoading && instrument ? (
          <div className={styles.orderBook}>
            {orderBook.map((item) => (
              <div
                key={item.price}
                onClick={() => {
                  setShow(true);
                  setOrder(item);
                }}
                className={cx(
                  styles.order,
                  item.price / 10 ** 18 > instrument.spotPrice && styles.orderBid
                )}
              >
                <span className={styles.orderCount} style={{ flexGrow: item.price / maxPrice }}>
                  {item.qty}
                </span>
                <span className={styles.orderPrice}>{item.price / 10 ** 18} WETH</span>
              </div>
            ))}
          </div>
        ) : (
          <OrderBookSkeletons />
        )}

        <CreateOrderModal order={order} show={show} setShow={setShow} />
      </div>
    </div>
  );
};

export const OrderBookPage = memo(_OrderBookPage);
