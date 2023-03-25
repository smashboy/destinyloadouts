import { GetServerSideProps } from "next";
import { getAuthSessionServer } from "@/core/auth/utils";
import { bungieApiFetchHelper } from "@destiny/shared/fetchHelper";
import { GeneralUser, getBungieNetUserById } from "bungie-api-ts/user";
import { AccountHeader } from "./components/AccountHeader";
import { ButtonLink } from "@/core/components/Button";

interface AuthUserProfilePageProps {
  profile: GeneralUser;
}

export default function AuthUserProfilePage({
  profile,
}: AuthUserProfilePageProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <AccountHeader profile={profile} />
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

  const { user } = session;

  const fetchHelper = bungieApiFetchHelper(session.accessToken);

  const profile = await getBungieNetUserById(fetchHelper, {
    id: user.id,
  });

  return {
    props: {
      profile: profile.Response,
    },
  };
};
