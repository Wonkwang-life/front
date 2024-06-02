import { atom, DefaultValue } from "recoil";

// interface User {
//   id: number;
//   username: string;
// }
export const userState = atom<number | null>({
  key: "userState",
  default: null,
});
