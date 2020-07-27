import React from 'react';
import { Checkbox } from 'vtex.styleguide';
import { applyModifiers } from 'vtex.css-handles';
import classNames from 'classnames';

import styles from '../styles.css';

const VehicleItem = ({
  facet,
  className,
  selected,
  setCurrentFacet,
  currentVehicleNumber,
}) => {
  const classes = classNames(
    applyModifiers(styles.filterItem, facet.value),
    { [`${styles.filterItem}--selected`]: facet.selected },
    className,
    'lh-copy w-100',
  );

  return (
    <div
      className={classes}
      style={{ hyphens: 'auto', wordBreak: 'break-word' }}
    >
      <Checkbox
        id={'vehicle-item-' + facet.value + '-' + currentVehicleNumber}
        checked={selected}
        label={facet.name}
        name={'vehicle-item-' + facet.name + '-' + currentVehicleNumber}
        onChange={() => setCurrentFacet(facet)}
        value={facet.name}
      />
    </div>
  );
};

export default VehicleItem;
