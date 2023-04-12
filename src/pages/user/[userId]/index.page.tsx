import { type NextPage, type GetStaticPaths, type GetStaticProps } from "next";
import { trpsSSG } from "~/utils/ssg";
import { getBaseUrl, type RouterOutputs } from "~/utils/api";
import { UserProfilePageComponent } from "./components/UserProfilePageComponent";
import { Seo } from "~/components/Seo";
import { APP_NAME } from "~/constants/app";

const REVALIDATE_TIME = 60 * 20;

export interface UserProfilePageProps {
  user: NonNullable<RouterOutputs["users"]["getById"]>;
  loadouts: RouterOutputs["loadouts"]["getByUserId"];
}

const UserProfilePage: NextPage<UserProfilePageProps> = (props) => {
  const {
    user: { bungieAccountDisplayName, id: userId },
  } = props;

  return (
    <>
      <Seo
        title={`${bungieAccountDisplayName} | ${APP_NAME}`}
        canonical={`${getBaseUrl()}/user/${userId}`}
      />
      <UserProfilePageComponent {...props} />
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

  const loadouts = await trpc.loadouts.getByUserId.fetch({
    userId,
  });

  return {
    props: {
      user,
      loadouts,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export default UserProfilePage;
