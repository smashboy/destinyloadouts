import { TypographyLarge, TypographySubtle } from "~/components/typography";

interface AccountCounterProps {
  title: string;
  count: number;
}

export const AccountCounter: React.FC<AccountCounterProps> = ({
  title,
  count,
}) => (
  <div className="flex items-center space-x-2">
    <TypographySubtle>{`${title}:`}</TypographySubtle>
    <TypographyLarge>{count}</TypographyLarge>
  </div>
);
