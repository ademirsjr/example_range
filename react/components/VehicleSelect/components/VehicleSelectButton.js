import React, { useState, useEffect } from 'react';

import { IconCaret, IconClose } from 'vtex.store-icons';

import useSelectedFilters from '../../FilterNavigatorCustom/hooks/useSelectedFilters';
import VehicleSidebar from './VehicleSidebar';

import styles from '../styles.css';

const VehicleSelectButton = ({
  title,
  facets,
  vehicleFacetName,
  navigateToFacet,
  preventRouteChange,
  currentVehicleNumber,
  currentFacet,
  nextFacets,
}) => {
  const currentFacetFiltered = currentFacet
    ? {
        ...currentFacet,
        map: `${currentFacet.map}`,
      }
    : null;

  const facetBase = {
    name: '',
    value: '',
    map: '',
    selected: false,
    isBase: true,
  };

  const filtersWithSelected = useSelectedFilters(facets)
    .map(facet => {
      const curFacet = facet;
      curFacet.map = `${facet.map}`;
      return curFacet;
    })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const [open, setOpen] = useState(false);

  const [currentFacetTemp, setCurrentFacetTemp] = useState(
    currentFacetFiltered
      ? { ...currentFacetFiltered, selected: true }
      : facetBase,
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    navigateToFacet(
      [
        ...(nextFacets || []),
        {
          ...currentFacetFiltered,
          selected: true,
        },
      ],
      preventRouteChange,
    );
    setCurrentFacetTemp(facetBase);
  };

  const handleSubmit = () => {
    if (!currentFacetTemp.value) return;
    navigateToFacet(
      [
        {
          ...currentFacetTemp,
          selected: false,
        },
        {
          ...currentFacetFiltered,
          selected: true,
        },
      ],
      preventRouteChange,
    );

    handleClose();
  };

  useEffect(() => {
    setCurrentFacetTemp(
      currentFacetFiltered
        ? { ...currentFacetFiltered, selected: true }
        : facetBase,
    );
  }, [facets]);

  return (
    <div className={`${styles.filterVehicle} pb4`}>
      <div
        className={`${styles.filterVehicleButtonWrapper} flex justify-between`}
      >
        <div
          role="button"
          className={`${styles.filterVehicleButton} flex items-center justify-between pv4 ph5 ba br3 bg-white b--light-gray pointer w-100`}
          onClick={handleOpen}
        >
          {currentFacetFiltered && !currentFacetFiltered.isBase
            ? currentFacetFiltered.name
            : `Selecione ${vehicleFacetName.pronoun || 'o'} ${(
                vehicleFacetName.title || ''
              ).toLowerCase()}`}

          <span className={`${styles.filterVehicleButtonIcon}`}>
            <IconCaret orientation="right" thin size={8} />
          </span>
        </div>

        {currentFacetFiltered && !currentFacetFiltered.isBase && (
          <div
            className={`${styles.filterVehicleButtonClose} pointer flex items-center ph2`}
            onClick={handleDelete}
          >
            <IconClose size={18} type="outline" />
          </div>
        )}
      </div>

      <VehicleSidebar
        currentFacet={currentFacetTemp}
        setCurrentFacet={setCurrentFacetTemp}
        filtersWithSelected={filtersWithSelected}
        facetTitle={title}
        isOpen={open}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        currentVehicleNumber={currentVehicleNumber}
      />
    </div>
  );
};

export default VehicleSelectButton;
