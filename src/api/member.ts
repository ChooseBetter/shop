import request from "@/utils/request";

/**
 * 获取收藏分页数据
 * @param {Interger} collectType 收藏类型：1位商品 2位专题 3为品牌
 * @returns
 */
export const findCollect = ({page = 1, pageSize = 10, collectType = 1}) => {
  return request("/member/collect", "get", {page, pageSize, collectType});
};
