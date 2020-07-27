import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { injectIntl, intlShape } from 'react-intl';

import SelectionListOrderBy from './SelectionListOrderBy';

export const SORT_OPTIONS = [
  {
    value: 'OrderByAnoRecente',
    label: 'store/ordenation.anorecente',
    icon: 'calendar',
  },
  {
    value: 'OrderByMenorKm',
    label: 'store/ordenation.menorkm',
    icon: 'speedometer',
  },
  {
    value: 'OrderByMenorDistancia',
    label: 'store/ordenation.menordistancia',
    icon: 'distance',
  },
  {
    value: 'OrderByPriceDESC',
    label: 'store/ordenation.price.descending',
    icon: 'arrow-up',
  },
  {
    value: 'OrderByPriceASC',
    label: 'store/ordenation.price.ascending',
    icon: 'arrow-down',
  },
];

const OrderBy = ({ orderBy, intl, hiddenOptions = [] }) => {
  const sortingOptions = useMemo(() => {
    return SORT_OPTIONS.filter(
      option => !hiddenOptions.includes(option.value),
    ).map(({ value, label, icon }) => {
      return {
        value: value,
        label: intl.formatMessage({ id: label }),
        icon: icon ? icon : '',
      };
    });
  }, [intl, hiddenOptions]);

  return <SelectionListOrderBy orderBy={orderBy} options={sortingOptions} />;
};

OrderBy.propTypes = {
  /** Which sorting option is selected. */
  orderBy: PropTypes.string,
  /** Intl instance. */
  intl: intlShape,
  /** Options to be hidden. (e.g. `["OrderByNameASC", "OrderByNameDESC"]`) */
  hiddenOptions: PropTypes.arrayOf(PropTypes.string),
};

export default injectIntl(OrderBy);
