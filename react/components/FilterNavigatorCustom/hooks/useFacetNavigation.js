import { zip } from 'ramda';
import { useCallback } from 'react';
import { useRuntime } from 'vtex.render-runtime';
import { useFilterNavigator } from '../components/FilterNavigatorContext';
import { newFacetPathName } from '../utils/slug';
import { HEADER_SCROLL_OFFSET } from '../constants/SearchHelpers';
import {
  MAP_CATEGORY_CHAR,
  MAP_QUERY_KEY,
  MAP_VALUES_SEP,
  PATH_SEPARATOR,
} from '../constants';

const scrollOptions = {
  baseElementId: 'search-result-anchor',
  top: -HEADER_SCROLL_OFFSET,
};

const removeElementAtIndex = (strArray, index) =>
  strArray.filter((_, i) => i !== index);

const upsert = (array, item) => {
  const foundItemIndex = array.findIndex(
    e => e.value === item.value && e.map === item.map,
  );
  if (foundItemIndex === -1) {
    array.push(item);
  } else {
    array[foundItemIndex] = item;
  }
};

export const compareFacetWithQueryValues = (
  querySegment,
  mapSegment,
  facet,
) => {
  const vehicleNumber = (mapSegment.match(/ve\d-/i) || []).pop();

  return (
    decodeURIComponent(querySegment).toLowerCase() ===
      decodeURIComponent(facet.value).toLowerCase() &&
    mapSegment ===
      (vehicleNumber && !facet.map.match(/ve\d-/i)
        ? `${vehicleNumber}${facet.map}`
        : facet.map)
  );
};

const getIndexFromDuplicadeItems = array => {
  const duplicates = {};
  for (let idx = 0; idx < array.length; idx++) {
    // eslint-disable-next-line no-prototype-builtins
    if (duplicates.hasOwnProperty(array[idx])) duplicates[array[idx]].push(idx);
    else if (array.lastIndexOf(array[idx]) !== idx)
      duplicates[array[idx]] = [idx];
  }
  return duplicates;
};

const handleDuplicadeFreeTerm = (duplicateValue, currentValue) => {
  if (duplicateValue.price) currentValue.splice(duplicateValue.price[0], 1);
  if (duplicateValue.quilometragem)
    currentValue.splice(duplicateValue.quilometragem[0], 1);

  return currentValue;
};

const handleFreeTerm = ({ mapValue, freeTermIdx, newMapValue }) => {
  const FREE_TERM = 'ft';
  const MAP_VALUE = 'marca';
  const getFreeTermIndex = freeTermIdx.indexOf(FREE_TERM);
  const IsVehicleMapMarca = freeTermIdx.includes(MAP_VALUE);
  const IsFreeTermMap = freeTermIdx.includes(FREE_TERM);

  if (IsVehicleMapMarca && IsFreeTermMap)
    // eslint-disable-next-line no-param-reassign
    mapValue[getFreeTermIndex] = newMapValue;
};

const replaceQueryForNewQueryFormat = (
  queryString,
  mapString,
  selectedFacets,
) => {
  const queryArray = queryString.split(PATH_SEPARATOR);
  const mapArray = mapString.split(MAP_VALUES_SEP);
  const duplicadeItemsIndex = getIndexFromDuplicadeItems(mapArray);
  const NewQueryArray = handleDuplicadeFreeTerm(
    duplicadeItemsIndex,
    queryArray,
  );

  handleFreeTerm({
    mapValue: NewQueryArray,
    freeTermIdx: mapArray,
    newMapValue: 'seminovo',
  });

  const newQueryFormatArray = zip(NewQueryArray, mapArray).map(
    ([querySegment, mapSegment]) => {
      const facetForQuery = selectedFacets.find(facet => {
        return compareFacetWithQueryValues(querySegment, mapSegment, facet);
      });
      if (!facetForQuery) {
        return querySegment;
      }
      return newFacetPathName(facetForQuery);
    },
  );

  return newQueryFormatArray.join(PATH_SEPARATOR);
};

const removeMapForNewURLFormat = (map, selectedFacets) => {
  const mapArray = map.split(MAP_VALUES_SEP);
  handleFreeTerm({
    mapValue: mapArray,
    freeTermIdx: mapArray,
    newMapValue: 'tipo',
  });

  const mapsToFilter = selectedFacets.reduce((acc, facet) => {
    return facet.map === MAP_CATEGORY_CHAR ||
      (facet.newQuerySegment &&
        facet.newQuerySegment.toLowerCase() !== facet.value.toLowerCase())
      ? acc.concat(facet.map)
      : acc;
  }, []);
  return mapArray
    .filter(mapFacets => !mapsToFilter.includes(mapFacets))
    .join(MAP_VALUES_SEP);
};

