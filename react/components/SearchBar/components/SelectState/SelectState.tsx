import * as React from 'react';
import { AutocompleteInput, Button } from 'vtex.styleguide';
import { statesDefault, citiesDefault } from './model/StatesDefault';
import {
  ContextState,
  ProviderContext,
} from 'localizaseminovos.geolocal/index';
interface SelectStateProps {
  liststate: any[];
}
interface SelectStateState {
  term: string;
  termCities: string;
  loading: boolean;
  loadingCities: boolean;
  value: string;
  stateValue: string;
  filterCities: any[];
  citieValue: string;
  edit: boolean;
}
class SelectState extends React.Component<SelectStateProps, SelectStateState> {
  constructor(props: any) {
    super(props);
    this.state = {
      term: '',
      termCities: '',
      loading: false,
      loadingCities: false,
      value: '',
      stateValue: '',
      filterCities: [],
      citieValue: '',
      edit: false,
    };
    this.onClear = this.onClear.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClearCities = this.onClearCities.bind(this);
    this.onSearchCities = this.onSearchCities.bind(this);
    this.onChangeCities = this.onChangeCities.bind(this);
  }
  onSearch(...args: any) {
    return;
  }
  onSearchCities(...args: any) {
    return;
  }
  onChange(term: string) {
    let node = null;
    if (term) {
      this.setState({ loading: true });
      if (node) {
        clearTimeout(node);
      }
      node = setTimeout(() => {
        this.setState({ loading: false });
        this.setState({ term: term });
        node = null;
      }, 1000);
    } else {
      this.setState({ term: term });
    }
  }
  onChangeCities(term: string) {
    let node = null;
    if (term) {
      this.setState({ loadingCities: true });
      if (node) {
        clearTimeout(node);
      }
      node = setTimeout(() => {
        this.setState({ loadingCities: false });
        this.setState({ termCities: term });
        node = null;
      }, 1000);
    } else {
      this.setState({ termCities: term });
    }
  }
  onClear() {
    return this.setState({
      term: '',
      termCities: '',
      stateValue: '',
      filterCities: [],
    });
  }
  onClearCities() {
    return this.setState({ termCities: '' });
  }
  render() {
    return (
      <ProviderContext>
        <ContextState.Consumer>
          {() => {
            return (
              <div>
                {!this.state.edit && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {this.state.citieValue !== '' ? (
                      <div>
                        Resultados em{' '}
                        <div className="b">{this.state.stateValue}</div>
                      </div>
                    ) : (
                      <div>Escolha uma cidade</div>
                    )}
                    <Button
                      variation="tertiary"
                      onClick={() => this.setState({ edit: true })}
                    >
                      {this.state.citieValue !== '' ? 'Alterar' : 'Escolha'}
                    </Button>
                  </div>
                )}
                {this.state.edit && (
                  <AutocompleteInput
                    input={{
                      onChange: this.onChange,
                      onSearch: this.onSearch,
                      onClear: this.onClear,
                      placeholder: 'Digite seu estado',
                      value: this.state.term,
                    }}
                    options={{
                      onSelect: (args: any) => {
                        let stateSelect: any = citiesDefault.filter(
                          citie =>
                            citie.sigla.toLocaleLowerCase() == args.value,
                        );
                        let cities: any = [];
                        stateSelect.map((citiesState: any) => {
                          citiesState.cidades.map((cidade: string) => {
                            cities.push({ value: cidade, label: cidade });
                          });
                        });
                        this.setState({
                          stateValue: args.label,
                          filterCities: cities,
                        });
                      },
                      loading: this.state.loading,
                      value: !(this.state.term || '').length
                        ? []
                        : statesDefault.filter(
                            (user: { value: string; label: string }) =>
                              user.label
                                .toLowerCase()
                                .includes(this.state.term.toLowerCase()),
                          ),
                    }}
                  />
                )}
                {this.state.stateValue && this.state.edit && (
                  <AutocompleteInput
                    input={{
                      onChange: this.onChangeCities,
                      onSearch: this.onSearchCities,
                      onClear: this.onClearCities,
                      placeholder: 'Digite sua cidade',
                      value: this.state.termCities,
                    }}
                    options={{
                      onSelect: (args: any) => {
                        this.setState({ citieValue: args.value, edit: false });
                      },
                      loading: this.state.loadingCities,
                      value: !(this.state.termCities || '').length
                        ? []
                        : this.state.filterCities.filter(
                            (user: { value: string; label: string }) =>
                              user.label
                                .toLowerCase()
                                .includes(this.state.termCities.toLowerCase()),
                          ),
                    }}
                  />
                )}
              </div>
            );
          }}
        </ContextState.Consumer>
      </ProviderContext>
    );
  }
}

export default SelectState;
