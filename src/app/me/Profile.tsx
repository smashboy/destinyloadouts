"use client";
import { signOut, useSession } from "next-auth/react";

export const Profile = () => {
  const session = useSession();

  const handleLogout = () => signOut();

  return (
    <>
      <h1>{session.data?.user?.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};
