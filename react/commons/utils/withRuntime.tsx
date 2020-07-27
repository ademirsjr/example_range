import { useRuntime } from 'vtex.render-runtime';
import { ISearchBarProps } from '../../components/SearchBar/SearchBar';
import React from 'react';

export function withRuntime(ComponentWrapped: typeof React.Component) {
  return function Wrapped(props: ISearchBarProps) {
    return <ComponentWrapped {...props} runtime={useRuntime()} />;
  };
}
