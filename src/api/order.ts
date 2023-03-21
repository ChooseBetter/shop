import request from "@/utils/request";
import {addressType} from "@/views/member/pay/types";
import {OrderListType, cancelOrderType} from "@/api/types";

/**
 * 生成订单
 */
export const createOrder = () => {
  return request("/member/order/pre", "get");
};

/**
 * 添加收货地址信息
 * @param {Object} form - 地址对象
 */
export const addAddress = (form: object) => {
  return request("/member/address", "post", form);
};

/**
 * 编辑收货地址信息
 * @param {addressType} form - 地址对象
 */
export const editAddress = (form: addressType) => {
  return request(`/member/address/${form.id}`, "put", form);
};

/**
 * 提交订单
 * @param {Object} order - 订单信息对象
 */
export const submitOrder = (order: object) => {
  return request("/member/order", "post", order);
};

/**
 * 获取订单详情
 * @param {String} orderId - 订单ID
 */
export const findOrderDetail = (orderId: string) => {
  return request(`/member/order/${orderId}`, "get");
};

/**
 * 查询订单列表
 * @param {Number} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页条数
 * @returns
 */
export const findOrderList = ({
  orderState = 1,
  page = 10,
  pageSize = 0,
}: OrderListType) => {
  return request("/member/order", "get", {orderState, page, pageSize});
};

/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns Promise
 */
export const cancelOrder = ({orderId, cancelReason}: cancelOrderType) => {
  return request(`/member/order/${orderId}/cancel`, "put", {cancelReason});
};

/**
 * 删除订单
 * @param {Array<string>} ids - 删除订单，id集合
 * @returns
 */
export const delteOrder = (ids: string[]) => {
  return request("/member/order", "delete", {ids});
};

/**
 * 确认收货
 * @param {String} orderId 订单id
 * @returns
 */
export const confirmOrder = (orderId: string) => {
  return request(`/member/order/${orderId}/receipt`, "put");
};

/**
 * 查看物理
 * @param {String} id - 订单ID
 * @returns
 */
export const logisticsOrder = (id: string) => {
  return request(`/member/order/${id}/logistics`, "get");
};

/**
 * 获取再次购买的订单结算信息
 * @param {String} id - 订单ID
 * @returns
 */
export const findOrderRepurchase = (id: string) => {
  return request(`/member/order/repurchase/${id}`, "get");
};
