import React from 'react';
import { Checkbox } from 'vtex.styleguide';
import { useCssHandles, applyModifiers } from 'vtex.css-handles';
import classNames from 'classnames';

import { numberFacetNames } from '../constants/orderFacets';

const CSS_HANDLES = ['filterItem', 'filterNumberRange'];

const FacetItem = ({
  navigateToFacet,
  facetTitle,
  facet,
  className,
  preventRouteChange,
}) => {
  const handles = useCssHandles(CSS_HANDLES);
  const idFacet = `${facet.key}-${facet.value}`;
  const classes = classNames(
    applyModifiers(
      handles.filterItem,
      facet.value ? facet.value.replace(':', '').replace('*', '-') : '',
    ),
    { [`${handles.filterItem}--selected`]: facet.selected },
    className,
    'lh-copy w-100',
  );

  const formatName = name => {
    if (numberFacetNames.indexOf(facet.map) < 0) return name;

    return name.split('-').map((lbl, i) => {
      return (
        <div
          key={i}
          className={`ph1 dib ${handles.filterNumberRange} ${
            lbl.indexOf('*') > -1 ? 'b' : ''
          }`}
        >
          {lbl.replace(/\*/i, '')}
        </div>
      );
    });
  };

  return (
    <div
      className={classes}
      style={{ hyphens: 'auto', wordBreak: 'break-word' }}
    >
      <Checkbox
        id={idFacet}
        checked={facet.selected}
        label={formatName(facet.name)}
        name={facet.name}
        onChange={() =>
          navigateToFacet({ ...facet, title: facetTitle }, preventRouteChange)
        }
        value={facet.name}
      />
    </div>
  );
};

export default FacetItem;
