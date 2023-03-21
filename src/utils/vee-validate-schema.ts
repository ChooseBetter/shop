import {userAccountCheck} from "@/api/user";

// 定义校验规则
export default {
  account(value: string | null) {
    if (!value) return "请输入用户名";
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return "字母开头且6-20个字符";
    return true;
  },
  //用户校验且校验唯一性
  async accountApi(value: string | null) {
    if (!value) return "请输入用户名";
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return "字母开头且6-20个字符";
    //服务器校验
    const data: any = await userAccountCheck(value);
    if (data.result.valid) return "用户名已存在";
    return true;
  },
  password(value: string | null) {
    if (!value) return "请输入密码";
    if (!/^\w{6,24}$/.test(value)) return "密码是6-24个字符";
    return true;
  },
  // 确认密码校验
  rePassword(value: string | null, {form}: any) {
    if (!value) return "请输入密码";
    if (!/^\w{6,24}$/.test(value)) return "密码是6-24个字符";
    if (value !== form.password) return "两次密码不一样";
    return true;
  },
  mobile(value: string | null) {
    if (!value) return "请输入手机号";
    if (!/^1[3-9]\d{9}$/.test(value)) return "手机号格式错误";
    return true;
  },
  code(value: string | null) {
    if (!value) return "请输入验证码";
    if (!/^\d{6}$/.test(value)) return "验证码是6个数字";
    return true;
  },
  isAgree(value: boolean) {
    if (!value) return "请勾选同意用户协议";
    return true;
  },
};
