import * as React from 'react';
import {
  TilePreferences,
  PriceFormatPreferences,
} from '../../../../../../commons/settings/store-preferences';
import styles from './styles';
import { Product } from '../../../../../../commons/models/product';

interface TileListProps {
  summary: any;
  term: string;
  title: string;
  products: Product[];
  tilePreferences: TilePreferences;
  priceFormatPreferences: PriceFormatPreferences;
  showTitle: boolean;
  shelfProductCount: number;
  totalProducts: number;
}

export class TileList extends React.Component<TileListProps> {
  render() {
    const unseenProductsCount = Math.max(
      this.props.totalProducts - this.props.shelfProductCount,
      0,
    );

    return (
      <section className={styles.tileList}>
        {this.props.showTitle ? (
          <h1 className={styles.tileListTitle}>{this.props.title}</h1>
        ) : null}

        <ul className={styles.tileListList}>
          {this.props.products.slice(0, 3).map((product, index) => (
            <li key={index} className={styles.tileListItem}>
              {/* <ExtensionPoint
                id="product-summary"
                {...this.props.summary}
                product={product.toSummary()}
              /> */}
            </li>
          ))}
        </ul>

        <footer>
          {unseenProductsCount > 0 ? (
            <a
              className={styles.tileListSeeMore}
              href={`/${this.props.term}?map=ft`}
            >
              Veja mais {unseenProductsCount} produtos
            </a>
          ) : null}
        </footer>
      </section>
    );
  }
}
