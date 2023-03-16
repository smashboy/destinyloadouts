import { isAuthenticatedServer } from "@/core/auth/utils";
import { Profile } from "./Profile";

export default async function AuthUserProfilePage() {
  return <Profile />;
}
