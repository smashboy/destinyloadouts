import { type User, type Loadout } from "@prisma/client";
import { type NextPage, type GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { trpsSSG } from "~/utils/ssg";
import { AccountHeader } from "./components/AccountHeader";
import { LoadoutsList } from "~/components/loadouts/LoadoutsList";

interface AuthUserProfilePageProps {
  user: User;
  loadoutsCount: number;
  followersCount: number;
  likesCount: number;
  feed: {
    loadouts: Loadout[];
  };
}

const AuthUserProfilePage: NextPage<AuthUserProfilePageProps> = ({
  feed,
  ...props
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <AccountHeader {...props} />
      <LoadoutsList
        className="col-span-2 flex flex-col gap-4"
        loadouts={feed.loadouts}
        onFetchMore={() => {}}
        hasMore={false}
        isLoading={false}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  AuthUserProfilePageProps
> = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const {
    user: { id: bungieAccountId },
  } = session;

  const trpc = trpsSSG(session);

  const userResponse = await trpc.users.getByBungieAccountId.fetch({
    bungieAccountId,
  });

  if (!userResponse)
    return {
      notFound: true,
    };

  const { id: userId } = userResponse.user;

  const loadouts = await trpc.loadouts.getByUserId.fetch({ userId });

  return {
    props: { ...userResponse, feed: loadouts },
  };
};

export default AuthUserProfilePage;
