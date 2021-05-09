import React, { Suspense } from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import { LoadingScreen } from './components/Misc/LoadingScreen';
import { Page } from './components/Page/Page';
import { useEthereumInit } from './ethereum/innodex/impl';
import { ExchangeContextProvider } from './pages/Exchange/ExchangeContext';
import { history, routes } from './routes';

function App() {
  const fallback = useEthereumInit();

  if (fallback) {
    return fallback;
  }

  return (
    <Router history={history}>
      <Suspense fallback={<LoadingScreen />}>
        <Page>
          <ExchangeContextProvider>
            <Switch>
              {routes.map(({ path, component }) => (
                <Route key={path} path={`/${path}`} component={component} />
              ))}
              {/*<Route component={withNavbar(NotFound)} />*/}
            </Switch>
          </ExchangeContextProvider>
        </Page>
      </Suspense>
    </Router>
  );
}

export default App;
