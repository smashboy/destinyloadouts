import Link from "next/link";
import { type Icon } from "@tabler/icons-react";

interface SidebarNavLinkProps {
  href: string;
  icon: Icon;
  label: string;
}

export const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  href,
  icon: Icon,
  label,
}) => (
  <Link
    href={href}
    className="inline-flex bg-transparent text-xl text-slate-900 underline-offset-4 hover:bg-transparent hover:underline dark:bg-transparent dark:text-slate-100 dark:hover:bg-transparent"
  >
    <Icon className="mr-2 h-6 w-6" />
    {label}
  </Link>
);
