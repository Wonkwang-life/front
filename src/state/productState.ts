import { atom } from "recoil";

// interface User {
//   id: number;
//   username: string;
// }
export const productState = atom<[] | null>({
  key: "productState",
  default: null,
});
