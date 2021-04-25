import { ComponentType, lazy } from 'react';

export function lazyWithPreload(
  factory: () => Promise<Record<string, ComponentType<unknown>>>,
  namedExportName = 'default'
) {
  const moduleFactory = () =>
    factory().then((moduleExports) => {
      return { ['default']: moduleExports[namedExportName] };
    });

  const Component = lazy(moduleFactory);

  setTimeout(async () => {
    if (Component && !Component._result) {
      await moduleFactory();
    }
  }, 2000);

  return Component;
}
