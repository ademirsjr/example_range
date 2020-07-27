import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from '../styles.css';

import { MAX_VEHICLES } from '../utils/searchVehicle';

const VehicleAddButton = ({ vehicleNumber, setVehicleNumber }) => {
  const handleAddVehicle = () => {
    setVehicleNumber(Math.min(vehicleNumber + 1, MAX_VEHICLES));
  };

  return (
    <div
      className={`${styles.filterVehicleButtonAdd} pointer`}
      onClick={handleAddVehicle}
    >
      <FormattedMessage id="store/search-result.select-vehicle.add" />
    </div>
  );
};

export default VehicleAddButton;
