import { Loader } from "./Loader";

export const FooterLoader: React.FC<{ hasNextPage?: boolean }> = ({
  hasNextPage = false,
}) => {
  if (hasNextPage)
    return (
      <div className="col-span-2 flex w-full items-center justify-center p-4 pb-12">
        <Loader />
      </div>
    );

  return null;
};
