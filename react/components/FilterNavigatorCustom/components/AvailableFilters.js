import React from 'react';
import PropTypes from 'prop-types';
import SearchFilter from './SearchFilter';
import PriceRange from './PriceRange';

const PRICE_TITLE = 'store/search.filter.title.price-ranges';

const KM = 'KM';

const textOverflow = (text, maxWidth) =>
  text && text.length > maxWidth ? `${text.substr(0, maxWidth - 3)}...` : text;

const formatSearchFilterFacets = facets =>
  facets.map(facet => ({
    ...facet,
    name: unescape(textOverflow(facet.name, 40)),
  }));

const AvailableFilters = ({
  filters = [],
  priceRange,
  preventRouteChange = false,
  initiallyCollapsed = false,
  navigateToFacet,
}) =>
  filters.map(({ title, facets, oneSelectedCollapse = false }) => {
    switch (title) {
      case PRICE_TITLE:
        return (
          <PriceRange
            key={title}
            title={title}
            facets={facets}
            priceRange={priceRange}
            navigateToFacet={navigateToFacet}
            preventRouteChange={preventRouteChange}
          />
        );
      case KM:
        return (
          <PriceRange
            key={title}
            title={title}
            facets={facets}
            priceRange={priceRange}
            navigateToFacet={navigateToFacet}
            preventRouteChange={preventRouteChange}
          />
        );
      default:
        return (
          <SearchFilter
            key={title}
            title={title}
            facets={formatSearchFilterFacets(facets)}
            oneSelectedCollapse={oneSelectedCollapse}
            preventRouteChange={preventRouteChange}
            initiallyCollapsed={initiallyCollapsed}
            navigateToFacet={navigateToFacet}
          />
        );
    }
  });

AvailableFilters.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      type: PropTypes.string,
      oneSelectedCollapse: PropTypes.bool,
    }),
  ),
  priceRange: PropTypes.string,
  preventRouteChange: PropTypes.bool,
  initiallyCollapsed: PropTypes.bool,
};

AvailableFilters.defaultProps = {
  filters: [],
  initiallyCollapsed: false,
  preventRouteChange: false,
  priceRange: '',
};

export default AvailableFilters;
