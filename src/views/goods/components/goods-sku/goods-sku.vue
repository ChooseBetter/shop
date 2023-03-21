<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="value in item.values" :key="value.name">
          <img
            v-if="value.picture"
            :src="value.picture"
            :title="value.name"
            :class="{selected: value.selected, disabled: value.disabled}"
            @click="changeSku(item, value)"
          />
          <span
            v-else
            :class="{selected: value.selected, disabled: value.disabled}"
            @click="changeSku(item, value)"
            >{{ value.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, watch} from "vue";
import getPowerSet from "@/vender/power-set";
const spliter = "☆";
const props = defineProps({
  goods: {
    type: Object,
    default: () => ({}),
  },
  skuId: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["change"]);
//选中/取消,组件初始化
const changeSku = (item: any, value: any) => {
  if (value.disabled) return;
  if (value.selected) {
    value.selected = false;
  } else {
    item.values.forEach((valItem: any) => {
      valItem.selected = false;
    });
    value.selected = true;
  }
  //点击按钮，更新按钮禁用
  updateDisabledStatus(props.goods.specs, pathMap);
  //将选择的sku信息传给父组件
  const validSelectedValues = getSelectedValues(props.goods.specs).filter(
    (value: any) => value
  );
  if (validSelectedValues.length === props.goods.specs.length) {
    const skuIds = pathMap[validSelectedValues.join(spliter)];
    const sku = props.goods.skus.find((sku: any) => sku.id === skuIds[0]);
    emits("change", {
      skuId: sku.id,
      price: sku.price,
      oldPrice: sku.oldPrice,
      inventory: sku.inventory,
      //属性名：属性值
      specsText: sku.specs
        .reduce((p: any, n: any) => `${p} ${n.name}：${n.valueName}`, "")
        .trim(),
    });
  } else {
    emits("change", {});
  }
};

// 路径字典对象
const getPathMap = (skus: any) => {
  const pathMap: any = {};
  skus.forEach((sku: any) => {
    if (sku.inventory > 0) {
      //计算当前有库存的sku的子集
      //可选值数组
      const valueArr = sku.specs.map((item: any) => item.valueName);
      /// 可选值数组 子集
      const valueArrPowerSet = getPowerSet(valueArr);
      //遍历子集，往pathMap插入数据
      valueArrPowerSet.forEach((arr) => {
        //根据arr得到字符串的key：['红色','中国'] ===> '红色☆中国'
        const key = arr.join(spliter);
        //设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id);
        } else {
          pathMap[key] = [sku.id];
        }
      });
    }
  });
  return pathMap;
};

//更新按钮禁用状态
const updateDisabledStatus = (specs: any, pathMap: any) => {
  specs.forEach((item: any, index: number) => {
    const selecedValues: any = getSelectedValues(specs);
    item.values.forEach((value: any) => {
      //判断当前是否选择
      if (value.selected) return;
      //将当前的值按照顺序套入选中的值数组
      selecedValues[index] = value.name;
      //剔除undefined数据，按照分隔符拼接key
      const key = selecedValues.filter((value: any) => value).join(spliter);
      //路径字典是否有数据，控制disabled
      value.disabled = !pathMap[key];
    });
  });
};

//获得选中的值数组
const getSelectedValues = (specs: any) => {
  const arr: any = [];
  specs.forEach((item: any) => {
    const selectedValue = item.values.find((value: any) => value.selected);
    arr.push(selectedValue ? selectedValue.name : undefined);
  });
  return arr;
};

//默认选中
const initDefaultSelected = (goods: any, skuId: string) => {
  const sku = goods.skus.find((sku: any) => sku.id === skuId);
  goods.specs.forEach((item: any, index: number) => {
    const value = item.values.find(
      (value: any) => value.name === sku.specs[index].valueName
    );
    value.selected = true;
  });
};

//初始化
const pathMap = getPathMap(props.goods.skus);

//根据skuId初始化选中
if (props.skuId) {
  initDefaultSelected(props.goods, props.skuId);
}
updateDisabledStatus(props.goods.specs, pathMap);
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
