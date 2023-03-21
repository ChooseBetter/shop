import {defineStore} from "pinia";
import {useUserStore} from "@/store/modules/user";
import {goodType} from "../types";
import {
  checkAllCart,
  deleteCart,
  findCartList,
  getNewCartGoods,
  insertCart,
  mergeLocalCart,
  updateCart,
} from "@/api/cart";

const userStore = useUserStore();

export const useCartStore = defineStore("cart", {
  persist: {
    storage: window.sessionStorage,
    //指定需要存储的
    paths: ["list"],
  },
  state: () => {
    return {
      list: <any>[],
    };
  },
  getters: {
    // 有效商品列表
    validList(): any[] {
      return this.list.filter(
        (goods: goodType) => goods.stock > 0 && goods.isEffective
      );
    },
    // 有效商品总件数
    validTotal(): number {
      return this.validList.reduce((p: any, c: any) => p + c.count, 0);
    },
    // 有效商品总金额
    validAmount(): number {
      return (
        this.validList.reduce(
          (p: any, c: any) => p + c.count * Math.round(c.nowPrice * 100),
          0
        ) / 100
      );
    },
    // 无效商品列表
    invalidList(): any[] {
      return this.list.filter(
        (goods: goodType) => goods.stock < 0 || !goods.isEffective
      );
    },
    // 已选商品列表
    selectedList(): any[] {
      return this.validList.filter((item) => item.selected);
    },
    // 已选商品件数
    selectedTotal(): number {
      return this.selectedList.reduce((p: any, c: any) => p + c.count, 0);
    },
    // 已选商品总金额
    selectedAmount(): number {
      return (
        this.selectedList.reduce(
          (p: any, c: any) => p + c.count * Math.round(c.nowPrice * 100),
          0
        ) / 100
      );
    },
    // 是否全选
    isCheckAll(): boolean {
      return (
        this.validList.length !== 0 &&
        this.selectedList.length === this.validList.length
      );
    },
  },
  actions: {
    // 高复用的action
    // 添加购物车
    insertCart(payload: goodType) {
      const sameIndex = this.list.findIndex(
        (goods: goodType) => goods.skuId === payload.skuId
      );
      // 存在相同商品
      if (sameIndex > -1) {
        const count: number = this.list[sameIndex].count;
        payload.count += count;
        this.list.splice(sameIndex, 1);
      }
      // 添加商品
      this.list.unshift(payload);
    },
    //修改购物车商品
    updateCartGoods(payload: any) {
      const updateGoods = this.list.find(
        (item: any) => item.skuId === payload.skuId
      );
      for (const key in payload) {
        if (
          payload[key] !== undefined &&
          payload[key] !== null &&
          payload[key] !== ""
        ) {
          updateGoods[key] = payload[key];
        }
      }
    },
    // 获取商品列表
    findCart() {
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          findCartList().then((data) => {
            this.setCartList(data.result);
            resolve("更新购物车成功");
          });
        } else {
          const promiseArr = this.list.map((goods: goodType) => {
            return getNewCartGoods(goods.skuId);
          });
          Promise.all(promiseArr).then((dataList: any[]) => {
            dataList.forEach((item: any, index: number) => {
              this.updateCartGoods({
                skuId: this.list[index].skuId,
                ...item.result,
              });
            });
            resolve("更新本地购物车成功");
          });
        }
      });
    },
    // 修改购物车
    updateCart(payload: any) {
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          updateCart(payload)
            .then(() => {
              return findCartList();
            })
            .then((data) => {
              this.setCartList(data.result);
              resolve("修改成功");
            });
        } else {
          this.updateCartGoods(payload);
          resolve("修改成功");
        }
      });
    },
    //设置购物车
    setCartList(list: any[]) {
      this.list = list;
    },

    // 唯一操作
    // 使用购物车（已登录/未登录）
    useCart(payload: goodType) {
      return new Promise((resolve, reject) => {
        // 用户是否登录
        if (userStore.profile.token) {
          insertCart({skuId: payload.skuId, count: payload.count})
            .then(() => {
              return findCartList();
            })
            .then((data) => {
              this.setCartList(data.result);
              resolve("添加成功");
            });
        } else {
          this.insertCart(payload);
          resolve("添加成功");
        }
      });
    },
    //删除购物车商品
    deleteCart(skuId: any) {
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          deleteCart([skuId])
            .then(() => {
              return findCartList();
            })
            .then((data) => {
              this.setCartList(data.result);
              resolve("删除成功");
            });
        } else {
          const index = this.list.findIndex(
            (item: goodType) => item.skuId === skuId
          );
          this.list.splice(index, 1);
          resolve("删除成功");
        }
      });
    },
    //全选
    checkAllCart(selected: boolean) {
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          const ids = this.validList.map((item) => item.skuId);
          checkAllCart({selected, ids})
            .then(() => {
              return findCartList();
            })
            .then((data) => {
              this.setCartList(data.result);
              resolve("修改成功");
            });
        } else {
          this.validList.forEach((goods) => {
            this.updateCart({skuId: goods.skuId, selected});
          });
          resolve("修改成功");
        }
      });
    },
    // 批量删除
    batchDeleteCart(isClear: boolean) {
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          const ids = this[isClear ? "invalidList" : "selectedList"].map(
            (item) => item.skuId
          );
          deleteCart(ids)
            .then(() => {
              return findCartList();
            })
            .then((data) => {
              this.setCartList(data.result);
              resolve("删除成功");
            });
        } else {
          this[isClear ? "invalidList" : "selectedList"].forEach((item) => {
            this.deleteCart(item.skuId);
          });
          resolve("删除成功");
        }
      });
    },
    // 修改规格
    updateCartSku(oldSkuId: string, newSku: any) {
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          const oldGoods = this.list.find(
            (item: goodType) => item.skuId === oldSkuId
          );
          deleteCart([oldGoods.skuId])
            .then(() => {
              return insertCart({skuId: newSku.skuId, count: oldGoods.count});
            })
            .then(() => {
              return findCartList();
            })
            .then((data) => {
              this.setCartList(data.result);
              resolve("修改成功");
            });
        } else {
          const oldGoods = this.list.find(
            (item: goodType) => item.skuId === oldSkuId
          );
          this.deleteCart(oldSkuId);
          const {
            skuId,
            price: nowPrice,
            specsText: attrsText,
            inventory: stock,
          } = newSku;
          const newGoods = {...oldGoods, skuId, nowPrice, attrsText, stock};
          this.insertCart(newGoods);
          resolve("修改成功");
        }
      });
    },
    // 合并购物车
    async mergeCart() {
      const cartList = this.list.map((goods: any) => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count,
        };
      });
      await mergeLocalCart(cartList);
      this.setCartList([]);
    },
  },
});
