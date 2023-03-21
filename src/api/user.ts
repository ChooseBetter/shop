import request from "@/utils/request";
import {
  AccountLoginType,
  MobileLoginType,
  QQBindLoginType,
  QQPatchLoginType,
} from "./types";

/**
 * 帐号登录
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @returns Promise
 */
export const userAccountLogin = ({account, password}: AccountLoginType) => {
  return request("/login", "post", {account, password});
};

/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = (mobile: string) => {
  return request("/login/code", "get", {mobile});
};

/**
 * 短信登录
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} source - 客户端类型 1 PC
 * @returns Promise
 */
export const userMobileLogin = ({mobile, code}: MobileLoginType) => {
  return request("/login/code", "post", {mobile, code});
};

export const userQQLogin = (unionId: string, source = 1) => {
  return request("/login/social", "post", {unionId, source});
};

/**
 * 获取QQ绑定的时候短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQBindCode = (mobile: string) => {
  return request("/login/social/code", "get", {mobile});
};

/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = ({unionId, mobile, code}: QQBindLoginType) => {
  return request("/login/social/bind", "post", {unionId, mobile, code});
};

/**
 * 账号校验是否唯一
 * @param {String} account 账号
 * @returns
 */
export const userAccountCheck = (account: string) => {
  return request("/register/check", "get", {account});
};

/**
 * 获取QQ完善信息短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQPatchCode = (mobile: string) => {
  return request("/register/code", "get", {mobile});
};

/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @param {String} account - 账号
 * @param {String} password - 密码
 * @returns
 */
export const userQQPatchLogin = ({
  unionId,
  mobile,
  code,
  account,
  password,
}: QQPatchLoginType) => {
  return request(`/login/social/${unionId}/complement`, "post", {
    mobile,
    code,
    account,
    password,
  });
};
