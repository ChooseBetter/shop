<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox @change="checkAll" :modelValue="isCheckAll">
                  全选
                </XtxCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-if="validList.length === 0">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            <tr v-for="goods in validList" :key="goods.skuId">
              <td>
                <XtxCheckbox
                  @change="($event) => checkOne(goods.skuId, $event)"
                  :modelValue="goods.selected"
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`">
                    <img :src="goods.picture" alt="" />
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ goods.name }}
                    </p>
                    <!-- 选择规格组件 -->
                    <CartSku
                      @change="($event) => updateCartSku(goods.skuId, $event)"
                      :skuId="goods.skuId"
                      :attrsText="goods.attrsText"
                    />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
                <p v-if="goods.price - goods.nowPrice > 0">
                  比加入时降价
                  <span class="red">
                    &yen;{{ goods.price - goods.nowPrice }}
                  </span>
                </p>
              </td>
              <td class="tc">
                <XtxNumbox
                  @change="($event) => updateCount(goods.skuId, $event)"
                  :max="goods.stock"
                  :modelValue="goods.count"
                />
              </td>
              <td class="tc">
                <p class="f16 red">
                  &yen;
                  {{ Math.round((goods.nowPrice * 100 * goods.count) / 100) }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p>
                  <a
                    @click="deleteCart(goods.skuId)"
                    class="green"
                    href="javascript:;"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="invalidList.length">
            <tr>
              <td colspan="6"><h3 class="tit">失效商品</h3></td>
            </tr>
            <tr v-for="goods in invalidList" :key="goods.skuId">
              <td><XtxCheckbox style="color: #eee" /></td>
              <td>
                <div class="goods">
                  <RouterLink to="/"
                    ><img :src="goods.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ goods.name }}
                    </p>
                    <p class="attr">{{ goods.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
              </td>
              <td class="tc">{{ goods.count }}</td>
              <td class="tc">
                <p>
                  &yen;
                  {{ Math.round((goods.nowPrice * 100 * goods.count) / 100) }}
                </p>
              </td>
              <td class="tc">
                <p>
                  <a
                    @click="deleteCart(goods.skuId)"
                    class="green"
                    href="javascript:;"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox @change="checkAll" :modelValue="isCheckAll">
            全选
          </XtxCheckbox>
          <a @click="batchDeleteCart(false)" href="javascript:;">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a @click="batchDeleteCart(true)" href="javascript:;">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ validTotal }} 件商品，已选择 {{ selectedTotal }} 件，商品合计：
          <span class="red">¥{{ selectedAmount }}</span>
          <XtxButton @click="checkout" type="primary">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script setup lang="ts">
import useStore from "@/store";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import GoodRelevant from "@/views/goods/components/goods-relevant";
import CartNone from "@/views/cart/components/cart-none";
import CartSku from "@/views/cart/components/cart-sku";
import Message from "@/components/library/Message";
import Confirm from "@/components/library/Confirm";

const {cartStore} = useStore();
const {
  validList,
  validTotal,
  validAmount,
  invalidList,
  selectedList,
  selectedTotal,
  selectedAmount,
  isCheckAll,
} = storeToRefs(cartStore);

const checkOne = (skuId: string, selected: boolean) => {
  cartStore.updateCart({skuId, selected});
};
const checkAll = (selected: boolean) => {
  cartStore.checkAllCart(selected);
};
const deleteCart = (skuId: string) => {
  Confirm({text: "您确定从购物车删除该商品吗？"})
    .then(() => {
      cartStore.deleteCart(skuId).then(() => {
        Message({type: "success", text: "删除成功"});
      });
    })
    .catch((e) => {
      console.log("点击取消");
    });
};
// 批量删除
const batchDeleteCart = (isClear: boolean) => {
  Confirm({text: `您确定从购物车删除${isClear ? "失效" : "选中"}的商品吗？`})
    .then(() => {
      cartStore.batchDeleteCart(isClear);
    })
    .catch((e) => {
      console.log("点击取消");
    });
};

// 修改数量
const updateCount = (skuId: string, count: number) => {
  cartStore.updateCart({skuId, count});
};

// 修改规格
const updateCartSku = (oldSkuId: string, newSku: any) => {
  cartStore.updateCartSku(oldSkuId, newSku);
};

// 结算
const router = useRouter();
const checkout = () => {
  if (cartStore.selectedList.length === 0)
    return Message({text: "至少勾选一件商品"});
  Confirm({text: "下单结算前，确保已登录!"}).then(() => {
    router.push("/member/checkout");
  });
};
</script>

<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
