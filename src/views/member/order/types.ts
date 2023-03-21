export type tabClickType = {
  name: string;
  index: number;
};

export type orderType = {
  countdown: number;
  createTime: string;
  id: string;
  orderState: number;
  payChannel: number;
  payLatestTime: string;
  payMoney: number;
  payType: number;
  postFee: number;
  skus: any[];
  totalMoney: number;
  totalNum: number;
};
