import { Session } from "next-auth";
import { AccountHeader } from "./AccountHeader";

interface AccountProps {
  session: Session;
}

export const Account: React.FC<AccountProps> = ({ session }) => (
  <div className="grid grid-cols-3 gap-4">
    <AccountHeader />
    <div className="col-span-2"></div>
  </div>
);
