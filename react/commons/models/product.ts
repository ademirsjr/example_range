import { IExtraInfo, IElasticProductInstallment } from '../utils/biggy-client';

interface ISkuImage {
  cacheId: string;
  imageId: string;
  imageLabel: string;
  imageUrl: string;
  imageText: string;
}

export interface IProductSummary {
  cacheId: string;
  productId: string;
  productName: string;
  productReference: string;
  linkText: string;
  brand: string;
  link: string;
  sku: ISkuItem;
  description: string;
  items: any;
}

interface ISkuItem {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  images: ISkuImage[];
  seller: {
    sellerId: string;
    sellerName: string;
    commertialOffer: {
      AvailableQuantity: number;
      discountHighlights: string[];
      Installments: [
        {
          Value: number;
          InterestRate: number;
          TotalValuePlusInterestRate: number;
          NumberOfInstallments: number;
          Name: string;
        },
      ] | null;
      Price: number;
      ListPrice: number;
      PriceWithoutDiscount: number;
    };
  };
  image: ISkuImage;
}

export class Product {
  constructor(
    public productId: string,
    public name: string,
    public productUrl: string,
    public price: number,
    public installment: IElasticProductInstallment,
    public primaryImageUrl: string,
    public oldPrice?: number,
    public extraInfo?: IExtraInfo[],
    public secondaryImageUrl?: string,
  ) { }

  hasOldPrice() {
    return this.oldPrice && this.oldPrice !== 0 && this.oldPrice < this.price;
  }

  isAvailable() {
    return this.price && this.price > 0;
  }

  findExtraInfoByKey(key: string) {
    if (!this.extraInfo) {
      return;
    }

    const info = this.extraInfo.find(currentInfo => currentInfo.key === key);

    return info ? info.value : null;
  }

  toSummary(): IProductSummary {
    const mainImage: ISkuImage = {
      cacheId: this.productId,
      imageId: this.productId,
      imageLabel: 'principal',
      imageUrl: this.primaryImageUrl,
      imageText: 'principal',
    };

    const sku: ISkuItem = {
      itemId: this.productId,
      name: this.name,
      nameComplete: this.name,
      complementName: this.name,
      images: [mainImage],
      seller: {
        sellerId: '1',
        sellerName: 'Farmácias Pague Menos',
        commertialOffer: {
          AvailableQuantity: 1000000,
          discountHighlights: [],
          Installments: this.installment
            ? [
              {
                Value: this.installment.value,
                InterestRate: 0,
                TotalValuePlusInterestRate: this.price,
                NumberOfInstallments: this.installment.count,
                Name: '',
              },
            ]
            : null,
          Price: this.price,
          ListPrice: this.oldPrice || this.price,
          PriceWithoutDiscount: this.price,
        },
      },
      image: mainImage,
    };

    return {
      sku,
      cacheId: this.name.replace(' ', '-'),
      productId: this.productId,
      productName: this.name,
      productReference: this.productId,
      linkText: this.slugifyUrl(this.productUrl),
      brand: this.findExtraInfoByKey('marca') || '',
      link: this.productUrl,
      description: this.name,
      items: [],
    };
  }

  private slugifyUrl(url: string) {
    const parts = url.replace(/\/p$/, '').split('/');
    return parts[parts.length - 1];
  }
}
