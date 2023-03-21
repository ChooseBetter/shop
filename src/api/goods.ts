//商品相关的API函数
import request from "@/utils/request";
import {RelevantGoodsType, HotGoodsType} from "./types";

export const findGoods = (id: string | string[]) => {
  return request("/goods", "get", {id});
};

//获取商品同类推荐-未传入ID为猜喜欢
export const findrelevantGoods = ({id, limit = 16}: RelevantGoodsType) => {
  return request("/goods/relevant", "get", {id, limit});
};

//获取热榜商品
export const findHotGoods = ({id, type, limit = 3}: HotGoodsType) => {
  return request("/goods/hot", "get", {id, type, limit});
};

//获取商品的评价统计信息
export const findGoodsCommentInfo = (id: string) => {
  return request(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    "get"
  );
};
//获取商品的评价统计信息
export const findGoodsCommentList = (id: string, params: object) => {
  return request(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
    "get",
    params
  );
};
