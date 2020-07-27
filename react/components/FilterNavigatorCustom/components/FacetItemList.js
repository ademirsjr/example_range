import React from 'react';
import { Checkbox } from 'vtex.styleguide';
import { useCssHandles, applyModifiers } from 'vtex.css-handles';
import classNames from 'classnames';

const CSS_HANDLES = ['filterItem', 'filterNumberRange'];

const FacetItemList = ({
  navigateToFacet,
  vehicle,
  facets,
  className,
  preventRouteChange,
}) => {
  const handles = useCssHandles(CSS_HANDLES);

  const classes = classNames(
    applyModifiers(handles.filterItem, vehicle),
    `${handles.filterItem}--selected`,
    className,
    'lh-copy w-100',
  );

  const formatName = () => facets.map(elem => elem.name).join(' ');

  const formatNavigate = () => {
    return facets.map(facet => {
      const fct = facet;
      fct.title = facet.name;
      return fct;
    });
  };

  return (
    <div
      className={classes}
      style={{ hyphens: 'auto', wordBreak: 'break-word' }}
    >
      <Checkbox
        id={vehicle}
        checked
        label={formatName()}
        name={formatName()}
        onChange={() => navigateToFacet(formatNavigate(), preventRouteChange)}
        value={formatName()}
      />
    </div>
  );
};

export default FacetItemList;
