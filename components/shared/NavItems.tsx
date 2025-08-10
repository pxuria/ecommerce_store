import Link from "next/link";
import { usePathname } from "next/navigation";
import { navbarLinks } from "@/constants";

const NavItems = () => {
  const pathname = usePathname();
  const navLinkClasses = `cursor-pointer text-xs lg:text-base font-medium px-3 py-2 transition duration-200 ease-in relative text-nowrap`;

  return (
    <nav className="flex_center gap-8">
      {navbarLinks.map((item, index) => (
        <Link
          key={index}
          href={item.link}
          className={`nav_link ${navLinkClasses} text-black ${pathname === item?.link ? "nav_link_active" : ""
            }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
