import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import { AddInstrument } from '../../components/Instruments/AddInstrument';
import { InstrumentItem } from '../../components/Instruments/InstrumentItem/InstrumentItem';
import { TextSkeleton } from '../../components/Skeleton/TextSkeleton';
import { useInnoDEX } from '../../ethereum/innodex/impl';
import { InstrumentImpl } from '../../ethereum/instrument/impl';
import { Instrument } from '../../types/Instrument';

import styles from './Exchange.module.scss';

export const Exchange = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [instrumentInstances, setInstances] = useState<InstrumentImpl[]>([]);
  const innoDEX = useInnoDEX();

  useEffect(() => {
    innoDEX.getAllInstruments().then((list) => {
      localStorage.setItem('instrumentAddressesCount', String(list.length));

      const instanceList = list.map((address) => new InstrumentImpl(innoDEX.account, address));

      setInstances(instanceList);

      Promise.all(instanceList.map((instance) => instance.getMetadata())).then(setInstruments);
    });
  }, []);

  return (
    <main>
      <div className="d-flex align-items-center mb-3">
        <h1 className="mr-3">Exchange</h1>
        <AddInstrument
          innoDEX={innoDEX}
          setInstruments={setInstruments}
          setInstances={setInstances}
        />
      </div>
      <Row>
        <Col md={5} lg={4}>
          <div className={styles.list}>
            {instruments.length > 0 ? (
              instruments.map((instrument) => (
                <InstrumentItem key={instrument.name} instrument={instrument} />
              ))
            ) : (
              <TextSkeleton width="100%" height={80} style={{ marginBottom: 10 }} count={3} />
            )}
          </div>
        </Col>
      </Row>
    </main>
  );
};
