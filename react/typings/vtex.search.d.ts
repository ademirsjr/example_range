/* Typings for `vtex.search` */
declare module 'vtex.search/index' {
  import { ApolloQueryResult, ApolloClient } from 'apollo-client';

  declare class BiggyClient {
    constructor(client: ApolloClient<any>);
    topSearches: () => Promise<
      ApolloQueryResult<{ topSearches: ISearchesOutput }>
    >;

    prependSearchHistory(term: string, limit?: number);

    suggestionSearches(
      term: string,
    ): Promise<ApolloQueryResult<{ suggestionSearches: ISearchesOutput }>>;

    suggestionProducts(
      term: string,
      attributeKey?: string,
      attributeValue?: string,
      productOrigin: 'BIGGY' | 'VTEX' = 'BIGGY',
    ): Promise<ApolloQueryResult<{ suggestionProducts: IProductsOutput }>>;

    searchHistory(): string[];
  }

  declare class Product {
    constructor(
      public productId: string,
      public name: string,
      public brand: string,
      public productUrl: string,
      public price: number,
      public installment: IProductInstallment,
      public primaryImageUrl: string,
      public oldPrice: number,
      public categories?: string[],
      public skus?: IProductSku[],
      public extraInfo?: IProductExtraInfo[],
      public secondaryImageUrl?: string,
    );
    hasOldPrice(): boolean;
    isAvailable(): boolean;
    indExtraInfoByKey(key: string): string | null | undefined;
    toSummary(): IProductSummary;
  }

  interface IProductSummary {
    cacheId: string;
    productId: string;
    productName: string;
    productReference: string;
    linkText: string;
    brand: string;
    link: string;
    description: string;
    items: IProductSummarySku[];
    categories: string[];
  }

  interface IProductSummarySku {
    itemId: string;
    name: string;
    nameComplete: string;
    complementName: string;
    images: ISkuImage[];
    sellers: ISeller[];
    image: ISkuImage;
  }

  interface ISkuImage {
    cacheId: string;
    imageId: string;
    imageLabel: string;
    imageUrl: string;
    imageText: string;
  }

  interface ISeller {
    sellerId: string;
    sellerName: string;
    commertialOffer: {
      AvailableQuantity: number;
      discountHighlights: string[];
      teasers: any[];
      Installments:
        | [
            {
              Value: number;
              InterestRate: number;
              TotalValuePlusInterestRate: number;
              NumberOfInstallments: number;
              Name: string;
            },
          ]
        | null;
      Price: number;
      ListPrice: number;
      PriceWithoutDiscount: number;
    };
  }

  interface ISearchesOutput {
    searches: ISuggestionQueryResponseSearch[];
  }

  interface IProductsOutput {
    products: ISearchProduct[];
    count: number;
  }

  interface ISuggestionQueryResponseSearch {
    term: string;
    count: number;
    attributes: IElasticProductText[];
  }

  interface IElasticProductText {
    key: string;
    value: string;
    labelKey: string;
    labelValue: string;
  }

  interface ISearchProduct {
    id: string;
    name: string;
    url: string;
    images: IElasticProductImage[];
    oldPrice: number;
    price: number;
    oldPriceText: string;
    priceText: string;
    installment: IElasticProductInstallment;
    attributes: IElasticProductText[];
    extraInfo: IExtraInfo[];
    brand: string;
    product: string;
    categories: string[];
    skus: IProductSummarySku[];
  }

  interface IElasticProductImage {
    name: string;
    value: string;
  }

  export interface IElasticProductInstallment {
    count: number;
    value: number;
    interest: boolean;
    valueText: string;
  }

  interface IElasticProductText {
    key: string;
    value: string;
    labelKey: string;
    labelValue: string;
  }

  export interface IExtraInfo {
    key: string;
    value: string;
  }
}
