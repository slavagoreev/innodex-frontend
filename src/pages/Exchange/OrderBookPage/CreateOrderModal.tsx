import React, { Dispatch, FormEventHandler, SetStateAction, useContext, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

import { OrderBookQty } from '../../../types/OrderBookQty';
import { ExchangeContext } from '../ExchangeContext';

export type CreateOrderModalProps = {
  order: OrderBookQty | null;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

export const CreateOrderModal = ({ order, setShow, show }: CreateOrderModalProps) => {
  const { firstTokenRef, secondTokenRef } = useContext(ExchangeContext);
  const [amount, setAmount] = useState('');
  const [isLoading, setLoading] = useState(false);
  const isBuy = location.hash.includes('buy');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (amount) {
        // const newContract = await createContract(
        //   address,
        //   '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5',
        //   Number(priceStep)
        // ).send({
        //   from: innoDEX.account,
        // });
        //
        // await innoDEX.addInstrument(newContract.options.address);
        //
        // const newInstance = new InstrumentImpl(innoDEX.account, newContract.options.address);
        //
        // setInstances((oldInstances) => [newInstance, ...oldInstances]);
        //
        // const instrument = await newInstance.getMetadata();
        //
        // setInstruments((oldInstruments) => [instrument, ...oldInstruments]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isBuy ? 'Buy' : 'Sell'} {(isBuy ? firstTokenRef : secondTokenRef).current?.tokenName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              step="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : isBuy ? 'Buy' : 'Sell'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
