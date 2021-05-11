import React, { useContext, useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import chevronLeft from '../../../assets/chevron_left.svg';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { TextSkeleton } from '../../../components/Skeleton/TextSkeleton';
import { OrderBookQty } from '../../../types/OrderBookQty';
import { formatPrice, weiToPrice } from '../../../utils/priceUtils';
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

export const OrderBookPage = () => {
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const { instrumentInstanceRef, instrument, firstTokenRef } = useContext(ExchangeContext);
  const [order, setOrder] = useState<OrderBookQty | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBookQty[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const isBuy = location.hash.includes('buy');

  const [show, setShow] = useState(false);

  useEffect(() => {
    instrumentInstanceRef.current
      ?.getOrderBookRecords()
      .then((list) => {
        return list.map((el) => ({
          price: Number(el.price),
          qty: Number(el.qty),
          orderType: Number(el.orderType),
        }));
      })
      .then(setOrderBook)
      .finally(() => setLoading(false));
  }, [params.id, show]);

  const sortedByQty = sortBy(orderBook, 'qty').reverse();
  const sortedByPrice = sortBy(orderBook, 'price').reverse();

  const maxQty = sortedByQty.length > 0 ? sortedByQty[0].qty : 1;

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
              <h5 className="mb-0">
                {isBuy ? 'Buy' : 'Sell'} {firstTokenRef.current?.tokenName}
              </h5>
            )}
          </TextSkeleton>
        </div>
        {!isLoading && instrument ? (
          <>
            <div className={styles.orderBook}>
              {sortedByPrice.map((item) => (
                <div
                  key={item.price}
                  onClick={() => {
                    setShow(true);
                    setOrder(item);
                  }}
                  className={cx(styles.order, item.orderType === 0 && styles.orderBid)}
                >
                  <span
                    className={styles.orderCount}
                    style={{ width: `${(item.qty / maxQty) * 100}%` }}
                  >
                    {formatPrice(
                      item.qty / 10 ** (firstTokenRef.current?.decimals || 5),
                      firstTokenRef.current?.decimals
                    )}
                  </span>
                  <span className={styles.orderPrice}>{weiToPrice(item.price)} WETH</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-3">
              <Button variant="primary" onClick={() => setShow(true)}>
                {isBuy ? 'Buy' : 'Sell'} {firstTokenRef.current?.symbol}
              </Button>
            </div>
          </>
        ) : (
          <OrderBookSkeletons />
        )}

        <CreateOrderModal order={order} show={show} setShow={setShow} />
      </div>
    </div>
  );
};
