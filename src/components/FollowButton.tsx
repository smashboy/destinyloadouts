import { type User } from "@prisma/client";
import { Button, ButtonLink } from "./Button";
import { trpcNext } from "~/utils/api";

interface FollowButtonProps {
  authUser: User | undefined;
  followUserId: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  authUser,
  followUserId,
}) => {
  const queryParams = { followingUserId: followUserId };

  const trpcCtx = trpcNext.useContext();
  const isFollowingQuery = trpcNext.users.isFollowing.useQuery(queryParams, {
    enabled: !!authUser,
  });

  const { data: follow, isLoading } = isFollowingQuery;

  const isFollowing = !!follow;

  const followMutation = trpcNext.users.follow.useMutation({
    onMutate: async () => {
      await trpcCtx.users.isFollowing.cancel(queryParams);

      const prevFollow = await trpcCtx.users.isFollowing.getData(queryParams);

      return { prevFollow };
    },
    onError: (_, __, ctx) =>
      trpcCtx.users.isFollowing.setData(
        queryParams,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx!.prevFollow
      ),
    onSettled: () => trpcCtx.users.isFollowing.invalidate(queryParams),
  });

  const handleFollow = () =>
    followMutation.mutate({ followingUserId: followUserId });

  if (!authUser) return <ButtonLink href="/login">Follow</ButtonLink>;

  if (authUser && authUser.id === followUserId) return null;

  return (
    <Button
      variant={isFollowing ? "subtle" : "default"}
      disabled={isLoading || followMutation.isLoading}
      onClick={handleFollow}
    >
      Follow
    </Button>
  );
};
