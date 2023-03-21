export interface reqParamsType {
  page: number;
  pageSize: number;
  categoryId: string | string[];
}
export interface sortParamsType {
  inventory: boolean;
  onlyDiscount: boolean;
  sortField: string | null;
  sortMethod: string | null;
}
export interface filterParamsType {
  brandId: string | string[] | null;
  attrs: any;
}
