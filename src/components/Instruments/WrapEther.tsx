import React, { FormEventHandler, useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

import { InnoDEX } from '../../ethereum/innodex/impl';
import { WETHImpl } from '../../ethereum/weth/impl';

import Web3 from 'web3';

export type AddInstrumentProps = {
  innoDEX: InnoDEX;
};

export const WrapEther = ({ innoDEX }: AddInstrumentProps) => {
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const wethContract = useRef<WETHImpl | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [balanceETH, setBalanceETH] = useState<string>('');
  const [balanceWETH, setBalanceWETH] = useState<number>(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (Number(amount) > 0) {
        await wethContract.current?.convert(Web3.utils.toWei(amount));
        alert(`Successfully converted ${amount}ETH`);
      } else {
        alert(`${amount} is incorrect number`);
      }
      // const newContract = await createContract(
      //   address,
      //   '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5',
      //   Number(priceStep)
      // ).send({
      //   from: innoDEX.account,
      // });
      //
      // await innoDEX.addInstrument(newContract.options.address);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  useEffect(() => {
    // @ts-ignore
    window.web3.eth.getBalance(innoDEX.account, (error, wei) => {
      if (!error) {
        const balance = String(Web3.utils.fromWei(wei, 'ether'));

        setBalanceETH(balance);
        setAmount(balance);
      }
    });

    wethContract.current = new WETHImpl(innoDEX.account);

    wethContract.current?.balanceOf().then(setBalanceWETH);
  }, []);

  return (
    <>
      <Button variant="secondary" className="mb-4 w-100" onClick={handleShow}>
        Convert ETH into WETH
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Swap your coins</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              You need to convert a regular ETH into ERC20 wrapped ETH (WETH) to be able to trade on
              InnoDEX.
            </p>
            <Form.Group>
              <Form.Label>Swap from</Form.Label>
              <Form.Control as="select" custom readOnly>
                <option selected>ETH (Balance {balanceETH || 0}ETH)</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Swap to</Form.Label>
              <Form.Control as="select" custom readOnly>
                <option selected>WETH (Balance {balanceWETH || 0}WETH)</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Amount to swap (Max {balanceETH}ETH)</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : 'Convert'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
