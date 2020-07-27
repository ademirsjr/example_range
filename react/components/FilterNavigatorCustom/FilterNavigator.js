import React, { useMemo, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { flatten } from 'ramda';
import ContentLoader from 'react-content-loader';
import { FormattedMessage } from 'react-intl';
import { ExtensionPoint, useRuntime } from 'vtex.render-runtime';
import { useDevice } from 'vtex.device-detector';
import { Modal } from 'vtex.styleguide';
import FilterSidebar from './components/FilterSidebar';
import AvailableFilters from './components/AvailableFilters';
import { facetOptionShape, hiddenFacetsSchema } from './constants/propTypes';
import useSelectedFilters from './hooks/useSelectedFilters';
import useFacetNavigation from './hooks/useFacetNavigation';
import styles from './searchResult.css';
import { newFacetPathName } from './utils/slug';
import FilterButtonClear from './components/FilterButtonClear';
import VehicleSelect from '../VehicleSelect/VehicleSelect';
import SelectState from '../SelectState/SelectState';
import Button from './components/Button';
import { getVehicleFacetsBase } from '../VehicleSelect/utils/searchVehicle';
import {
  orderFacets,
  renameFacets,
  collapsedFacets,
  vehicleFacets,
  numberFacets,
  noOrderNames,
} from './constants/orderFacets';
import ContextFilter from './components/ContextFilter';

const LAYOUT_TYPES = {
  responsive: 'responsive',
  desktop: 'desktop',
};

const getSelectedCategories = tree => {
  // eslint-disable-next-line no-restricted-syntax
  for (const node of tree) {
    if (!node.selected) {
      return [];
    }
    if (node.children) {
      return [node, ...getSelectedCategories(node.children)];
    }
    return [node];
  }
  return [];
};

const newNamedFacet = facet => {
  return { ...facet, newQuerySegment: newFacetPathName(facet) };
};

/**
 * Wrapper around the filters (selected and available) as well
 * as the popup filters that appear on mobile devices
 */
const FilterNavigator = ({
  priceRange,
  tree = [],
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  loading = false,
  filters = [],
  preventRouteChange = false,
  initiallyCollapsed = false,
  layout = LAYOUT_TYPES.responsive,
}) => {
  const { navigate } = useRuntime();
  const { isMobile } = useDevice();
  const [valueCitie, setValueCitie] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isModalOpen, setIsModalOpen } = useContext(ContextFilter);
  useEffect(() => {
    if (window.localStorage && window.localStorage.getItem('location')) {
      const geolocal = JSON.parse(window.localStorage.getItem('location'));
      setValueCitie(geolocal.cidade);
    }
  }, [setValueCitie]);
  console.log(isModalOpen);
  const mobileLayout =
    (isMobile && layout === LAYOUT_TYPES.responsive) ||
    layout === LAYOUT_TYPES.mobile;

  const vehicleFacetsBaseResult = getVehicleFacetsBase({
    marca: null,
    modelo: null,
    versao: null,
  });

  const selectedFilters = useSelectedFilters(
    useMemo(() => {
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
          fil => !vehicleFacets.find(facets => facets.title == fil.title),
        );

        newOptions = [
          ...tempOptions,
          ...vehicleFacetsBaseResult.marca.attributeValues,
          ...vehicleFacetsBaseResult.marca.modelo.attributeValues,
          ...vehicleFacetsBaseResult.marca.modelo.versao.attributeValues,
        ];
      }

      return newOptions;
    }, [brands, priceRanges, specificationFilters, vehicleFacetsBaseResult]),
  ).filter(facet => facet.selected);

  const selectedCategories = getSelectedCategories(tree);
  const navigateToFacet = useFacetNavigation(
    useMemo(() => {
      return selectedFilters.concat(selectedCategories);
    }, [selectedFilters, selectedCategories]),
  );

  const handleClearFilters = () => {
    const getSelectedFilters = selectedFilters
      .filter(fil => fil.map !== 'tipo')
      .map(fil => ({ selected: false, ...fil }));

    navigateToFacet(getSelectedFilters);
  };

  const handleShowClearFilters = () => {
    const getSelectedFilters = selectedFilters.filter(
      fil => fil.map !== 'tipo',
    );
    return getSelectedFilters.length > 0;
  };

  const filtersVehicle = filters.filter(fil =>
    vehicleFacets.find(facets => facets.title == fil.title),
  );

  const getAvailableFilters = filters
    .filter(fil => !vehicleFacets.find(facets => facets.title == fil.title))
    .map(fil => {
      // RENOMEIA OS FACETS PRA SER IGUAL AO DO LAYOUT
      if (renameFacets[fil.title]) fil.title = renameFacets[fil.title];

      // ORDENA EM ORDEM ALFABÉTICA ASCENDENTE OU NÚMERICA DESCENDENTE
      if (numberFacets.indexOf(fil.title) >= 0)
        fil.facets = fil.facets.sort((a, b) =>
          a.name < b.name ? 1 : a.name > b.name ? -1 : 0,
        );

      if (noOrderNames.indexOf(fil.title) < 0)
        fil.facets = fil.facets.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
        );

      // ADICIONA SLUG AO KM
      if (fil.title === 'KM')
        fil.facets = fil.facets.map(facet => {
          return {...facet, slug: `de-${facet.range.from}-a-${facet.range.to}`}
        });

      // COLOCA OS FACETS QUE DEVEM SER COLAPSADOS POR PADRÃO
      if (collapsedFacets.indexOf(fil.title) >= 0)
        fil.oneSelectedCollapse = true;
      return fil;
    })
    .sort(
      (a, b) => orderFacets.indexOf(a.title) - orderFacets.indexOf(b.title),
    );

  const filterClasses = classNames({
    'flex items-center justify-center flex-auto h-100': mobileLayout,
  });

  const handleClose = () => {
    setIsSidebarOpen(false);
  };

  const handleOpen = () => {
    setIsSidebarOpen(true);
  };

  if (loading && !mobileLayout) {
    return (
      <div className="mv5">
        <ContentLoader
          style={{
            width: '230px',
            height: '320px',
          }}
          width="230"
          height="320"
          y="0"
          x="0"
        >
          <rect width="100%" height="1em" />
          <rect width="100%" height="8em" y="1.5em" />
          <rect width="100%" height="1em" y="10.5em" />
          <rect width="100%" height="8em" y="12em" />
        </ContentLoader>
      </div>
    );
  }

  if (mobileLayout) {
    return (
      <div className={styles.filters}>
        <div className={filterClasses}>
          <FilterSidebar
            open={isSidebarOpen}
            handleClose={handleClose}
            handleOpen={handleOpen}
          >
            <div className={`${styles.filterMobileSidebarBody} ph5 pt8 pb2`}>
              <Modal
                centered
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              >
                <h3 className={styles.modalSetStateTitle}>Onde você está?</h3>

                <div className={styles.modalSetState}>
                  <SelectState />
                </div>

                <div className={styles.modalSetStateButton}>
                  <Button
                    onClick={() => {
                      if (
                        window.localStorage &&
                        window.localStorage.getItem('location')
                      ) {
                        setIsModalOpen(false);

                        const urlParams = new URLSearchParams(
                          window.location.search,
                        );

                        navigate({
                          page: 'store.search',
                          query: urlParams.toString(),
                        });
                      }
                    }}
                  >
                    Confirmar
                  </Button>
                </div>
              </Modal>

              {window.localStorage &&
              window.localStorage.getItem('location') ? (
                <div
                  className={`${styles.search_geo} flex justify-between items-center`}
                >
                  <div
                    className={`${styles.search_geoContainer} flex justify-between`}
                  >
                    Resultados em <span className="ml2 b">{valueCitie}</span>
                  </div>

                  <Button
                    variation="tertiary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Alterar
                  </Button>
                </div>
              ) : (
                <div
                  className={`${styles.search_geo} flex justify-between items-center`}
                >
                  <div
                    className={`${styles.search_geoContainer} flex justify-between`}
                  >
                    Escolha uma cidade
                  </div>

                  <Button
                    variation="tertiary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Escolher
                  </Button>
                </div>
              )}

              <VehicleSelect
                filters={filtersVehicle}
                vehicleFacets={vehicleFacets}
                preventRouteChange={preventRouteChange}
                navigateToFacet={navigateToFacet}
              />

              <AvailableFilters
                filters={getAvailableFilters}
                priceRange={priceRange}
                priceRanges={priceRanges}
                preventRouteChange={preventRouteChange}
                initiallyCollapsed={initiallyCollapsed}
                navigateToFacet={navigateToFacet}
              />

              <div
                className={`${styles.filterButtonWrapper} flex justify-around`}
              >
                <button
                  className={`${styles.filterButtonSearch} ${
                    selectedFilters.length > 0 ? 'w-50' : 'w-100'
                  } pointer`}
                  onClick={handleClose}
                >
                  <FormattedMessage id="store/search-result.filter-button.search" />
                </button>

                <FilterButtonClear
                  isMobile
                  isSelected={handleShowClearFilters()}
                  handleClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </FilterSidebar>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={filterClasses}>
        <VehicleSelect
          filters={filtersVehicle}
          vehicleFacets={vehicleFacets}
          preventRouteChange={preventRouteChange}
          navigateToFacet={navigateToFacet}
        />

        <AvailableFilters
          filters={getAvailableFilters}
          priceRange={priceRange}
          priceRanges={priceRanges}
          preventRouteChange={preventRouteChange}
          initiallyCollapsed={initiallyCollapsed}
          navigateToFacet={navigateToFacet}
        />

        <div
          className={`${styles.filterButtonWrapper} ${
            selectedFilters.length <= 0 ? 'dn' : ''
          }`}
        >
          <FilterButtonClear
            isMobile={false}
            isSelected={handleShowClearFilters()}
            handleClearFilters={handleClearFilters}
          />
        </div>
      </div>
      <ExtensionPoint id="shop-review-summary" />
    </>
  );
};

FilterNavigator.propTypes = {
  tree: PropTypes.arrayOf(facetOptionShape),
  brands: PropTypes.arrayOf(facetOptionShape),
  /** List of specification filters (e.g. Android 7.0) */
  specificationFilters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      facets: PropTypes.arrayOf(facetOptionShape),
    }),
  ),
  /** List of price ranges filters (e.g. from-0-to-100) */
  priceRanges: PropTypes.arrayOf(facetOptionShape),
  /** Current price range filter query parameter */
  priceRange: PropTypes.string,
  /** Loading indicator */
  loading: PropTypes.bool,
  layout: PropTypes.oneOf(Object.values(LAYOUT_TYPES)),
  initiallyCollapsed: PropTypes.bool,
  ...hiddenFacetsSchema,
};

FilterNavigator.defaultProps = {
  brands: [],
  initiallyCollapsed: false,
  layout: LAYOUT_TYPES.responsive,
  loading: false,
  priceRange: [],
  priceRanges: [],
  specificationFilters: [],
  tree: [],
};

export default FilterNavigator;
