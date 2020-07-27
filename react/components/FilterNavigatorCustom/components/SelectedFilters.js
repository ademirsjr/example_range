import React, { useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { pathOr, flatten, groupBy } from 'ramda';
import classNames from 'classnames';

import { useSearchPage } from 'vtex.search-page-context/SearchPageContext';
import { useCssHandles } from 'vtex.css-handles';

import useSelectedFilters from '../hooks/useSelectedFilters';
import useFacetNavigation from '../hooks/useFacetNavigation';
import { newFacetPathName } from '../utils/slug';

import FacetItem from './FacetItem';
import FacetItemList from './FacetItemList';
import FacetItemTerm from './FacetItemTerm';

import { getVehicleFacetsBase } from '../../VehicleSelect/utils/searchVehicle';
import { vehicleFacets } from '../constants/orderFacets';

const CSS_HANDLES = [
  'selectedFilterItem',
  'filter__container',
  'filterTemplateOverflow',
];

/**
 * Search Filter Component.
 */
const SelectedFilters = () => {
  const handles = useCssHandles(CSS_HANDLES);

  const { searchQuery, map, preventRouteChange } = useSearchPage();

  const newNamedFacet = facet => {
    return { ...facet, newQuerySegment: newFacetPathName(facet) };
  };

  const facets = pathOr({}, ['data', 'facets'], searchQuery);

  const { query } = searchQuery;

  const { brands, priceRanges, specificationFilters } = facets;

  const vehicleFacetsBaseResult = getVehicleFacetsBase({
    marca: null,
    modelo: null,
    versao: null,
  });

  const newFilters = useMemo(() => {
    const options = [
      ...specificationFilters.map(filter => {
        return filter.facets.map(facet => {
          return newNamedFacet({ ...facet, title: filter.name });
        });
      }),
      ...brands,
      ...priceRanges,
    ];

    let newOptions = flatten(options);

    if (vehicleFacetsBaseResult) {
      const tempOptions = flatten(options).filter(
        fil => !vehicleFacets.find(fcts => fcts.title == fil.title),
      );

      newOptions = [
        ...tempOptions,
        ...vehicleFacetsBaseResult.marca.attributeValues,
        ...vehicleFacetsBaseResult.marca.modelo.attributeValues,
        ...vehicleFacetsBaseResult.marca.modelo.versao.attributeValues,
      ];
    }

    return newOptions;
  }, [brands, priceRanges, specificationFilters, vehicleFacetsBaseResult]);

  // PEGA OS FILTROS SELECIONADOS A PARTIR DA VARIAVEL FILTERS
  const selectedFilters = useSelectedFilters(newFilters).filter(
    facet => facet.selected,
  );

  const vehicleFacetsGrouped = groupBy(fac => {
    const curMap = fac.map;
    const currentNum = (curMap.match(/ve(\d)-/i) || []).pop();

    return currentNum ? `veiculo-${currentNum}` : 'outros';
  }, selectedFilters.filter(facet => facet.map.match(/ve\d\-/g)));

  const navigateToFacet = useFacetNavigation(
    useMemo(() => {
      return selectedFilters;
    }, [selectedFilters]),
  );

  if (selectedFilters.length === 0 && !query) {
    return null;
  }
  return (
    <div className={classNames(handles.filter__container)}>
      <div className={classNames(handles.filterTemplateOverflow)}>
        {query && (
          <FacetItemTerm
            map={map}
            key={query}
            query={query}
            className={handles.selectedFilterItem}
          />
        )}

        {selectedFilters
          .filter(facet => !facet.map.match(/ve\d\-/g))
          .map(facet => {
            if (facet.name !== 'Seminovo')
              return (
                <FacetItem
                  map={map}
                  key={facet.name}
                  facetTitle={facet.title}
                  facet={facet}
                  className={handles.selectedFilterItem}
                  preventRouteChange={preventRouteChange}
                  navigateToFacet={navigateToFacet}
                />
              );
          })}

        {Object.keys(vehicleFacetsGrouped).map(key => (
          <FacetItemList
            map={map}
            key={key}
            vehicle={key}
            facets={vehicleFacetsGrouped[key]}
            className={handles.selectedFilterItem}
            preventRouteChange={preventRouteChange}
            navigateToFacet={navigateToFacet}
          />
        ))}
      </div>
    </div>
  );
};

export default injectIntl(SelectedFilters);
