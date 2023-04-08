import { type NextPage, type GetServerSideProps } from "next";
import { type UserProfilePageProps } from "./index.page";
import { UserProfilePageComponent } from "./components/UserProfilePageComponent";
import { trpsSSG } from "~/utils/ssg";

const UserProfileLikesLoadoutsPage: NextPage<UserProfilePageProps> = (
  props
) => <UserProfilePageComponent {...props} onlyAuthUserLikedLoadouts />;

export const getServerSideProps: GetServerSideProps<
  UserProfilePageProps
> = async (ctx) => {
  const userId = ctx.query.userId as string;

  const trpc = trpsSSG();

  const user = await trpc.users.getById.fetch({
    userId,
  });

  if (!user)
    return {
      notFound: true,
    };

  const loadouts = await trpc.loadouts.getByUserId.fetch({
    userId,
    onlyLiked: true,
  });

  return {
    props: {
      user,
      loadouts,
    },
  };
};

export default UserProfileLikesLoadoutsPage;
