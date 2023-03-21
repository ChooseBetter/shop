import request from "@/utils/request";

/**
 * 获取首页头部分类数据
 */
export const findAllCategory = () => {
  return request("/home/category/head", "get");
};

// 获取单个顶级类目数据
export const findTopCategory = (id: string | string[]) => {
  return request("/category", "get", {id});
};
// 获取二级类目的数据
export const findSubCategoryFilter = (id: string | string[]) => {
  return request("/category/sub/filter", "get", {id});
};

//获取分类下的商品
export const findSubCategoryGoods = (params: object) => {
  return request("/category/goods/temporary", "post", params);
};
