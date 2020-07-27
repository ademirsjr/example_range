import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Item, AttributeItem } from './types';
import { searchBarValues } from '../../../../values';
import stylesCss from './styles.css';
import { Link } from 'vtex.render-runtime';
import { IconSearch } from 'vtex.store-icons';

interface ItemListProps {
  title: string;
  items: Item[];
  showTitle: boolean;
  term?: string;
  modifier?: string;
  onItemHover?: (item: Item | AttributeItem) => void;
  handleDocumentSubmit?: () => void;
}

interface ItemListState {
  currentTimeoutId: ReturnType<typeof setTimeout> | null;
}

export class ItemList extends React.Component<ItemListProps> {
  public readonly state: ItemListState = {
    currentTimeoutId: null,
  };

  handleMouseOver(e: React.MouseEvent, item: Item) {
    e.stopPropagation();

    const { currentTimeoutId } = this.state;

    if (!currentTimeoutId) {
      const timeoutId = setTimeout(() => {
        this.props.onItemHover ? this.props.onItemHover!(item) : null;
        this.setState({ currentTimeoutId: null });
      }, 100);

      this.setState({ currentTimeoutId: timeoutId });
    }
  }

  handleMouseOut() {
    const { currentTimeoutId } = this.state;

    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
      this.setState({ currentTimeoutId: null });
    }
  }

  handleKeyFormat(value: string, index: number) {
    let valueFormatted = value.toLowerCase().replace(/\s/g, '-');
    return 'itemlist-' + valueFormatted + '-' + index;
  }

  capitalize(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  handleValueFormat(value: any) {
    let term = this.capitalize(this.props.term);
    let valueFormatted = value.replace(
      term,
      "<span class='localizaseminovos-search-component-0-x-itemListValueTerm'>$&</span>",
    );
    let valueFormattedWrapper = (
      <span
        className={stylesCss.itemListValueNotEqual}
        dangerouslySetInnerHTML={{ __html: valueFormatted }}
      ></span>
    );

    if (value == term) {
      valueFormattedWrapper = (
        <span className={stylesCss.itemListValueEqual}>{value}</span>
      );
    }

    return valueFormattedWrapper;
  }

  render() {
    const modifier = this.props.modifier
      ? stylesCss[`itemList--${this.props.modifier}`]
      : '';

    return (
      <article className={`${stylesCss.itemList} ${modifier}`}>
        {this.props.showTitle ? (
          <h1 className={stylesCss.itemListTitle}>{this.props.title}</h1>
        ) : (
          <ol className={stylesCss.itemListList}>
            {this.props.items.map((item, index) => {
              return (
                <li
                  key={this.handleKeyFormat(item.value, index)}
                  className={`${stylesCss.itemListItem}  ${searchBarValues.clickableClass}`}
                  onMouseOver={e => this.handleMouseOver(e, item)}
                  onMouseOut={() => this.handleMouseOut()}
                >
                  <IconSearch size={14} />
                  <Link
                    className={stylesCss.itemListItemLink}
                    to={item.link}
                    query={`map=ft`}
                    onClick={this.props.handleDocumentSubmit}
                  >
                    {item.icon ? (
                      <span className={stylesCss.itemListIcon}>
                        <FontAwesomeIcon icon={item.icon} />
                      </span>
                    ) : null}

                    {item.prefix ? (
                      <span className={stylesCss.itemListPrefix}>
                        {item.prefix}
                      </span>
                    ) : null}
                    <span
                      className={`${searchBarValues.hoverValue} ${stylesCss.itemListValue}`}
                    >
                      {this.handleValueFormat(item.value)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </article>
    );
  }
}
