import React from 'react';
import { Spinner } from 'react-bootstrap';

import { FullScreenPlate } from './FullScreenPlate';

export const InlineLoading = () => (
  <div className="d-flex align-items-center justify-content-center">
    <Spinner animation="border" variant="secondary" size="sm" />
    <h5 className="text-muted ml-3 mb-0">Loading...</h5>
  </div>
);

export const LoadingScreen = () => (
  <FullScreenPlate>
    <InlineLoading />
  </FullScreenPlate>
);
