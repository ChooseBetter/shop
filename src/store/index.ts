import {useUserStore} from "./modules/user";
import {useCartStore} from "./modules/cart";
import {useCategoryStore} from "./modules/category";

export default function useStore() {
  return {
    userStore: useUserStore(),
    cartStore: useCartStore(),
    categoryStore: useCategoryStore(),
  };
}
