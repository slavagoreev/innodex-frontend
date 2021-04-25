import { lazyWithPreload } from './utils/lazyWithPreload';

import { createBrowserHistory } from 'history';

const Exchange = lazyWithPreload(() => import('./pages/Exchange'), 'Exchange');

export const history = createBrowserHistory();
export const routes = [{ path: '', component: Exchange }];
