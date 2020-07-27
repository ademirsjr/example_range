import { faHistory } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
// import ReactDOM from 'react-dom';
import { withApollo, WithApolloClient } from 'react-apollo';
import { hasClass, isDescendant } from '../../../../commons/utils/dom-utils';
import { searchBarValues } from '../../values';
import { ItemList } from './components/ItemList/ItemList';
import { ItemListDefault } from './components/ItemList/ItemListDefault';
import { Item, AttributeItem, ItemDefault } from './components/ItemList/types';
import { BiggyClient } from 'vtex.search/index';
import stylesCss from './styles.css';
import {
  AutoCompleteProps,
  AutoCompleteState,
} from './interfaces/AutocompleteProps';
import { Product } from '../../../../commons/models/product';
import { Tabs, Tab } from 'vtex.styleguide';
import { categoryItems, modelItems } from './model/ListDefault';
import FilterButtonCustom from '../../../FilterNavigatorCustom/components/FilterButtonCustom';
import ContextFilterProvider from '../../../FilterNavigatorCustom/components/ContextFilterProvider';

class AutoComplete extends React.Component<
  WithApolloClient<AutoCompleteProps>,
  Partial<AutoCompleteState>
> {
  autocompleteRef: React.RefObject<any>;
  client: BiggyClient;

  constructor(props: WithApolloClient<AutoCompleteProps>) {
    super(props);

    this.client = new BiggyClient(this.props.client);
    this.autocompleteRef = React.createRef();

    this.state = {
      categoryItems,
      modelItems,
      topSearchedItems: [],
      history: [],
      products: [],
      isFocused: false,
      totalProducts: 0,
      currentTab: 1,
    };

    this.mobilecheck = this.mobilecheck.bind(this);
  }

  componentDidMount() {
    this.addListeners();

    this.updateTopSearches();
    this.updateHistory();
  }

  addListeners() {
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  mobilecheck() {
    var check = false;
    (function(a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a,
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4),
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor);
    this.setState({ isMobile: check });
  }

  handleDocumentClick(e: Event) {
    this.mobilecheck();
    let mobile = this.state.isMobile;
    let isEmpty = this.props.empty;

    const target = e.target as HTMLElement;
    const searchClass =
      'localizaseminovos-store-header-component-0-x-headerRow--mz-search';
    const autocompleteClass =
      'localizaseminovos-search-component-0-x-searchBar';
    const searchInputBackClass =
      'localizaseminovos-search-component-0-x-searchInputBack';
    const filterButtonClass = 'filterButtonOpenMobile';

    const notFocused =
      hasClass(target, searchInputBackClass) ||
      isDescendant(
        document.getElementsByClassName(searchInputBackClass)[0] as HTMLElement,
        target,
      ) ||
      !isDescendant(
        document.getElementsByClassName(autocompleteClass)[0] as HTMLElement,
        target,
      );

    if (!notFocused) {
      document
        .querySelectorAll(
          "div[class*='localizaseminovos-store-header-component-0-x-headerRow--mz-search']",
        )[0]
        .classList.add(searchClass + '--on');
      document
        .getElementsByClassName(autocompleteClass)[0]
        .classList.add(autocompleteClass + '--on');
      document
        .getElementsByTagName('html')[0]
        .classList.add('localizaseminovos-search-component-0-x-off');
      document
        .querySelectorAll("div[class$='" + filterButtonClass + "']")
        .forEach(function(div) {
          if (mobile) {
            if (div.className.indexOf('Mobile') > 0)
              div.setAttribute('style', 'display: none');
          } else div.setAttribute('style', 'display: none');
        });
    } else if (isEmpty) {
      this.props.cleanQuery();

      return;
    } else {
      document
        .querySelectorAll(
          "div[class*='localizaseminovos-store-header-component-0-x-headerRow--mz-search']",
        )[0]
        .classList.remove(searchClass + '--on');
      document
        .getElementsByClassName(autocompleteClass)[0]
        .classList.remove(autocompleteClass + '--on');
      document
        .getElementsByTagName('html')[0]
        .classList.remove('localizaseminovos-search-component-0-x-off');
      document
        .querySelectorAll("div[class$='" + filterButtonClass + "']")
        .forEach(function(div) {
          if (mobile) {
            if (div.className.indexOf('Mobile') > 0)
              div.setAttribute('style', 'display: block');
          } else div.setAttribute('style', 'display: block');
        });
    }

    this.setState({
      isFocused: !notFocused,
    });
  }

  shouldUpdate(prevProps: AutoCompleteProps) {
    const query = this.props.query;
    const prevQuery = prevProps.query;

    return (
      query.term !== prevQuery.term ||
      query.key !== prevQuery.key ||
      (query.force && query.force != prevQuery.force)
    );
  }

  componentDidUpdate(
    prevProps: AutoCompleteProps,
    _: AutoCompleteState,
    __: any,
  ) {
    const query = this.props.query;

    if (this.shouldUpdate(prevProps)) {
      if (query.term === null || query.term === '') {
        this.updateTopSearches();
        this.updateHistory();
      } else {
        this.updateSuggestions().then(() => this.updateProducts());
      }
    }
  }

  async updateSuggestions() {
    if (this.props.query.fromHover) {
      return;
    }

    /* Dados modificados para teste */
    // this.props.runtime.account = 'localizaseminovos';
    //const key = "cor";
    //const value = "vermelho";
    /* Dados modificados para teste */

    const result = await this.client.suggestionSearches(this.props.query.term);
    const { searches } = result.data.suggestionSearches;

    const items = searches.map(query => {
      const attributes = query.attributes || [];
      return {
        term: query.term,
        attributes: attributes.map(att => ({
          label: att.labelValue,
          value: att.value,
          link: `/${query.term}/${att.value}/?map=ft,${att.key}`,
          groupValue: query.term,
          key: att.key,
        })),
      };
    });
    const suggestionItems: Item[] = items.map(suggestion => ({
      label: suggestion.term,
      value: suggestion.term,
      groupValue: suggestion.term,
      link: `/${suggestion.term}?map=ft`,
      attributes: suggestion.attributes,
    }));

    this.setState({ suggestionItems });
  }

  async updateProducts() {
    const term = this.props.query.term;

    if (!term) {
      this.setState({
        products: [],
        totalProducts: 0,
      });

      return;
    }

    const query = this.props.query;

    const result = await this.client.suggestionProducts(
      term,
      query.key,
      query.value,
    );

    const { suggestionProducts } = result.data;

    const products = suggestionProducts.products.map(
      product =>
        new Product(
          product.id,
          product.name,
          product.url,
          product.price,
          product.installment,
          product.images && product.images.length > 0
            ? product.images[0].value
            : '',
          product.oldPrice,
          product.extraInfo,
        ),
    );

    this.setState({
      products,
      totalProducts: suggestionProducts.count,
    });
  }

  async updateTopSearches() {
    const result = await this.client.topSearches();
    const { searches } = result.data.topSearches;

    const topSearchedItems = searches.map(
      (query, index) =>
        ({
          prefix: `${index + 1}º`,
          value: query.term,
          link: `/${query.term}?map=ft`,
        } as Item),
    );

    this.setState({ topSearchedItems });
  }
  updateHistory() {
    const history = this.client.searchHistory().map((item: string) => {
      return {
        label: item,
        value: item,
        link: `/${item}?map=ft`,
        icon: faHistory,
      };
    });

    this.setState({
      history,
    });
  }
  handleTabChange(tabIndex: number) {
    this.setState({
      currentTab: tabIndex,
    });
  }
  renderSuggestions() {
    const hasSuggestion =
      !!this.state.suggestionItems && this.state.suggestionItems.length > 0;

    const preferences = this.props.autocompletePreferences;

    const title = hasSuggestion
      ? preferences.suggestionListTitle
      : preferences.emptySuggestionListTitle;

    return (
      <ItemList
        title={title}
        term={this.props.query.term}
        items={this.state.suggestionItems || []}
        modifier="suggestion"
        showTitle={!hasSuggestion}
        onItemHover={this.props.updateQueryByHover}
        handleDocumentSubmit={this.props.handleDocumentSubmit}
      />
    );
  }

  contentWhenQueryIsEmpty() {
    return (
      <ContextFilterProvider>
        <div className={`center w-100 z-2 ${stylesCss['searchTabsWrapper']}`}>
          <p className={`tc f5 ${stylesCss['searchTabsTitle']}`}>
            Se preferir, navegue por
          </p>
          <Tabs>
            <Tab
              label="Categorias"
              active={this.state.currentTab === 1}
              onClick={() => this.handleTabChange(1)}
            >
              <div className={`${stylesCss['searchTabItemsList']}`}>
                <ItemListDefault
                  modifier="top-search"
                  title="Categorias"
                  items={categoryItems}
                  showTitle={false}
                  page={this.props.runtime.page}
                  handleDocumentSubmit={this.props.handleDocumentSubmit}
                />
              </div>
            </Tab>

            <Tab
              label="Modelos"
              active={this.state.currentTab === 2}
              onClick={() => this.handleTabChange(2)}
            >
              <div className={`${stylesCss['searchTabItemsList']}`}>
                <ItemListDefault
                  modifier="history"
                  title="Modelos"
                  items={modelItems}
                  showTitle={false}
                  page={this.props.runtime.page}
                  handleDocumentSubmit={this.props.handleDocumentSubmit}
                />
              </div>
            </Tab>
          </Tabs>

          <FilterButtonCustom
            title="Busca avançada"
            css="AutoComplete"
            {...this.props}
          />
        </div>
      </ContextFilterProvider>
    );
  }

  contentWhenQueryIsNotEmpty() {
    return (
      <div className={stylesCss.searchAutocompleteWrapper}>
        {this.renderSuggestions()}
      </div>
    );
  }

  renderContent() {
    const query = this.props.query.term.trim();

    return query && query !== ''
      ? this.contentWhenQueryIsNotEmpty()
      : this.contentWhenQueryIsEmpty();
  }

  render() {
    const hiddenClass = !this.state.isFocused
      ? stylesCss['biggy-js-container--hidden']
      : stylesCss['biggy-js-container--show'];

    return (
      <section
        ref={this.autocompleteRef}
        // tslint:disable-next-line: max-line-length
        className={`${stylesCss['biggy-autocomplete']} ${searchBarValues.containerClass} ${hiddenClass}`}
      >
        {this.renderContent()}
      </section>
    );
  }
}

export default withApollo(AutoComplete);
