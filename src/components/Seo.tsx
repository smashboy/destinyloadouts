import { NextSeo, type NextSeoProps } from "next-seo";
import { APP_NAME } from "~/constants/app";

export const Seo: React.FC<NextSeoProps> = ({ title, ...props }) => (
  <NextSeo title={`${title} | ${APP_NAME}`} {...props} />
);
