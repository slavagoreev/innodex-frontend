import React, {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Button, Form, FormControl, InputGroup, Modal, Spinner, Tab, Tabs } from 'react-bootstrap';

import { OrderBookQty } from '../../../types/OrderBookQty';
import { formatPrice, weiToPrice } from '../../../utils/priceUtils';
import { ExchangeContext } from '../ExchangeContext';

export type CreateOrderModalProps = {
  order: OrderBookQty | null;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

export const CreateOrderModal = ({ order, setShow, show }: CreateOrderModalProps) => {
  const { firstTokenRef, secondTokenRef, instrumentInstanceRef, refreshData } = useContext(
    ExchangeContext
  );
  const [amount, setAmount] = useState('');
  const [marketPrice, setMarketPrice] = useState('0');
  const [limitPrice, setLimitPrice] = useState('0');
  const [isLoading, setLoading] = useState(false);
  const [activeTabId, onSelect] = useState('market');
  const isBuy = location.hash.includes('buy');

  const handleClose = () => setShow(false);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (amount) {
        const isMarketOrder = activeTabId === 'market';

        if (isMarketOrder) {
          try {
            await instrumentInstanceRef.current?.marketOrderTryout(
              isBuy,
              Number(amount) * 10 ** (firstTokenRef.current?.decimals || 5)
            );

            await instrumentInstanceRef.current?.marketOrder(
              isBuy,
              Number(amount) * 10 ** (firstTokenRef.current?.decimals || 5)
            );
          } catch (err) {
            alert('Order cannot be executed. Not enough liquidity');
            console.error(err);
          }
        } else {
          await instrumentInstanceRef.current?.limitOrder(
            isBuy,
            Number(limitPrice) * 10 ** (18 - (firstTokenRef.current?.decimals || 5)),
            Number(amount) * 10 ** (firstTokenRef.current?.decimals || 5),
            0
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      handleClose();
      refreshData((old) => old + 1);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const spotPrice = await instrumentInstanceRef.current?.getSpotPrice(isBuy ? 1 : 0);

      setMarketPrice(weiToPrice(Number(order?.price ? order?.price : spotPrice)));
    }

    fetchData();
  }, []);

  const maxBuy = Number(marketPrice)
    ? Number(secondTokenRef.current?.accountBalance) / Number(marketPrice)
    : 0;

  const maxAmount = isBuy ? maxBuy : Number(firstTokenRef.current?.accountBalance);

  const topPart = (
    <div className="mt-4">
      <p>
        Your balance:{' '}
        <strong>
          {Number((isBuy ? secondTokenRef : firstTokenRef).current?.accountBalance)}
          {(isBuy ? secondTokenRef : firstTokenRef).current?.symbol}
        </strong>
      </p>
      <Form.Group>
        <Form.Label className="d-flex">
          Amount{' '}
          {activeTabId === 'market' && (
            <code className="ml-auto">
              Max {isBuy ? '≈' : ''}
              {formatPrice(maxAmount)} Lots
            </code>
          )}
        </Form.Label>
        <Form.Control
          type="number"
          value={amount}
          max={maxAmount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Group>
    </div>
  );

  const bottomPart = (
    <div className="mt-4">
      <p>
        Total sum:{' '}
        <strong>
          {formatPrice(
            Number(activeTabId === 'market' ? marketPrice : limitPrice) * Number(amount)
          )}
          {(isBuy ? secondTokenRef : firstTokenRef).current?.symbol}
        </strong>
      </p>
    </div>
  );

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isBuy ? 'Buy' : 'Sell'} {firstTokenRef.current?.tokenName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            variant="pills"
            activeKey={activeTabId}
            onSelect={(tabId) => onSelect(tabId || 'market')}
          >
            <Tab eventKey="market" title="Market order">
              {topPart}
              <Form.Group>
                <Form.Label>Market price</Form.Label>
                <InputGroup>
                  <Form.Control readOnly value={`≈${marketPrice}`} />
                  <InputGroup.Append>
                    <InputGroup.Text>{secondTokenRef.current?.symbol}</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
              {bottomPart}
            </Tab>
            <Tab eventKey="limit" title="Limit order">
              {topPart}
              <Form.Group>
                <Form.Group>
                  <Form.Label>Limit price</Form.Label>
                  <InputGroup>
                    <Form.Control
                      value={limitPrice}
                      step={10 ** -(firstTokenRef.current?.decimals || 5)}
                      type="number"
                      onChange={(e) => setLimitPrice(e.target.value)}
                      onBlur={() => setLimitPrice(formatPrice(Number(limitPrice)))}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text>{secondTokenRef.current?.symbol}</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Form.Group>
              </Form.Group>
              {bottomPart}
            </Tab>
          </Tabs>
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
