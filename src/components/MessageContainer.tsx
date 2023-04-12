import { TypographyLarge, TypographySmall } from "./typography";

export interface MessageContainerProps {
  title: string;
  description: string;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({
  title,
  description,
}) => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="grid grid-cols-1 gap-2">
      <TypographyLarge>{title}</TypographyLarge>
      <TypographySmall>{description}</TypographySmall>
    </div>
  </div>
);