const getCleanUrlParams = currentMap => {
  const urlParams = new URLSearchParams(window.location.search);
  const unmountURLSearchParams = currentMap.split(',');
  const duplicadeItemsIndex = getIndexFromDuplicadeItems(
    unmountURLSearchParams,
  );
  const newQueryArray = handleDuplicadeFreeTerm(
    duplicadeItemsIndex,
    unmountURLSearchParams,
  );
  const mountURLSearchParams = newQueryArray.join(',');

  urlParams.set(MAP_QUERY_KEY, mountURLSearchParams);
  if (!currentMap) urlParams.delete(MAP_QUERY_KEY);

  return urlParams;
};

const buildQueryAndMap = (
  querySegments,
  mapSegments,
  facets,
  selectedFacets,
) => {
  const queryAndMap = facets.reduce(
    ({ query, map }, facet) => {
      const facetValue = facet.value;
      facet.newQuerySegment = newFacetPathName(facet);
      if (facet.selected) {
        const facetIndex = zip(query, map).findIndex(([value, valueMap]) =>
          compareFacetWithQueryValues(value, valueMap, facet),
        );
        selectedFacets = selectedFacets.filter(
          selectedFacet =>
            selectedFacet.value !== facet.value &&
            selectedFacet.map !== facet.map,
        );
        return {
          query: removeElementAtIndex(query, facetIndex),
          map: removeElementAtIndex(map, facetIndex),
        };
      } else {
        upsert(selectedFacets, facet);
      }

      if (facet.map === MAP_CATEGORY_CHAR) {
        const lastCategoryIndex = map.lastIndexOf(MAP_CATEGORY_CHAR);
        if (lastCategoryIndex >= 0 && lastCategoryIndex !== map.length - 1) {
          // Corner case: if we are adding a category but there are other filter other than category applied. Add the new category filter to the right of the other categories.
          return {
            query: [
              ...query.slice(0, lastCategoryIndex + 1),
              facetValue,
              ...query.slice(lastCategoryIndex + 1),
            ],
            map: [
              ...map.slice(0, lastCategoryIndex + 1),
              facet.map,
              ...map.slice(lastCategoryIndex + 1),
            ],
          };
        }
      }

      return {
        query: [...query, facetValue],
        map: [...map, facet.map],
      };
    },
    { query: querySegments, map: mapSegments },
  );
  const newQueryMap = {
    query: queryAndMap.query.join(PATH_SEPARATOR),
    map: queryAndMap.map.join(MAP_VALUES_SEP),
  };
  return newQueryMap;
};

export const buildNewQueryMap = (query, map, facets, selectedFacets) => {
  const querySegments = (query && query.split(PATH_SEPARATOR)) || [];
  const mapSegments = (map && map.split(MAP_VALUES_SEP)) || [];

  return buildQueryAndMap(querySegments, mapSegments, facets, selectedFacets);
};

const useFacetNavigation = selectedFacets => {
  const { navigate, setQuery } = useRuntime();
  const { map, query } = useFilterNavigator();

  const navigateToFacet = useCallback(
    (maybeFacets, preventRouteChange = false) => {
      const facets = Array.isArray(maybeFacets) ? maybeFacets : [maybeFacets];
      const { query: currentQuery, map: currentMap } = buildNewQueryMap(
        query,
        map,
        facets,
        selectedFacets,
      );

      if (preventRouteChange) {
        setQuery({
          map: `${currentMap}`,
          query: `/${currentQuery}`,
          page: undefined,
        });
        return;
      }

      const newQuery = replaceQueryForNewQueryFormat(currentQuery, currentMap, [
        ...selectedFacets,
        ...facets,
      ]);

      const urlParams = getCleanUrlParams(
        removeMapForNewURLFormat(currentMap, [...selectedFacets, ...facets]),
      );

      navigate({
        to: `${PATH_SEPARATOR}${newQuery}`,
        query: urlParams.toString(),
        scrollOptions,
        modifiersOptions: {
          LOWERCASE: false,
        },
      });
    },
  );

  return navigateToFacet;
};

export default useFacetNavigation;
