<template>
  <nav class="navbar">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <router-link to="/member">
              <i class="iconfont icon-user"></i>{{ profile.account }}
            </router-link>
          </li>
          <li><a @click="logout" href="javascript:;">退出登录</a></li>
        </template>
        <template v-else>
          <li><router-link to="/login">请先登录</router-link></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import useStore from "@/store";
import {useRouter} from "vue-router";

const {userStore, cartStore} = useStore();
const router = useRouter();
const {profile} = storeToRefs(userStore);
//退出登录
const logout = () => {
  userStore.clearUser();
  cartStore.setCartList([]);
  router.push("/login");
};
</script>

<style scoped lang="less">
.navbar {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      // ~ 选择当前选择器后的所有元素
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
