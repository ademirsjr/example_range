import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from '../searchResult.css';

const FilterButtonClear = ({
  isSelected,
  handleClearFilters,
  isMobile = false,
}) => {
  return (
    <button
      className={`${styles.filterButtonClear} pointer ${
        isMobile ? 'w-40' : 'w-100'
      } ${isSelected ? '' : 'dn'}`}
      onClick={handleClearFilters}
    >
      <FormattedMessage id="store/search-result.filter-button.clear" />
    </button>
  );
};

export default FilterButtonClear;
