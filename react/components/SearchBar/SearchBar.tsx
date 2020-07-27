import * as React from 'react';
import { SearchInput } from './components/SearchInput/SearchInput';
import AutoComplete from './components/AutoComplete/AutoComplete';
import ModalBackdrop from './components/ModalBackdrop/ModalBackdrop';
import { StorePreferences } from '../../commons/settings/store-preferences';
import { NavigationOptions } from 'vtex.render-runtime';
// import { FilterButtonCustom } from 'vtex.search-result';
import FilterButtonCustom from '../FilterNavigatorCustom/components/FilterButtonCustom';

import stylesCss from './styles.css';
import {
  Item,
  AttributeItem,
  instaceOfAttributeItem,
} from './components/AutoComplete/components/ItemList/types';
import { BiggyClient } from 'vtex.search/index';
import { withApollo, WithApolloClient } from 'react-apollo';
import { withRuntime } from '../../commons/utils/withRuntime';

export interface IQuery {
  term: string;
  fromHover: boolean;
  key?: string;
  value?: string;
  force?: boolean;
}

export interface ISearchBarProps {
  summary: any;
  runtime: {
    navigate: (option: NavigationOptions) => void;
    account: string;
    page: string;
  };
}

interface SearchBarState {
  query: IQuery;
  isEmpty: boolean;
  isForce?: boolean;
}

class SearchBar extends React.Component<
  WithApolloClient<ISearchBarProps>,
  SearchBarState
