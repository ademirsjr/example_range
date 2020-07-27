import * as React from 'react';
import { ItemDefault } from './types';
import { searchBarValues } from '../../../../values';
import stylesCss from './styles.css';
import { Icon } from 'vtex.store-icons';
import { Link } from 'vtex.render-runtime';

interface ItemListDefaultProps {
  title: string;
  items: ItemDefault[];
  showTitle: boolean;
  modifier?: string;
  page: string;
  onItemHover?: (item: ItemDefault) => void;
  handleDocumentSubmit?: () => void;
}

interface ItemListDefaultState {
  currentTimeoutId: ReturnType<typeof setTimeout> | null;
}

export class ItemListDefault extends React.Component<ItemListDefaultProps> {
  public readonly state: ItemListDefaultState = {
    currentTimeoutId: null,
  };

  handleKeyFormat(value: string, index: number) {
    let valueFormatted = value.toLowerCase().replace(/\s/g, '-');
    return (
      'itemlistdefault-' + valueFormatted + '-' + index + '-' + Math.random()
    );
  }

  render() {
    return (
      <article className={`w-100 black flex  `}>
        {this.props.showTitle ? (
          <h1 className={stylesCss.itemListTitle}>{this.props.title}</h1>
        ) : null}
        <ol className={stylesCss.itemListDefault}>
          {this.props.items.map((item, index) => {
            let urlParams;
            if (typeof URLSearchParams !== 'undefined') {
              urlParams = new URLSearchParams(window.location.search);
            }

            return (
              <li
                key={this.handleKeyFormat(item.value, index)}
                className={`${stylesCss.itemListDefaultList}  ${searchBarValues.clickableClass} shadow-1`}
              >
                {this.props.page == 'store.search.v2' && urlParams && window ? (
                  <Link
                    className={stylesCss.itemListDefaultLink}
                    to={`${window.location.pathname}?${urlParams.toString()}`}
                    query={urlParams.toString()}
                    onClick={this.props.handleDocumentSubmit}
                  >
                    {item.icon ? (
                      <span className={stylesCss.itemListIcon}>
                        <Icon id={item.icon} size="63" viewBox="0, 0, 65, 26" />
                      </span>
                    ) : null}
                    {item.title ? (
                      <h3 className={stylesCss.itemListDefaultTitle}>
                        {item.title}
                      </h3>
                    ) : null}
                    {item.subtitle ? (
                      <h5 className={stylesCss.itemListDefaultSubTitle}>
                        {item.subtitle}
                      </h5>
                    ) : null}
                  </Link>
                ) : (
                  <Link
                    className={stylesCss.itemListDefaultLink}
                    to={item.link}
                    onClick={this.props.handleDocumentSubmit}
                  >
                    {item.icon ? (
                      <span className={stylesCss.itemListIcon}>
                        <Icon id={item.icon} size="63" viewBox="0, 0, 65, 26" />
                      </span>
                    ) : null}
                    {item.title ? (
                      <h3 className={stylesCss.itemListDefaultTitle}>
                        {item.title}
                      </h3>
                    ) : null}
                    {item.subtitle ? (
                      <h5 className={stylesCss.itemListDefaultSubTitle}>
                        {item.subtitle}
                      </h5>
                    ) : null}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </article>
    );
  }
}
