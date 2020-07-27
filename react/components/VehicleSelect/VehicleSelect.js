import React, { useState } from 'react';
import { fromPairs, groupBy, zip } from 'ramda';

import VehicleWrapper from './components/VehicleWrapper';

import { useFilterNavigator } from '../FilterNavigatorCustom/components/FilterNavigatorContext';

import { getVehicleFacetsBase } from './utils/searchVehicle';
import styles from './styles.css';

/**
 * Componente de filtro do veículo (Marca, Modelo e Versão)
 */
const VehicleSelect = ({ preventRouteChange, navigateToFacet }) => {
  const { query, map } = useFilterNavigator();

  const queryAndMap = zip(
    map.split(','),
    query
      .toLowerCase()
      .split('/')
      .map(decodeURIComponent)
      .map(queryFil => queryFil),
  );
  let marcasProv = queryAndMap.filter(elem => elem[0] == 'marca');
  let modeloProv = queryAndMap.filter(elem => elem[0] == 'modelo');
  let versaoProv = queryAndMap.filter(elem => elem[0] == 'versao');
  let outrosPrev = queryAndMap.filter(
    elem => elem[0] != 'marca' && elem[0] != 'modelo' && elem[0] != 'versao',
  );
  let marcaCounter = marcasProv.length;
  let vehicles = {};
  marcasProv.forEach((marcaItem, index) => {
    const vel = { marca: null };
    vel.marca = marcaItem[1];
    if (modeloProv.length > 0) {
      modeloProv.forEach(modeloItem => {
        if (
          getVehicleFacetsBase({
            marca: marcaItem[1],
            modelo: modeloItem[1],
            versao: null,
          })
        )
          vel.modelo = modeloItem[1];
        if (versaoProv.length > 0) {
          versaoProv.forEach(versaoItem => {
            if (
              getVehicleFacetsBase({
                marca: marcaItem[1],
                modelo: modeloItem[1],
                versao: versaoItem[1],
              })
            )
              vel.versao = versaoItem[1];
          });
        }
      });
    }
    vehicles[`veiculo-${index + 1}`] = vel;
  });
  const outros = {};
  outrosPrev.forEach(outro => {
    outros[outro[0]] = outro[1];
  });
  vehicles.outros = outros;
  const [vehicleNumber, setVehicleNumber] = useState(marcaCounter || 1);

  const renderVehicles = () => {
    const vehiclesRender = [];

    for (let i = 1; i <= vehicleNumber; i++)
      vehiclesRender.push(
        <VehicleWrapper
          key={`veiculo-${i}`}
          currentVehicle={vehicles[`veiculo-${i}`] || null}
          currentVehicleNumber={i}
          vehicleNumber={vehicleNumber}
          setVehicleNumber={setVehicleNumber}
          navigateToFacet={navigateToFacet}
          preventRouteChange={preventRouteChange}
          getVehicleFacetsBase={getVehicleFacetsBase}
        />,
      );

    return vehiclesRender;
  };

  return (
    <div
      className={`${styles.filterVehicleWrapper} ${styles.filter__container}`}
    >
      {renderVehicles()}
    </div>
  );
};

export default VehicleSelect;
