import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import { AddInstrument } from '../components/Instruments/AddInstrument';
import { TextSkeleton } from '../components/Skeleton/TextSkeleton';
import { useInnoDEX } from '../ethereum/innodex/impl';
import { InstrumentImpl } from '../ethereum/instrument/impl';
import { Instrument } from '../types/Instrument';

export const Exchange = () => {
  const [instrumentAddresses, setInstrumentAddresses] = useState<string[]>(
    new Array(Number(localStorage.getItem('instrumentAddressesCount') || '3')).fill(0)
  );
  const [instrumentsMap, setInstrumentsMap] = useState<Record<string, Instrument>>({});
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [instrumentInstances, setInstances] = useState<InstrumentImpl[]>([]);
  const innoDEX = useInnoDEX();

  useEffect(() => {
    innoDEX.getAllInstruments().then((list) => {
      setInstrumentAddresses(list);
      console.log(list);
      localStorage.setItem('instrumentAddressesCount', String(list.length));

      const instanceList = list.map((address) => new InstrumentImpl(innoDEX.account, address));

      setInstances(instanceList);

      Promise.all(instanceList.map((instance) => instance.getMetadata())).then((metadates) => {
        setInstruments(metadates);
        console.log(metadates);
      });

      // innoDEX.getInstrument(address).then((instrument) => {
      //   setTimeout(() => {
      //     setInstrumentsMap((oldMap) => ({ ...oldMap, [address]: instrument }));
      //   }, 2000);
      // })
    });
  }, []);

  return (
    <main>
      <div className="d-flex align-items-center">
        <h1 className="mr-3">Exchange</h1>
        <AddInstrument />
      </div>
      <Row>
        <Col md={5} lg={4}>
          <div className="p-3 bg-white">
            {instruments.length > 0 ? (
              instruments.map((instrument) => (
                <pre key={instrument.name}>{JSON.stringify(instrument, null, 4)}</pre>
              ))
            ) : (
              <TextSkeleton width="100%" height={50} count={3} />
            )}
          </div>
        </Col>
      </Row>
    </main>
  );
};
