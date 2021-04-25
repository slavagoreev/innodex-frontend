import React, { FunctionComponent } from 'react';

export const FullScreenPlate: FunctionComponent = ({ children }) => (
  <div className="vw-100 min-vh-100 d-flex align-items-center justify-content-center flex-column">
    {children}
  </div>
);
