export type RelevantGoodsType = {
  id: string;
  limit?: number;
};
export type HotGoodsType = {
  id: string;
  type: number;
  limit?: number;
};
export type AccountLoginType = {
  account: string;
  password: string;
};
export type MobileLoginType = {
  mobile: string;
  code: string;
};
export type QQBindLoginType = {
  unionId: string;
  mobile: string;
  code: string;
};
export type QQPatchLoginType = {
  unionId: string;
  mobile: string;
  code: string;
  account: string;
  password: string;
};

export type insertCartType = {
  skuId: string;
  count: number;
};
export type updateCartType = {
  skuId: string;
  selected: boolean;
  count: number;
};
export type checkAllCartType = {
  selected: boolean;
  ids: string[];
};

export type OrderListType = {
  page: number;
  pageSize: number;
  orderState: number;
};

export type cancelOrderType = {
  orderId: string;
  cancelReason: string;
};
