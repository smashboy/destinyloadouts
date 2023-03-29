import { type User } from "@prisma/client";
import { type NextPage, type GetServerSideProps } from "next";
import { ButtonLink } from "~/components/Button";
import { getServerAuthSession } from "~/server/auth";
import { trpsSSG } from "~/utils/ssg";
import { AccountHeader } from "./components/AccountHeader";

interface AuthUserProfilePageProps {
  user: User;
  loadoutsCount: number;
  followersCount: number;
  likesCount: number;
}

const AuthUserProfilePage: NextPage<AuthUserProfilePageProps> = (props) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <AccountHeader {...props} />
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
    user: { id: userId },
  } = session;

  const trpc = trpsSSG(session);

  const userResponse = await trpc.users.getByBungieAccountId.fetch({
    bungieAccountId: userId,
  });

  if (!userResponse)
    return {
      notFound: true,
    };

  return {
    props: userResponse,
  };
};

export default AuthUserProfilePage;
