<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{active: hasAccount}"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{active: !hasAccount}"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script setup lang="ts">
import {ref} from "vue";
import LoginHeader from "./components/login-header";
import LoginFooter from "./components/login-footer";
import CallbackBind from "./components/callback-bind";
import CallbackPatch from "./components/callback-patch";
import useStore from "@/store";
import {useRoute, useRouter} from "vue-router";
import QC from "qc";
import {userQQLogin} from "@/api/user";
import Message from "@/components/library/Message";

const {userStore, cartStore} = useStore();
const router = useRouter();
const route = useRoute();
const hasAccount = ref(true);
const isBind = ref(true);
const unionId = ref(null);

// 是否已登录
if (QC.Login.check()) {
  // QQ唯一标识
  QC.Login.getMe((openId: any) => {
    unionId.value = openId;
    // 请求小兔鲜后台，做QQ登录
    userQQLogin(openId)
      .then((data) => {
        // 登录成功
        // 存储信息
        const {id, account, avatar, mobile, nickName, token} = data.result;
        userStore.setUser({id, account, avatar, mobile, nickName, token});
        //跳转
        cartStore.mergeCart().then(() => {
          router.push(userStore.redirectUrl || "/");
          Message({type: "success", text: "登录成功"});
        });
      })
      .catch((err) => {
        // 登录失败，没有与小兔鲜绑定
        isBind.value = false;
      });
  });
}
</script>

<style scoped lang="less">
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
