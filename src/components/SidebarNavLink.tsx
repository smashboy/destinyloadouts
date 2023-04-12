import Link from "next/link";
import { type IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SidebarNavLinkProps {
  href: string;
  icon: IconProp;
  label: string;
  target?: "_blank";
  rel?: "noopener noreferrer";
}

export const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  href,
  icon,
  label,
  ...props
}) => (
  <Link
    {...props}
    href={href}
    className="inline-flex items-center bg-transparent text-xl text-slate-900 underline-offset-4 hover:bg-transparent hover:underline dark:bg-transparent dark:text-slate-100 dark:hover:bg-transparent"
  >
    <FontAwesomeIcon icon={icon} className="mr-2 h-6 w-6" />
    {label}
  </Link>
);
