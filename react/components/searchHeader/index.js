import classNames from 'classnames';
import React, { useMemo, Fragment, useState, useEffect } from 'react';

import { useDevice } from 'vtex.device-detector';
import { Modal } from 'vtex.styleguide';

import { useCssHandles } from 'vtex.css-handles';
import { useRuntime } from 'vtex.render-runtime';

const CSS_HANDLES = [
  'search_headerContainer',
  'search_tags',
  'search_geo',
  'search_geoContainer',
  'modalSetStateTitle',
  'modalSetState',
  'modalSetStateButton',
];

import Tags from '../FilterNavigatorCustom/Tags';
import FilterNavigatorContext from '../FilterNavigatorCustom/components/FilterNavigatorContext';
// import useFacetNavigation from '../FilterNavigatorCustom/hooks/useFacetNavigation';
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext';
import { pathOr } from 'ramda';

import SelectState from '../SelectState/SelectState';
import StatesDefault from '../SelectState/model/StatesDefault';
import Button from '../FilterNavigatorCustom/components/Button';

function searchHeader() {
  const { navigate } = useRuntime();
  const handles = useCssHandles(CSS_HANDLES);
  const { searchQuery } = useSearchPage();

  const queryArgs = pathOr({}, ['data', 'facets', 'queryArgs'], searchQuery);

  const { isMobile } = useDevice();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valueCitie, setValueCitie] = useState('');

  useEffect(() => {
    if (window.localStorage && window.localStorage.getItem('location')) {
      const geolocal = JSON.parse(window.localStorage.getItem('location'));
      setValueCitie(geolocal.cidade);
    }
  });

  return (
    <FilterNavigatorContext.Provider value={queryArgs}>
      <div className={`${classNames(handles.search_headerContainer)}`}>
        {window.localStorage && window.localStorage.getItem('location') ? (
          <div
            className={`${handles.search_geo} flex justify-between items-center`}
          >
            <div
              className={`${handles.search_geoContainer} flex justify-between`}
            >
              Resultados em <span className="ml2 b">{valueCitie}</span>
            </div>

            <Button variation="tertiary" onClick={() => setIsModalOpen(true)}>
              Alterar
            </Button>
          </div>
        ) : (
          <div
            className={`${handles.search_geo} flex justify-between items-center`}
          >
            <div
              className={`${handles.search_geoContainer} flex justify-between`}
            >
              Escolha uma cidade
            </div>

            <Button variation="tertiary" onClick={() => setIsModalOpen(true)}>
              Escolher
            </Button>
          </div>
        )}

        <Modal
          centered
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <h3 className={handles.modalSetStateTitle}>Onde você está?</h3>

          <div className={handles.modalSetState}>
            <SelectState />
          </div>

          <div className={handles.modalSetStateButton}>
            <Button
              onClick={() => {
                if (
                  window.localStorage &&
                  window.localStorage.getItem('location')
                ) {
                  setIsModalOpen(false);

                  const urlParams = new URLSearchParams(window.location.search);

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

        <div className={`${classNames(handles.search_tags)}`}>
          <Tags />
        </div>
      </div>
    </FilterNavigatorContext.Provider>
  );
}

export default searchHeader;
