import React from 'react';
import { FormattedMessage } from 'react-intl';
// import { fromPairs, groupBy, zip } from 'ramda';

import VehicleSelectButton from './VehicleSelectButton';
import VehicleAddButton from './VehicleAddButton';
import VehicleLoading from './VehicleLoading';

// import { useFilterNavigator } from '../../FilterNavigatorCustom/components/FilterNavigatorContext';
import { vehicleFacets } from '../../FilterNavigatorCustom/constants/orderFacets';

import { MAX_VEHICLES } from '../utils/searchVehicle';

import styles from '../styles.css';

const VehicleWrapper = ({
  currentVehicle,
  currentVehicleNumber,
  vehicleNumber,
  setVehicleNumber,
  navigateToFacet,
  preventRouteChange,
  getVehicleFacetsBase,
}) => {
  const facetBase = {
    name: '',
    value: '',
    map: '',
    selected: false,
    isBase: true,
  };

  const vehicleFacetsBaseResult = getVehicleFacetsBase(
    currentVehicle || {
      marca: null,
      modelo: null,
      versao: null,
    },
  );

  if (!vehicleFacetsBaseResult) return <VehicleLoading />;

  const currentMarca = currentVehicle
    ? vehicleFacetsBaseResult.marca.attributeValues
        .filter(fil => `${currentVehicle.marca}` == fil.value)
        .pop()
    : facetBase;

  const currentModelo = currentVehicle
    ? vehicleFacetsBaseResult.marca.modelo.attributeValues
        .filter(fil => `${currentVehicle.modelo}` == fil.value)
        .pop()
    : facetBase;

  const currentVersao = currentVehicle
    ? vehicleFacetsBaseResult.marca.modelo.versao.attributeValues
        .filter(fil => `${currentVehicle.versao}` == fil.value)
        .pop()
    : facetBase;

  return (
    <div className={`${styles.filterVehicleNumber}`}>
      <div
        className={`${styles.filterTitle} f5 flex items-center justify-between pv5`}
      >
        <FormattedMessage id="store/search-result.select-vehicle.title" />
      </div>

      <div className={`${styles.filterVehicleButtons}`}>
        <VehicleSelectButton
          key={vehicleFacetsBaseResult.marca.map + currentVehicleNumber}
          title={vehicleFacets[0].title}
          facets={vehicleFacetsBaseResult.marca.attributeValues}
          vehicleFacetName={vehicleFacets[0]}
          navigateToFacet={navigateToFacet}
          preventRouteChange={preventRouteChange}
          currentVehicleNumber={currentVehicleNumber}
          currentFacet={currentMarca}
          nextFacets={[
            { ...currentModelo, selected: true },
            { ...currentVersao, selected: true },
          ]}
        />

        {vehicleFacetsBaseResult.marca.selected && (
          <VehicleSelectButton
            key={
              vehicleFacetsBaseResult.marca.modelo.map + currentVehicleNumber
            }
            title={vehicleFacets[1].title}
            facets={vehicleFacetsBaseResult.marca.modelo.attributeValues}
            vehicleFacetName={vehicleFacets[1]}
            navigateToFacet={navigateToFacet}
            preventRouteChange={preventRouteChange}
            currentVehicleNumber={currentVehicleNumber}
            currentFacet={currentModelo}
            nextFacets={[{ ...currentVersao, selected: true }]}
          />
        )}

        {vehicleFacetsBaseResult.marca.modelo.selected && (
          <VehicleSelectButton
            key={
              vehicleFacetsBaseResult.marca.modelo.versao.map +
              currentVehicleNumber
            }
            title={vehicleFacets[2].title}
            facets={vehicleFacetsBaseResult.marca.modelo.versao.attributeValues}
            vehicleFacetName={vehicleFacets[2]}
            navigateToFacet={navigateToFacet}
            preventRouteChange={preventRouteChange}
            currentVehicleNumber={currentVehicleNumber}
            currentFacet={currentVersao}
          />
        )}
      </div>

      {currentVehicleNumber == vehicleNumber &&
        vehicleNumber < MAX_VEHICLES && (
          <VehicleAddButton
            vehicleNumber={vehicleNumber}
            setVehicleNumber={setVehicleNumber}
          />
        )}
    </div>
  );
};

export default VehicleWrapper;
