import {defineStore} from "pinia";
import {topCategory} from "@/api/constants";
import {findAllCategory} from "@/api/category";

export const useCategoryStore = defineStore("category", {
  state: () => {
    return {
      list: topCategory.map((item) => ({name: item})),
    };
  },
  actions: {
    setCategory(payload: any) {
      this.list = payload;
    },
    async getCategory() {
      try {
        const data = await findAllCategory();
        data.result.forEach((item: any) => {
          item.open = false;
        });
        this.setCategory(data.result);
      } catch (error) {
        return error;
      }
    },
    //控制当前分类的二级分类显示/隐藏
    show(id: string) {
      const currCategory: any = this.list.find((item: any) => item.id === id);
      currCategory!.open = true;
    },
    hide(id: string) {
      const currCategory: any = this.list.find((item: any) => item.id === id);
      currCategory!.open = false;
    },
  },
});
