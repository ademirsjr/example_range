import React, { useState, useEffect } from 'react';
import AutocompleteInput from './AutocompleteInput';
import {
  statesDefault,
  citiesDefault,
  citiesLatLong,
} from './model/StatesDefault';

import styles from './styles.css';

const SelectState = props => {
  const [term, setTerm] = useState('');
  const [termCities, setTermCities] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [value, setValue] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [filterCities, setFilterCities] = useState([]);
  const [citieValue, setCitieValue] = useState('');
  const [getGeoverify, setGetGeoverify] = useState(false);

  useEffect(() => {
    const geolocal = JSON.parse(window.localStorage.getItem('location'));
    if (getGeoverify && geolocal) {
      let stateSelect = citiesDefault.filter(
        citie => citie.sigla.toLocaleLowerCase() == geolocal.siglaEstado,
      );
      let cities = [];
      stateSelect.map(citiesState => {
        citiesState.cidades.map(cidade => {
          cities.push({ value: cidade, label: cidade });
        });
      });
      setStateValue(geolocal.estado);
      setTerm(geolocal.estado);
      setCitieValue(geolocal.cidade);
      setFilterCities(cities);
      setTermCities(geolocal.cidade);
      setGetGeoverify(true);
    }
  });
  const setGeoLocalStorage = (
    latitude,
    longitude,
    cidade,
    estado,
    siglaEstado,
  ) => {
    if (window.localStorage.getItem('location')) {
      localStorage.removeItem('location');
    }
    window.localStorage.setItem(
      'location',
      JSON.stringify({
        latitude: latitude,
        longitude: longitude,
        cidade: cidade,
        estado: estado,
        siglaEstado: siglaEstado,
      }),
    );
  };
  const onSearch = (...args) => {};
  const onSearchCities = (...args) => {};
  const onChange = term => {
    let node = null;
    if (term) {
      setLoading(true);
      if (node) {
        clearTimeout(node);
      }
      node = setTimeout(() => {
        setLoading(false);
        setTerm(term);
        node = null;
      }, 1000);
    } else {
      setTerm(term);
    }
  };
  const onChangeCities = term => {
    let node = null;
    if (term) {
      setLoadingCities(true);
      if (node) {
        clearTimeout(node);
      }
      node = setTimeout(() => {
        setLoadingCities(false);
        setTermCities(term);
        node = null;
      }, 1000);
    } else {
      setTermCities(term);
    }
  };
  const onClear = () => {
    setTerm('');
    setTermCities('');
    setStateValue('');
    setFilterCities([]);
  };
  const onClearCities = () => {
    return setTermCities('');
  };
  const retiraAcentos = str => {
    const comAcento =
      'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ';

    const semAcento =
      'AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr';
    let novastr = '';
    for (let i = 0; i < str.length; i++) {
      let troca = false;
      for (let a = 0; a < comAcento.length; a++) {
        if (str.substr(i, 1) == comAcento.substr(a, 1)) {
          novastr += semAcento.substr(a, 1);
          troca = true;
          break;
        }
      }
      if (troca == false) {
        novastr += str.substr(i, 1);
      }
    }
    return novastr;
  };
  return (
    <div className="bg-white">
      <div
        className={`${styles.filterSelectState} flex justify-between items-center`}
      >
        {
          <AutocompleteInput
            className={`${styles.filterStateInput}`}
            input={{
              onChange: onChange,
              onSearch: onSearch,
              onClear: onClear,
              placeholder: 'Digite seu estado',
              value: term,
            }}
            options={{
              onSelect: args => {
                let stateSelect = citiesDefault.filter(
                  citie => citie.sigla.toLocaleLowerCase() == args.value,
                );
                let cities = [];
                stateSelect.map(citiesState => {
                  citiesState.cidades.map(cidade => {
                    cities.push({ value: cidade, label: cidade });
                  });
                });
                setStateValue(args.label);
                setFilterCities(cities);
                setTerm(args.label);
              },
              loading: loading,
              value: !term.length
                ? []
                : statesDefault.filter(user =>
                    user.label.toLowerCase().includes(term.toLowerCase()),
                  ),
            }}
          />
        }
      </div>

      {stateValue && (
        <div
          className={`${styles.filterSelectState} flex justify-between items-center`}
        >
          <AutocompleteInput
            className={`${styles.filterStateInput}`}
            input={{
              onChange: onChangeCities,
              onSearch: onSearchCities,
              onClear: onClearCities,
              placeholder: 'Digite sua cidade',
              value: termCities,
            }}
            options={{
              onSelect: args => {
                setGeoLocalStorage(
                  citiesLatLong.filter(
                    citie =>
                      retiraAcentos(args.value.toUpperCase()) ===
                      citie.municipio,
                  )[0].latitude,
                  citiesLatLong.filter(
                    citie =>
                      retiraAcentos(args.value.toUpperCase()) ===
                      citie.municipio,
                  )[0].longitude,
                  args.value,
                  stateValue,
                  statesDefault.filter(states => stateValue === states.label)[0]
                    .value,
                );
                setCitieValue(args.value);
                setTermCities(args.value);
              },
              loading: loadingCities,
              value: !termCities.length
                ? []
                : filterCities.filter(user =>
                    user.label.toLowerCase().includes(termCities.toLowerCase()),
                  ),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SelectState;
