import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useRuntime } from 'vtex.render-runtime';
import { injectIntl, intlShape } from 'react-intl';
import { Slider } from 'vtex.styleguide';
import { formatCurrency } from 'vtex.format-currency';

import { facetOptionShape } from '../constants/propTypes';
import {
  getSessionStorage,
  saveSessionStorage,
} from '../utils/sessionStorageHelpers';
import { getFilterTitle } from '../constants/SearchHelpers';
import FilterOptionTemplate from './FilterOptionTemplate';

const DEBOUNCE_TIME = 500; // ms
const formatNavigateToFacet = ({ key, left, right, title }) => ({
  name: `${left}-${right}`,
  key,
  value: `${left}:${right}`,
  map: key,
  title,
});

/** Price range slider component */
const PriceRange = ({
  title,
  facets,
  intl,
  navigateToFacet,
  preventRouteChange,
}) => {
  const { culture } = useRuntime();
  const navigateTimeoutId = useRef();
  const facetTitle = getFilterTitle(title, intl);
  const [rangeFacet] = facets;
  const getRangerInfo = getSessionStorage(rangeFacet.key);
  const urlParams = new URLSearchParams(window.location.search).toString();

  const handleChange = ([left, right]) => {
    navigateTimeoutId.current = setTimeout(() => {
      const facet = formatNavigateToFacet({
        key: rangeFacet.key,
        left,
        right,
        title: facetTitle,
      });
      saveSessionStorage(rangeFacet.key, [left, right]);
      navigateToFacet({ ...facet, title: facetTitle }, preventRouteChange);
    }, DEBOUNCE_TIME);
  };

  const slugRegex = /^de-(.*)-a-(.*)$/;
  const availableOptions = facets.filter(({ slug }) => slugRegex.test(slug));

  if (!availableOptions.length) return null;

  let minValue = Number.MAX_VALUE;
  let maxValue = Number.MIN_VALUE;

  availableOptions.forEach(({ slug }) => {
    const [, minSlug, maxSlug] = slug.match(slugRegex);
    const min = parseInt(minSlug, 10);
    const max = parseInt(maxSlug, 10);

    if (min < minValue) minValue = min;
    if (max > maxValue) maxValue = max;
  });

  const defaultValues = [minValue, maxValue];

  if (getRangerInfo.length) {
    const [left, right] = getRangerInfo;
    defaultValues[0] = parseInt(left, 10);
    defaultValues[1] = parseInt(right, 10);
  }

  const getRangeParams = urlParams.includes(rangeFacet.key);
  if (!getRangeParams && getRangerInfo.length)
    sessionStorage.removeItem(rangeFacet.key);
  
  const formatValueSlider = (value) => {
    if (facetTitle === 'KM') {
      return `${value} km`
    }
    return formatCurrency({intl, culture, value})
  }

  return (
    <FilterOptionTemplate
      id={`range${facetTitle}`}
      title={facetTitle}
      collapsable={false}
    >
      <Slider
        min={minValue}
        max={maxValue}
        onChange={handleChange}
        defaultValues={defaultValues}
        formatValue={value => formatValueSlider(value)}
        range
      />
    </FilterOptionTemplate>
  );
};

PriceRange.propTypes = {
  title: PropTypes.string.isRequired,
  facets: PropTypes.arrayOf(facetOptionShape).isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(PriceRange);
