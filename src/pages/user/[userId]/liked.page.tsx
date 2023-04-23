import { type NextPage, type GetStaticPaths, type GetStaticProps } from "next";
import { type UserProfilePageProps } from "./index.page";
import { UserProfilePageComponent } from "./components/UserProfilePageComponent";
import { trpsSSG } from "~/utils/ssg";
import { Seo } from "~/components/Seo";
import { PUBLIC_URL } from "~/constants/app";

const REVALIDATE_TIME = 60 * 20;

const UserProfileLikesLoadoutsPage: NextPage<UserProfilePageProps> = (
  props
) => {
  const {
    user: { bungieAccountDisplayName, id: userId },
  } = props;

  return (
    <>
      <Seo
        title={`${bungieAccountDisplayName}'s liked loadouts`}
        canonical={`${PUBLIC_URL}/user/${userId}/liked`}
      />
      <UserProfilePageComponent {...props} onlyLiked />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<UserProfilePageProps> = async (
  ctx
) => {
  const userId = ctx.params?.userId as string;

  const trpc = trpsSSG();

  const user = await trpc.users.getById.fetch({
    userId,
  });

  if (!user)
    return {
      notFound: true,
      revalidate: REVALIDATE_TIME,
    };

  const stats = await trpc.users.getGeneralStats.fetch({ userId });

  return {
    props: {
      user,
      stats,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export default UserProfileLikesLoadoutsPage;
