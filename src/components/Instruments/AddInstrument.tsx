import React, { Dispatch, FormEventHandler, SetStateAction, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

import { InnoDEX } from '../../ethereum/innodex/impl';
import { createContract, InstrumentImpl } from '../../ethereum/instrument/impl';
import { Instrument } from '../../types/Instrument';

export type AddInstrumentProps = {
  innoDEX: InnoDEX;
  setInstruments: Dispatch<SetStateAction<Instrument[]>>;
  setInstances: Dispatch<SetStateAction<InstrumentImpl[]>>;
};

export const AddInstrument = ({ innoDEX, setInstruments, setInstances }: AddInstrumentProps) => {
  const [show, setShow] = useState(false);
  const [address, setAddress] = useState('');
  const [priceStep, setPriceStep] = useState('1');
  const [isLoading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (address && priceStep) {
        const newContract = await createContract(
          address,
          '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5',
          Number(priceStep)
        ).send({
          from: innoDEX.account,
        });

        await innoDEX.addInstrument(newContract.options.address);

        const newInstance = new InstrumentImpl(innoDEX.account, newContract.options.address);

        setInstances((oldInstances) => [newInstance, ...oldInstances]);

        const instrument = await newInstance.getMetadata();

        setInstruments((oldInstruments) => [instrument, ...oldInstruments]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Button variant="outline-primary" className="mt-3 mb-4 w-100" onClick={handleShow}>
        Create instrument
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create an instrument</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>First token address</Form.Label>
              <Form.Control
                type="text"
                value={address}
                placeholder="Enter first token address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Second token address (WETH)</Form.Label>
              <Form.Control
                readOnly
                type="text"
                value="0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price step</Form.Label>
              <Form.Control
                type="number"
                step="1000000"
                value={priceStep}
                onChange={(e) => setPriceStep(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
