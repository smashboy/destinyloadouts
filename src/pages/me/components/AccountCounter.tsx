import {
  TypographyLarge,
  TypographySubtle,
} from "@/core/components/typography";

interface AccountCounterProps {
  title: string;
  count: number;
}

export const AccountCounter: React.FC<AccountCounterProps> = ({
  title,
  count,
}) => (
  <div className="flex flex-col space-y-2 items-center">
    <TypographyLarge>{count}</TypographyLarge>
    <TypographySubtle>{title}</TypographySubtle>
  </div>
);
