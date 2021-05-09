import React, {
  createContext,
  Dispatch,
  FunctionComponent,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { useInnoDEX } from '../../ethereum/innodex/impl';
import { InstrumentImpl } from '../../ethereum/instrument/impl';
import { Token } from '../../ethereum/token/impl';
import { Instrument } from '../../types/Instrument';

export type ExchangeContextValue = {
  instrument: Instrument | null;
  setInstrument: Dispatch<SetStateAction<Instrument | null>>;

  instruments: Instrument[];
  setInstruments: Dispatch<SetStateAction<Instrument[]>>;

  instrumentInstances: InstrumentImpl[];
  setInstances: Dispatch<SetStateAction<InstrumentImpl[]>>;

  selectedItem: Instrument | boolean | null;
  setSelectedItem: Dispatch<SetStateAction<Instrument | boolean | null>>;

  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;

  instrumentInstanceRef: MutableRefObject<InstrumentImpl | null>;
  firstTokenRef: MutableRefObject<Token | null>;
  secondTokenRef: MutableRefObject<Token | null>;

  isBuyLoading: boolean;
  setBuyLoading: Dispatch<SetStateAction<boolean>>;
  buyAllowed: boolean;
  setBuyAllowance: Dispatch<SetStateAction<boolean>>;
  isSellLoading: boolean;
  setSellLoading: Dispatch<SetStateAction<boolean>>;
  sellAllowed: boolean;
  setSellAllowance: Dispatch<SetStateAction<boolean>>;
};

const noop = () => {
  /* Does nothing, placeholder */
};
const defaultExchangeContextValue: ExchangeContextValue = {
  instrument: null,
  setInstrument: noop,
  instruments: [],
  setInstruments: noop,
  instrumentInstances: [],
  setInstances: noop,
  selectedItem: null,
  setSelectedItem: noop,
  isLoading: true,
  setLoading: noop,
  instrumentInstanceRef: { current: null },
  firstTokenRef: { current: null },
  secondTokenRef: { current: null },
  isBuyLoading: false,
  setBuyLoading: noop,
  buyAllowed: false,
  setBuyAllowance: noop,
  isSellLoading: false,
  setSellLoading: noop,
  sellAllowed: false,
  setSellAllowance: noop,
};

export const ExchangeContext = createContext<ExchangeContextValue>(defaultExchangeContextValue);

export const ExchangeContextProvider: FunctionComponent = ({ children }) => {
  const location = useLocation<{ id: string }>();
  const innoDEX = useInnoDEX();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [instrumentInstances, setInstances] = useState<InstrumentImpl[]>([]);

  const instrumentInstanceRef = useRef<InstrumentImpl | null>(null);
  const firstTokenRef = useRef<Token | null>(null);
  const secondTokenRef = useRef<Token | null>(null);

  const [isBuyLoading, setBuyLoading] = useState(false);
  const [buyAllowed, setBuyAllowance] = useState(false);

  const [isSellLoading, setSellLoading] = useState(false);
  const [sellAllowed, setSellAllowance] = useState(false);

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
    const fetchData = async () => {
      setLoading(true);

      const id = `0x${location.pathname.split('0x')[1]}`.replace(/\W/g, '');

      instrumentInstanceRef.current = new InstrumentImpl(innoDEX.account, id);

      try {
        const metadata = await instrumentInstanceRef.current?.getMetadata();

        setInstrument(metadata);

        firstTokenRef.current = new Token(innoDEX.account, metadata.firstAssetAddress);
        secondTokenRef.current = new Token(innoDEX.account, metadata.secondAssetAddress);

        setBuyAllowance(Number(await firstTokenRef.current?.checkAllowance(metadata.address)) > 0);
        setSellAllowance(
          Number(await secondTokenRef.current?.checkAllowance(metadata.address)) > 0
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname.includes('0x')) {
      fetchData();
    }
  }, [location]);

  useEffect(() => {
    setSelectedItem(location.pathname.includes('token'));
  }, [location.pathname]);

  return (
    <ExchangeContext.Provider
      value={{
        instrument,
        setInstrument,
        instruments,
        setInstruments,
        instrumentInstances,
        setInstances,
        selectedItem,
        setSelectedItem,
        isLoading,
        setLoading,
        instrumentInstanceRef,
        firstTokenRef,
        secondTokenRef,
        isBuyLoading,
        setBuyLoading,
        buyAllowed,
        setBuyAllowance,
        isSellLoading,
        setSellLoading,
        sellAllowed,
        setSellAllowance,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};
