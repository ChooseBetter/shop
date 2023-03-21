<template>
  <div class="goods-comment">
    <!-- 评价头部 -->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span>
          <span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span>
          <span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            v-for="(item, i) in commentInfo.tags"
            :key="item.title"
            href="javascript:;"
            :class="{active: currTagIndex === i}"
            @click="changeTag(i)"
          >
            {{ item.title }}（{{ item.tagCount }}）
          </a>
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a
        @click="changeSort(null)"
        href="javascript:;"
        :class="{active: reqParams.sortField === null}"
        >默认</a
      >
      <a
        @click="changeSort('praiseCount')"
        href="javascript:;"
        :class="{active: reqParams.sortField === 'praiseCount'}"
        >最热</a
      >
      <a
        @click="changeSort('createTime')"
        href="javascript:;"
        :class="{active: reqParams.sortField === 'createTime'}"
        >最新</a
      >
    </div>
    <!-- 评价列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i
              v-for="i in item.score"
              :key="i + '1'"
              class="iconfont icon-wjx01"
            ></i>
            <i
              v-for="i in 5 - item.score"
              :key="i + '2'"
              class="iconfont icon-wjx02"
            ></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">{{ item.content }}</div>
          <!-- 图片预览 -->
          <GoodsCommentImage
            v-if="item.pictures.length"
            :pictures="item.pictures"
          />
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"
              ><i class="iconfont icon-dianzan"></i>
              {{ item.praiseCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <XtxPagination
      v-if="total"
      :total="total"
      :page-size="reqParams.pageSize"
      :currentPage="reqParams.page"
      @current-change="changePager"
    />
  </div>
</template>

<script setup lang="ts">
import {inject, ref, reactive, watch} from "vue";
import {findGoodsCommentInfo, findGoodsCommentList} from "@/api/goods";
import GoodsCommentImage from "../goods-comment-image";
const commentInfo: any = ref(null);
const goods: any = inject("goods");
const currTagIndex = ref(0);
const total = ref(0);
// 筛选条件准备
type reqParamsType = {
  page: number;
  pageSize: number;
  hasPicture: boolean | null;
  tag: null;
  sortField: null;
};
const reqParams: reqParamsType = reactive({
  page: 1,
  pageSize: 10,
  hasPicture: null,
  tag: null,
  sortField: null, //praiseCount热度 createTime最新
});
findGoodsCommentInfo(goods.value.id).then((data) => {
  data.result.tags.unshift({
    title: "有图",
    tagCount: data.result.hasPictureCount,
    type: "img",
  });
  data.result.tags.unshift({
    title: "全部评价",
    tagCount: data.result.evaluateCount,
    type: "all",
  });
  commentInfo.value = data.result;
});
//初始化列表
const commentList = ref([]);
watch(
  reqParams,
  async () => {
    const data = await findGoodsCommentList(goods.value.id, reqParams);
    commentList.value = data.result.items;
    total.value = data.result.counts;
  },
  {immediate: true}
);

// 改变标签
const changeTag = (index: number) => {
  currTagIndex.value = index;
  // 设置有图和标签条件
  const currTag = commentInfo.value!.tags[index];
  if (currTag.type === "all") {
    //全部评价
    reqParams.hasPicture = false;
    reqParams.tag = null;
  } else if (currTag.type === "img") {
    //有图
    reqParams.hasPicture = true;
    reqParams.tag = null;
  } else {
    //正常tag
    reqParams.hasPicture = false;
    reqParams.tag = currTag.title;
  }
  reqParams.page = 1;
};

// 改变排序
const changeSort = (type: any) => {
  reqParams.sortField = type;
  reqParams.page = 1;
};

// 定义转换数据的函数
const formatSpecs = (specs: any) => {
  return specs
    .reduce((p: any, c: any) => `${p} ${c.name}：${c.nameValue}`, "")
    .trim();
};
const formatNickname = (nickname: string) => {
  return nickname.substr(0, 1) + "****" + nickname.substr(-2);
};

// 切换分页
const changePager = (page: number) => {
  reqParams.page = page;
};
</script>

<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
