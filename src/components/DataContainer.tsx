import { GhostLoader } from "./GhostLoader";
import {
  MessageContainer,
  type MessageContainerProps,
} from "./MessageContainer";

interface DataContainerProps extends MessageContainerProps {
  showMessage: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

export const DataContainer: React.FC<DataContainerProps> = ({
  showMessage,
  isLoading,
  title,
  description,
  children,
}) => {
  if (isLoading) return <GhostLoader />;

  if (showMessage)
    return <MessageContainer title={title} description={description} />;

  return <>{children}</>;
};
