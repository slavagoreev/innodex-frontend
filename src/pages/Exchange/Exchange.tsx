import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Route } from 'react-router-dom';

import { AddInstrument } from '../../components/Instruments/AddInstrument';
import { InstrumentItem } from '../../components/Instruments/InstrumentItem/InstrumentItem';
import { TextSkeleton } from '../../components/Skeleton/TextSkeleton';
import { useInnoDEX } from '../../ethereum/innodex/impl';
import { InstrumentImpl } from '../../ethereum/instrument/impl';
import { Instrument } from '../../types/Instrument';

import { EmptyExchange } from './EmptyExchange/EmptyExchange';
import { TokenPage } from './TokenPage/TokenPage';

import styles from './Exchange.module.scss';

export const Exchange = () => {
  const innoDEX = useInnoDEX();
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [instrumentInstances, setInstances] = useState<InstrumentImpl[]>([]);

  const [selectedItem, setSelectedItem] = useState<Instrument | boolean | null>(
    location.pathname.includes('token')
  );

  useEffect(() => {
    innoDEX.getAllInstruments().then((list) => {
      localStorage.setItem('instrumentAddressesCount', String(list.length));

      const instanceList = list.map((address) => new InstrumentImpl(innoDEX.account, address));

      setInstances(instanceList);

      Promise.all(instanceList.map((instance) => instance.getMetadata())).then(setInstruments);
    });
  }, []);

  useEffect(() => {
    setSelectedItem(location.pathname.includes('token'));
  }, [location.pathname]);

  return (
    <main>
      <Row>
        <Col md={selectedItem ? 3 : 5} lg={4}>
          <div className="d-flex align-items-center mb-4">
            <h3 className="mr-3 mb-0">InnoDEX</h3>
          </div>
          <div className={styles.list}>
            {instruments.length > 0 ? (
              instruments.map((instrument) => (
                <InstrumentItem
                  key={instrument.name}
                  instrument={instrument}
                  onSelect={setSelectedItem}
                />
              ))
            ) : (
              <TextSkeleton width="100%" height={80} style={{ marginBottom: 10 }} count={3} />
            )}
            <AddInstrument
              innoDEX={innoDEX}
              setInstruments={setInstruments}
              setInstances={setInstances}
            />
          </div>
        </Col>
        <Col md={selectedItem ? 9 : 7} lg={8} className="d-flex align-items-center">
          <Route exact path="/" component={EmptyExchange} />
          <Route exact path="/token/:id" component={TokenPage} />
        </Col>
      </Row>
    </main>
  );
};
