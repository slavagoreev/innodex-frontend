import React from 'react';

import { useEthereumInit } from './ethereum/impl';

function App() {
  const fallback = useEthereumInit();
  // const eth = useEthereum();

  if (fallback) {
    return fallback;
  }

  return <h1>123</h1>;
}

export default App;
