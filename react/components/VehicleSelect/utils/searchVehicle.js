import { useQuery } from 'react-apollo';
import { pathOr } from 'ramda';

import searchVehicleQuery from '../queries/searchResult.gql';

export const VEHICLE_BASE = [{}, {}, {}];

export const MAX_VEHICLES = 3;

function mzFormatNumber(price) {
  return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}
function textOverflow(text, maxWidth) {
  return text && text.length > maxWidth
    ? `${text.substr(0, maxWidth - 3)}...`
    : text;
}
function fromAttributesToFacets(attribute) {
  if (attribute.type === 'number') {
    return {
      name: attribute.label,
      facets: attribute.values
        .map(value => {
          const priceFrom =
            value.from == '*' ? value.from : mzFormatNumber(value.from);

          const priceTo = value.to == '*' ? value.to : mzFormatNumber(value.to);

          let nameFormatted = `*${priceFrom}-até-${priceTo}*`;

          if (priceFrom == '*') nameFormatted = `Até-${priceTo}*`;
          else if (priceTo == '*') nameFormatted = `Mais de-${priceFrom}*`;

          return {
            quantity: value.count,
            name: unescape(nameFormatted),
            link: value.proxyUrl,
            linkEncoded: value.proxyUrl,
            map: attribute.key,
            selected: false,
            value: `${value.from}:${value.to}`,
          };
        })
        .sort((a, b) => {
          return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
        }),
    };
  }

  return {
    name: attribute.label,
    facets: attribute.values.map(value => {
      return {
        quantity: value.count,
        name: unescape(textOverflow(value.label, 40)),
        link: value.proxyUrl,
        linkEncoded: value.proxyUrl,
        map: attribute.key,
        selected: false,
        value: `${value.key}`,
      };
    }),
  };
}

export const getVehicleFacetsBase = variables => {
  const searchVehicle = useQuery(searchVehicleQuery, {
    variables,
    ssr: false,
    fetchPolicy: 'network-only',
  });

  const result = pathOr(null, ['data', 'searchVehicle'], searchVehicle);
  if (result && !result.filtered) {
    const marcaValues = result.marca.attributeValues;
    const modeloValues = result.marca.modelo.attributeValues;
    const versaoValues = result.marca.modelo.versao.attributeValues;

    result.marca.attributeValues = fromAttributesToFacets({
      label: 'Marca',
      key: 'marca',
      values: marcaValues,
    }).facets;

    result.marca.modelo.attributeValues = fromAttributesToFacets({
      label: 'Modelo',
      key: 'modelo',
      values: modeloValues,
    }).facets;

    result.marca.modelo.versao.attributeValues = fromAttributesToFacets({
      label: 'Versão',
      key: 'versao',
      values: versaoValues,
    }).facets;

    result.filtered = true;
  }
  return result;
};
