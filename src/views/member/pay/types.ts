export type addressType = {
  address: string;
  addressTags: string;
  cityCode: string;
  contact: string;
  countyCode: string;
  fullLocation: string;
  id: string;
  isDefault: number;
  postalCode: string;
  provinceCode: string;
  receiver: string;
};

export type reqParamsType = {
  addressId: string | null;
  deliveryTimeType: number;
  payType: number;
  payChannel: number;
  buyerMessage: string | null;
  goods: any[];
};
