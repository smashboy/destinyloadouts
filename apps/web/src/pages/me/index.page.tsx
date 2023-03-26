import { GetServerSideProps } from "next";
import { getAuthSessionServer } from "~/core/auth/utils";
import { bungieApiFetchHelper } from "@destiny/shared/fetchHelper";
import { User } from "@services/api/src/web";
import { GeneralUser, getBungieNetUserById } from "bungie-api-ts/user";
import { AccountHeader } from "./components/AccountHeader";
import { ButtonLink } from "~/core/components/Button";
import { trpcClient } from "~/core/trpc/client";

interface AuthUserProfilePageProps {
  profile: GeneralUser;
  user: {
    user: User;
    loadoutsCount: number;
    followersCount: number;
    likesCount: number;
  };
}

export default function AuthUserProfilePage({
  profile,
  user,
}: AuthUserProfilePageProps) {
  console.log(user);

  return (
    <div className="grid grid-cols-3 gap-4">
      <AccountHeader profile={profile} user={user} />
      <div className="col-span-2">
        <ButtonLink
          href="/me/new-loadout"
          variant="outline"
          className="w-full"
          size="lg"
        >
          New Loadout +
        </ButtonLink>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  AuthUserProfilePageProps
> = async (ctx) => {
  const session = await getAuthSessionServer(ctx);

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const { user: sessionUser } = session;

  const fetchHelper = bungieApiFetchHelper(session.accessToken);

  const [profile, user] = await Promise.all([
    getBungieNetUserById(fetchHelper, {
      id: sessionUser.id,
    }),
    trpcClient.users.getUserByBungieAccountId.query({
      bungieAccountId: sessionUser.id,
    }),
  ]);

  if (!user)
    return {
      notFound: true,
    };

  return {
    props: {
      profile: profile.Response,
      user,
    },
  };
};
