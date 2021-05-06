import React, { ComponentType, CSSProperties, FunctionComponent } from 'react';

import styles from './Skeleton.module.scss';

import cx from 'classnames';

export type SkeletonProps = JSX.IntrinsicElements['div'] & {
  count?: number;
  duration?: number;
  minWidth?: number;
  width?: string | number;
  wrapper?: ComponentType;
  height?: string | number;
  circle?: boolean;
  randomizeWidth?: boolean;
  style?: CSSProperties;
};

export const Skeleton: FunctionComponent<SkeletonProps> = ({
  count = 1,
  duration = 1.2,
  minWidth = 50,
  style: customStyling = {},
  width = null,
  wrapper: Wrapper = null,
  height = null,
  circle = false,
  randomizeWidth,
  className,
  ...defaultProps
}) => {
  const elements = [];

  for (let i = 0; i < count; i++) {
    const style: CSSProperties = customStyling;

    if (randomizeWidth) style.width = `${minWidth + Math.random() * 50}%`;
    else if (width !== null) {
      style.width = width;
    }

    if (height !== null) {
      style.height = height;
    }

    if (width !== null && height !== null && circle) {
      style.borderRadius = '50%';
    }

    style.animationDuration = `${duration}s`;

    elements.push(
      <span
        {...defaultProps}
        key={i}
        className={cx(styles.skeleton, 'skeleton', className)}
        style={style}
        data-testid="skeleton-components"
      >
        &zwnj;
      </span>
    );
  }

  return <>{Wrapper ? <Wrapper>{elements}</Wrapper> : elements}</>;
};
