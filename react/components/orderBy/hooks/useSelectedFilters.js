import { zip } from 'ramda';
import { useFilterNavigator } from './FilterNavigatorContext';

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

    const isSelected =
      queryAndMap.find(
        ([slug, slugMap]) => slug === currentFacetSlug && slugMap === facet.map,
      ) !== undefined;

    return {
      ...facet,
      selected: isSelected,
    };
  });
};

export default useSelectedFilters;
