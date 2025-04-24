export interface Property {
  id: string;
  url: string;
  agency: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  condoFee: number;
  yearlyTax: number;
  address: string;
  code: string;
  createdAt: Date;
  renovated: boolean;
  estimatedRoi?: number;
}