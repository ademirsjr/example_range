import React from 'react';
import { Checkbox } from 'vtex.styleguide';
import { useCssHandles, applyModifiers } from 'vtex.css-handles';
import { useRuntime } from 'vtex.render-runtime';

import classNames from 'classnames';

import { QUERY_KEY } from '../constants';

const CSS_HANDLES = ['filterItem', 'filterNumberRange'];

const FacetItemTerm = ({ query, className }) => {
  const { navigate } = useRuntime();
  const queryFormatted = query
    .replace('+', '')
    .replace(/\s/g, '')
    .replace(':', '')
    .replace('*', '-');
  const handles = useCssHandles(CSS_HANDLES);

  const classes = classNames(
    applyModifiers(handles.filterItem, queryFormatted),
    `${handles.filterItem}--selected`,
    className,
    'lh-copy w-100',
  );

  const navigateToQuery = () => {
    const urlParams = new URLSearchParams(window.location.search);

    urlParams.delete(QUERY_KEY);

    navigate({
      page: 'store.search',
      query: urlParams.toString(),
    });
  };

  return (
    <div
      className={classes}
      style={{ hyphens: 'auto', wordBreak: 'break-word' }}
    >
      <Checkbox
        id={queryFormatted}
        checked
        label={`Termo: ${query}`}
        name={queryFormatted}
        onChange={navigateToQuery}
        value={queryFormatted}
      />
    </div>
  );
};

export default FacetItemTerm;
