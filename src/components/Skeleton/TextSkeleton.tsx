import React, { FunctionComponent } from 'react';

import { Skeleton, SkeletonProps } from './Skeleton';

export const TextSkeleton: FunctionComponent<SkeletonProps> = ({ children, ...skeletonProps }) => {
  return children ? <>{children}</> : <Skeleton {...skeletonProps} />;
};
