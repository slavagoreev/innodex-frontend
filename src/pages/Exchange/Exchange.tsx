import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Route } from 'react-router-dom';

import { AddInstrument } from '../../components/Instruments/AddInstrument';
import { InstrumentItem } from '../../components/Instruments/InstrumentItem/InstrumentItem';
import { WrapEther } from '../../components/Instruments/WrapEther';
import { TextSkeleton } from '../../components/Skeleton/TextSkeleton';

import { EmptyExchange } from './EmptyExchange/EmptyExchange';
import { OrderBookPage } from './OrderBookPage/OrderBookPage';
import { TokenPage } from './TokenPage/TokenPage';
import { ExchangeContext } from './ExchangeContext';

import styles from './Exchange.module.scss';

export const Exchange = () => {
  const { instruments, selectedItem, setSelectedItem, firstTokenRef } = useContext(ExchangeContext);

  return (
    <main>
      <Row>
        <Col md={selectedItem ? 3 : 5} lg={4}>
          <div className="d-flex align-items-center mb-4">
            <h3 className="mr-3 mb-0" style={{ height: 35 }}>
              InnoDEX
            </h3>
          </div>
          <div className={styles.list}>
            {instruments.length > 0 ? (
              instruments.map((instrument) => (
                <InstrumentItem
                  key={instrument.name}
                  decimals={firstTokenRef.current?.decimals || 5}
                  instrument={instrument}
                  onSelect={setSelectedItem}
                />
              ))
            ) : (
              <TextSkeleton width="100%" height={80} style={{ marginBottom: 10 }} count={1} />
            )}
            <AddInstrument />
            <WrapEther />
          </div>
        </Col>
        <Col md={selectedItem ? 9 : 7} lg={8} className="d-flex align-items-center">
          <Route exact path="/" component={EmptyExchange} />
          <Route exact path="/token/:id" component={TokenPage} />
          <Route exact path="/order-book/:id" component={OrderBookPage} />
        </Col>
      </Row>
    </main>
  );
};
