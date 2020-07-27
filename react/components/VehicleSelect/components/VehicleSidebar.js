import React from 'react';
import { FormattedMessage } from 'react-intl';

import { IconArrowBack } from 'vtex.store-icons';

// import Animation from 'vtex.store-components/Animation';

import VehicleItem from './VehicleItem';

import styles from '../styles.css';

const VehicleSidebar = ({
  currentFacet,
  setCurrentFacet,
  filtersWithSelected,
  facetTitle,
  isOpen,
  handleSubmit,
  handleClose,
  currentVehicleNumber,
}) => {
  return (
    <div
      className={`${
        styles.filterVehicleSidebar
      } absolute top-0 left-0 bottom-0 w-100 h-100 ${isOpen ? '' : 'dn'}`}
    >
      <div
        className={`${styles.filterVehicleSidebarHeader} w-100 dib flex ph5 pv3 z-2 `}
      >
        <button
          className={`${styles.filterVehicleSidebarHeaderBack} pa2 pointer`}
          onClick={handleClose}
        >
          <IconArrowBack size={18} />
        </button>

        <div className={`${styles.filterVehicleSidebarTitle} tc flex-auto`}>
          {facetTitle}
        </div>
      </div>

      <div
        className={`${styles.filterVehicleSidebarBody} h-100 flex flex-column`}
      >
        {filtersWithSelected.map(facet => (
          <VehicleItem
            key={facet.name}
            title={facetTitle}
            facet={facet}
            selected={
              facet.value == currentFacet.value && facet.map == currentFacet.map
            }
            setCurrentFacet={setCurrentFacet}
            currentVehicleNumber={currentVehicleNumber}
          />
        ))}

        <div className="flex flex-grow-1" />

        <div className={`${styles.filterButtonWrapper} w-100`}>
          <button
            className={`${styles.filterVehicleButtonConfirm} w-100 pointer`}
            onClick={handleSubmit}
          >
            <FormattedMessage id="store/search-result.select-vehicle.confirm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleSidebar;
