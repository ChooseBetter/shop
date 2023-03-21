import {defineStore} from "pinia";
//import {UserState} from "@/store/types";
export const useUserStore = defineStore("user", {
  // 所有数据持久化
  // persist:true,
  // 数据持久化配置
  persist: {
    //本地存储名字,默认为当前store的id
    //key: "erabbit-shop-store",
    //修改存储器，默认为localStorage
    storage: window.sessionStorage,
    //指定需要存储的
    paths: ["profile"],
  },
  state: () => {
    return {
      profile: {
        id: "",
        account: "",
        avatar: "",
        nickName: "",
        mobile: "",
        token: "",
      },
      // 登录后回跳路径
      redirectUrl: "/",
    };
  },
  actions: {
    setUser(payload: any) {
      this.profile = payload;
    },
    clearUser() {
      this.profile = {
        id: "",
        avatar: "",
        nickName: "",
        account: "",
        mobile: "",
        token: "",
      };
    },
    setRedirectUrl(url: any) {
      this.redirectUrl = url;
    },
  },
});
