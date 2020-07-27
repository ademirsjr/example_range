import { zip } from 'ramda';
import { useFilterNavigator } from '../components/FilterNavigatorContext';

const VEHICLE_REGEX = /ve\d\-/g;

/**
 * This hook is required because we make the facets query
 * with only the categories and fulltext parameters, so we
 * need to calculate manually if the other filters are selected
 */
const useSelectedFilters = facets => {
  const { query, map } = useFilterNavigator();

  if (!query && !map) {
    return [];
  }

  const queryAndMap = zip(
    query
      .toLowerCase()
      .split('/')
      .map(decodeURIComponent),
    map.split(','),
  );

  return facets.map(facet => {
    const currentFacetSlug = decodeURIComponent(facet.value).toLowerCase();
    let currentVehicleMap = null;

    const isSelected =
      queryAndMap.find(([slug, slugMap]) => {
        const currentMap = slugMap.replace(VEHICLE_REGEX, '');
        const condition = slug === currentFacetSlug && currentMap === facet.map;

        if (slugMap.match(VEHICLE_REGEX) && condition)
          currentVehicleMap = slugMap;

        return condition;
      }) !== undefined;

    if (currentVehicleMap) {
      return {
        ...facet,
        map: currentVehicleMap,
        selected: isSelected,
      };
    }

    return {
      ...facet,
      selected: isSelected,
    };
  });
};

export default useSelectedFilters;
