import React, { FunctionComponent } from 'react';
import { Container } from 'react-bootstrap';

import styles from './Page.module.scss';

export const Page: FunctionComponent = ({ children }) => (
  <div id="page" className={styles.page}>
    <Container className={styles.page__content}>{children}</Container>
  </div>
);
