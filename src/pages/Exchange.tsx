import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import { TextSkeleton } from '../components/Skeleton/TextSkeleton';
import { useEthereum } from '../ethereum/impl';
import { Instrument } from '../types/Instrument';

export const Exchange = () => {
  const [instrumentAddresses, setInstrumentAddresses] = useState<string[]>(
    new Array(Number(localStorage.getItem('instrumentAddressesCount') || '3')).fill(0)
  );
  const [instrumentsMap, setInstrumentsMap] = useState<Record<string, Instrument>>({});
  const eth = useEthereum();

  useEffect(() => {
    eth.getAllInstruments().then((list) => {
      setInstrumentAddresses(list);
      localStorage.setItem('instrumentAddressesCount', String(list.length));

      list.forEach((address) =>
        eth.getInstrument(address).then((instrument) => {
          setTimeout(() => {
            setInstrumentsMap((oldMap) => ({ ...oldMap, [address]: instrument }));
          }, 2000);
        })
      );
    });
  }, []);

  return (
    <main>
      <h1>Exchange</h1>
      <Row>
        <Col md={5} lg={4}>
          <div className="p-3 bg-white">
            {instrumentAddresses.map((address) => (
              <TextSkeleton key={address} width="100%" height={50}>
                {instrumentsMap[address] && (
                  <pre>{JSON.stringify(instrumentsMap[address], null, 4)}</pre>
                )}
              </TextSkeleton>
            ))}
          </div>
        </Col>
      </Row>
    </main>
  );
};
