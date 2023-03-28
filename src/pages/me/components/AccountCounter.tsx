import { TypographyLarge, TypographySubtle } from "~/components/typography";

interface AccountCounterProps {
  title: string;
  count: number;
}

export const AccountCounter: React.FC<AccountCounterProps> = ({
  title,
  count,
}) => (
  <div className="flex flex-col items-center space-y-2">
    <TypographyLarge>{count}</TypographyLarge>
    <TypographySubtle>{title}</TypographySubtle>
  </div>
);
