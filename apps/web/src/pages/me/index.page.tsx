import { GetServerSideProps } from "next";
import { getAuthSessionServer } from "~/core/auth/utils";
import { bungieApiFetchHelper } from "@destiny/shared/fetchHelper";
import { User } from "@services/api/src/web";
import { GeneralUser, getBungieNetUserById } from "bungie-api-ts/user";
import { AccountHeader } from "./components/AccountHeader";
import { ButtonLink } from "~/core/components/Button";
import { trpcClient, trpcReact } from "~/core/trpc/client";

interface AuthUserProfilePageProps {
  profile: GeneralUser;
  user: User;
  loadoutsCount: number;
  followersCount: number;
  likesCount: number;
}

export default function AuthUserProfilePage({
  profile,
  user,
  ...otherProps
}: AuthUserProfilePageProps) {
  const { id: userId } = user;

  const query = trpcReact.loadouts.getByUserId.useInfiniteQuery(
    {
      userId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  );

  console.log(query.data);

  return (
    <div className="grid grid-cols-3 gap-4">
      <AccountHeader profile={profile} user={user} {...otherProps} />
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

  const [profile, userResponse] = await Promise.all([
    getBungieNetUserById(fetchHelper, {
      id: sessionUser.id,
    }),
    trpcClient.users.getByBungieAccountId.query({
      bungieAccountId: sessionUser.id,
    }),
  ]);

  if (!userResponse)
    return {
      notFound: true,
    };

  const { user, ...otherData } = userResponse;

  const loadoutsInitialData = await trpcClient.loadouts.getByUserId.query({
    userId: user.id,
  });

  return {
    props: {
      profile: profile.Response,
      user,
      ...otherData,
    },
  };
};
