import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

import FilterOptionTemplate from './FilterOptionTemplate';
import FacetItem from './FacetItem';
import { facetOptionShape } from '../constants/propTypes';
import { getFilterTitle } from '../constants/SearchHelpers';
import useSelectedFilters from '../hooks/useSelectedFilters';

/**
 * Search Filter Component.
 */
const SearchFilter = ({
  title = 'Default Title',
  facets = [],
  intl,
  preventRouteChange = false,
  initiallyCollapsed = false,
  oneSelectedCollapse = false,
  navigateToFacet,
}) => {
  const filtersWithSelected = useSelectedFilters(facets);

  const sampleFacet = facets && facets.length > 0 ? facets[0] : null;
  const facetTitle = getFilterTitle(title, intl);

  return (
    <FilterOptionTemplate
      id={sampleFacet ? sampleFacet.map : null}
      title={facetTitle}
      filters={filtersWithSelected}
      initiallyCollapsed={initiallyCollapsed}
      collapsable={oneSelectedCollapse}
      oneSelectedCollapse={oneSelectedCollapse}
    >
      {facet => (
        <FacetItem
          key={facet.name}
          facetTitle={facetTitle}
          facet={facet}
          preventRouteChange={preventRouteChange}
          navigateToFacet={navigateToFacet}
        />
      )}
    </FilterOptionTemplate>
  );
};

SearchFilter.propTypes = {
  title: PropTypes.string.isRequired,
  facets: PropTypes.arrayOf(facetOptionShape),
  intl: intlShape.isRequired,
  preventRouteChange: PropTypes.bool,
  initiallyCollapsed: PropTypes.bool,
  oneSelectedCollapse: PropTypes.bool,
  navigateToFacet: PropTypes.func.isRequired,
};

SearchFilter.defaultProps = {
  facets: [],
  preventRouteChange: false,
  initiallyCollapsed: false,
  oneSelectedCollapse: false,
};

export default injectIntl(SearchFilter);
