import { atom } from "recoil";

export const activeAdminData = atom<any>({
  key: "admin", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});
