import { useSession } from "next-auth/react";
import { trpcNext } from "~/utils/api";

export const useAuthUser = () => {
  const session = useSession();

  const { data: user } = trpcNext.auth.getMe.useQuery(void 0, {
    enabled: !!session,
  });

  return [user, session] as const;
};
