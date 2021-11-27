import { store } from "../redux/store";

export const getCurrentUser = () => {
  const state = store.getState();
  return state?.auth?.user ?? null;
};
