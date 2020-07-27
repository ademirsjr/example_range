import React from 'react';
import PropTypes from 'prop-types';

import SearchFilter from './SearchFilter';
import PriceRange from './PriceRange';

const mzFormatNumber = price =>
  price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

const textOverflow = (text, maxWidth) =>
  text && text.length > maxWidth ? `${text.substr(0, maxWidth - 3)}...` : text;

const fromAttributesToFacets = attribute => {
  if (attribute.type === 'PriceRanges') {
    let facetsFinal = [];
    facetsFinal = attribute.facets
      .map(value => {
        const priceFrom =
          value.range.from == '*'
            ? value.range.from
            : mzFormatNumber(value.range.from);

        const priceTo =
          value.range.to == '*'
            ? value.range.to
            : mzFormatNumber(value.range.to);

        let nameFormatted = `${priceFrom}-até-${priceTo}`;

        if (priceFrom == '*') nameFormatted = `Até-${priceTo}`;
        else if (priceTo == '*') nameFormatted = `Mais de-${priceFrom}`;
        return {
          quantity: value.quantity,
          key: value.key,
          range: {
            from: value.range.from,
            to: value.range.to,
            __typename: 'Range',
          },
          map: value.map,
          slug: unescape(nameFormatted),
          name: unescape(nameFormatted),
          link: value.link,
          linkEncoded: value.linkEncoded,
          selected: false,
          value: `${value.range.from}:${value.range.to}`,
        };
      })
      .sort((a, b) => {
        return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
      });
    return {
      title: 'Preço(R$)',
      facets: facetsFinal,
    };
  }
  return {
    type: attribute.type,
    title: attribute.title,
    facets: attribute.facets.map(facet => {
      return {
        id: facet.id,
        quantity: facet.quantity,
        name: unescape(textOverflow(facet.name, 40)),
        key: facet.key,
        selected: facet.selected,
        value: facet.value,
        link: facet.link,
        linkEncoded: facet.linkEncoded,
        href: facet.href,
        range: facet.range,
        children: facet.children,
        map: facet.map,
      };
    }),
    oneSelectedCollapse: attribute.oneSelectedCollapse,
  };
}
const AvailableFilters = ({
  filters = [],
  preventRouteChange = false,
  initiallyCollapsed = false,
  navigateToFacet,
}) =>
  filters.map(filter => {
    const {
      type,
      title,
      facets,
      oneSelectedCollapse = false,
    } = fromAttributesToFacets(filter);
    switch (type) {
      case 'PriceRanges':
        return (
          <PriceRange
            key={title}
            title={title}
            facets={facets}
            priceRange={facets[0].range}
            preventRouteChange={preventRouteChange}
          />
        );
      default:
        return (
          <SearchFilter
            key={title}
            title={title}
            facets={facets}
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
