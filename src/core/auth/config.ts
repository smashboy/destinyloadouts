import type { AuthOptions } from "next-auth";
import { BungieAuthProvider } from "./BungieProvider";

export const authConfig = {
  providers: [BungieAuthProvider({})],
  // callbacks: {
  //   signIn: (params) => {
  //     console.log("SIGN IN", params);
  //     return true;
  //   },
  //   session: (params) => {
  //     console.log("SESSION", params);
  //     return params.session;
  //   },
  // },
} satisfies AuthOptions;
