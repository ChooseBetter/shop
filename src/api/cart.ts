// 购物车
import request from "@/utils/request";
import {insertCartType, updateCartType, checkAllCartType} from "./types";

/**
 * 获取商品的 最新价格 库存 是否有效
 * @param {String} skuId
 */
export const getNewCartGoods = (skuId: string) => {
  return request(`/goods/stock/${skuId}`, "get");
};

/**
 * 获取商品对应的sku数据
 * @param {String} skuId SKU id
 * @returns
 */
export const getSpecsAndSkus = (skuId: string) => {
  return request(`/goods/sku/${skuId}`, "get");
};

/**
 * 合并购物车
 * @param {Array<object>} cartList - 购物车数组
 * @param {String} item.skuId - 商品SKUID
 * @param {Boolean} item.selected - 是否选中
 * @param {Integer} item.count - 数量
 */
export const mergeLocalCart = (cartList: any[]) => {
  return request("/member/cart/merge", "post", cartList);
};

/**
 * 获取登录后的购物车列表
 * @returns Promise
 */
export const findCartList = () => {
  return request("/member/cart", "get");
};

/**
 * 加入购物车
 * @param {String} skuId - 商品SKUID
 * @param {Number} count - 商品数量
 * @returns Promise
 */
export const insertCart = ({skuId, count}: insertCartType) => {
  return request("/member/cart", "post", {skuId, count});
};

/**
 * 删除商品（支持批量删除）
 * @param {Array<string>} ids - skuId集合
 * @returns Promise
 */
export const deleteCart = (ids: string[]) => {
  return request("/member/cart", "delete", {ids});
};

/**
 * 修改购物车商品的状态和数量
 * @param {String} goods.skuId - 商品sku
 * @param {Boolean} goods.selected - 选中状态
 * @param {Integer} goods.count - 商品数量
 * @returns Promise
 */
export const updateCart = ({skuId, selected, count}: updateCartType) => {
  return request(`/member/cart/${skuId}`, "put", {selected, count});
};

/**
 * 全选反选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - 有效商品skuId集合
 * @returns Promise
 */
export const checkAllCart = ({selected, ids}: checkAllCartType) => {
  return request("/member/cart/selected", "put", {selected, ids});
};