> {
  client: BiggyClient;
  searchClass: string;
  autocompleteClass: string;

  constructor(props: WithApolloClient<ISearchBarProps>) {
    super(props);

    this.state = {
      query: { term: '', fromHover: false, force: false },
      isEmpty: true,
      isForce: false,
    };

    this.client = new BiggyClient(this.props.client);
    this.searchClass =
      'localizaseminovos-store-header-component-0-x-headerRow--mz-search';
    this.autocompleteClass = 'localizaseminovos-search-component-0-x-searchBar';
  }

  componentDidUpdate() {
    if (!this.state.isForce) return;

    (document.getElementsByClassName(
      'localizaseminovos-search-component-0-x-searchInputClose',
    )[0] as HTMLElement).click();

    (document.getElementsByClassName(
      'localizaseminovos-search-component-0-x-searchInputBack',
    )[0] as HTMLElement).click();

    (document.body as HTMLElement).click();

    (document.getElementsByClassName(
      'localizaseminovos-search-component-0-x-searchInputInput',
    )[0] as HTMLElement).blur();

    this.setState({
      query: { term: '', fromHover: false, force: true },
      isForce: false,
    });
  }

  updateQueryByItemHover(item: Item | AttributeItem) {
    if (instaceOfAttributeItem(item)) {
      this.setState({
        query: {
          term: item.groupValue,
          fromHover: true,
          key: item.key,
          value: item.value,
          force: false,
        },
      });
    } else {
      this.setState({
        query: {
          term: item.value,
          fromHover: true,
          key: undefined,
          value: undefined,
          force: false,
        },
      });
    }
  }

  handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    event.persist();

    const query = event.currentTarget.value;

    if (query && query !== '') {
      document
        .querySelectorAll("div[class*='" + this.searchClass + "']")[0]
        .classList.add(this.searchClass + '--notempty');
      document
        .getElementsByClassName(this.autocompleteClass)[0]
        .classList.add(this.autocompleteClass + '--notempty');

      this.setState({ isEmpty: true });
    } else {
      document
        .querySelectorAll("div[class*='" + this.searchClass + "']")[0]
        .classList.remove(this.searchClass + '--notempty');
      document
        .getElementsByClassName(this.autocompleteClass)[0]
        .classList.remove(this.autocompleteClass + '--notempty');

      this.setState({ isEmpty: false });
    }

    this.setState({ query: { term: query, fromHover: false, force: false } });
  }

  handleCloseClick(event: React.MouseEvent<HTMLInputElement>) {
    event.persist();

    (document.getElementsByClassName(
      'localizaseminovos-search-component-0-x-searchInputInput',
    )[0] as HTMLInputElement).value = '';

    document
      .querySelectorAll("div[class*='" + this.searchClass + "']")[0]
      .classList.remove(this.searchClass + '--notempty');
    document
      .getElementsByClassName(this.autocompleteClass)[0]
      .classList.remove(this.autocompleteClass + '--notempty');
    document
      .getElementsByTagName('html')[0]
      .classList.remove('localizaseminovos-search-component-0-x-off-d');

    this.setState({ query: { term: '', fromHover: false, force: true } });
  }

  cleanSearch(event: React.MouseEvent<HTMLInputElement>) {
    event.persist();

    this.setState({ query: { term: '*', fromHover: false, force: false } });
  }

  cleanQuery() {
    (document.getElementsByClassName(
      'localizaseminovos-search-component-0-x-searchInputInput',
    )[0] as HTMLInputElement).value = '';

    document
      .querySelectorAll("div[class*='" + this.searchClass + "']")[0]
      .classList.remove(this.searchClass + '--notempty');
    document
      .getElementsByClassName(this.autocompleteClass)[0]
      .classList.remove(this.autocompleteClass + '--notempty');

    this.setState({
      query: { term: '', fromHover: false, force: true },
      isEmpty: false,
    });
  }

  handleDocumentSubmit(force?: boolean) {
    (document.getElementsByClassName(
      'localizaseminovos-search-component-0-x-searchInputClose',
    )[0] as HTMLElement).click();

    (document.getElementsByClassName(
      'localizaseminovos-search-component-0-x-searchInputBack',
    )[0] as HTMLElement).click();

    (document.body as HTMLElement).click();

    (document.getElementsByClassName(
      'localizaseminovos-search-component-0-x-searchInputInput',
    )[0] as HTMLElement).blur();

    this.setState({
      query: { term: '', fromHover: false, force: true },
      isForce: force || false,
    });
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!this.state.query.fromHover) {
      this.client.prependSearchHistory(this.state.query.term);

      this.handleDocumentSubmit(true);

      if (this.props.runtime.page == 'store.search.v2') {
        this.props.runtime.navigate({
          to: this.props.runtime.page.replace(
            /\$\{term\}/g,
            this.state.query.term,
          ),
        });

        return;
      }
      this.props.runtime.navigate({
        page: 'store.search',
        params: { term: this.state.query.term },
        query: 'map=ft',
      });
      return;
    }
  }

  render() {
    const storePreferences: StorePreferences = {
      priceFormatPreferences: {
        prefix: 'R$ ',
        decimalPlaces: 2,
        floatIndicator: ',',
      },
      tilePreferences: {
        unavailableMessage: 'Indisponivel',
        oldPricePrefix: 'De: ',
        pricePrefix: 'Por: ',
        showPrefixOnlyWhenPriceHasOldPrice: true,
      },
      autoCompletePreferences: {
        productCount: 3,
        inputPlaceHolder: 'Busque por marca, modelo...',
        topSearchedListTitle: 'termos mais buscados',
        historyListTitle: 'histórico de buscas',
        suggestionListTitle: 'sugestões',
        emptySuggestionListTitle: 'Não encontramos o veículo procurado.',
        tileListTitle: 'produtos para "${query}"',
        subListItemPrefix: 'Em',
      },
    };
    return (
      <>
        <section className={stylesCss.searchBar}>
          <SearchInput
            currentQuery={this.state.query.term}
            onSubmit={this.onSubmit.bind(this)}
            placeholder={
              storePreferences.autoCompletePreferences.inputPlaceHolder
            }
            handleKeyUp={this.handleKeyUp.bind(this)}
            handleCloseClick={this.cleanSearch.bind(this)}
          />

          <AutoComplete
            summary={this.props.summary}
            query={this.state.query}
            empty={this.state.isEmpty}
            autocompletePreferences={storePreferences.autoCompletePreferences}
            tilePreferences={storePreferences.tilePreferences}
            priceFormatPreferences={storePreferences.priceFormatPreferences}
            updateQueryByHover={this.updateQueryByItemHover.bind(this)}
            handleDocumentSubmit={this.handleDocumentSubmit.bind(this)}
            cleanQuery={this.cleanQuery.bind(this)}
            runtime={this.props.runtime}
          />
        </section>

        <FilterButtonCustom showInDesktop="False" {...this.props} />

        <ModalBackdrop />
      </>
    );
  }
}

export default withApollo(withRuntime(SearchBar));
