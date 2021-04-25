import React from 'react';
import { Spinner } from 'react-bootstrap';

import { FullScreenPlate } from './FullScreenPlate';

export const LoadingScreen = () => (
  <FullScreenPlate>
    <div className="d-flex align-items-center">
      <Spinner animation="border" variant="secondary" size="sm" />
      <h5 className="text-muted ml-3 mb-0">Loading...</h5>
    </div>
  </FullScreenPlate>
);
