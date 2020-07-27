import { Item, AttributeItem, ItemDefault } from '../components/ItemList/types';
import { Product } from '../../../../../commons/models/product';
import {
  AutoCompletePreferences,
  TilePreferences,
  PriceFormatPreferences,
} from '../../../../../commons/settings/store-preferences';
import { IQuery } from '../../../SearchBar';
export interface AutoCompleteProps {
  summary: any;
  query: IQuery;
  empty: boolean;
  autocompletePreferences: AutoCompletePreferences;
  tilePreferences: TilePreferences;
  priceFormatPreferences: PriceFormatPreferences;
  updateQueryByHover: (item: Item | AttributeItem) => void;
  handleDocumentSubmit: () => void;
  cleanQuery: () => void;
  runtime: { page: string; account: string };
}

export interface AutoCompleteState {
  topSearchedItems: Item[];
  suggestionItems: Item[];
  categoryItems: ItemDefault[];
  modelItems: ItemDefault[];
  history: Item[];
  products: Product[];
  totalProducts: number;
  isFocused: boolean;
  currentTab: number;
  isMobile: boolean;
}
