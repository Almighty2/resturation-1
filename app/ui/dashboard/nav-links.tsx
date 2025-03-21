"use client";

import { useState } from "react";
import { 
  HomeIcon, 
  UserGroupIcon, 
  ArrowLeftEndOnRectangleIcon, 
  ChevronDownIcon 
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Tableau de Bord",
    href: "/",
    icon: HomeIcon,
    subItems: [],
  },
  {
    name: "Gestion des Menu",
    href: "/dashboard/plats",
    icon: UserGroupIcon,
    subItems: [
      { name: "Menus", href: "/dashboard/menu/liste" },
      { name: "Plats", href: "/dashboard/plats/liste" },
      { name: "Suppléments", href: "/dashboard/supplements/liste" },
    ],
  },
  //{
  //  name: "Catégorie",
  //   href: "/dashboard/categorie",
  //   icon: ArrowLeftEndOnRectangleIcon,
  //   subItems: [
  //     { name: "Liste Catégorie", href: "/dashboard/categories/liste" },
  //   ],
  // },
/*    {
     name: "Gestion des Menus",
     href: "/dashboard/menu",
     icon: ArrowLeftEndOnRectangleIcon,
     subItems: [
       { name: "Liste menu", href: "/dashboard/menu/liste" },
     ],
   }, */
];

export default function NavLinks() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <div className="w-full md:w-64 bg-gray-50 p-2 rounded-md">
      {links.map((link) => {
        const LinkIcon = link.icon;

        return (
          <div key={link.name} className="mb-2">
            {/* Si le menu n'a pas de sous-items, afficher un lien normal */}
            {link.subItems.length === 0 ? (
              <Link
                href={link.href}
                className={clsx(
                  "flex items-center gap-2 p-3 rounded-md text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
                  {
                    "bg-sky-100 text-blue-600": pathname === link.href,
                  }
                )}
              >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            ) : (
              // Si le menu a des sous-items, afficher un bouton cliquable
              <button
                onClick={() => toggleMenu(link.name)}
                className={clsx(
                  "flex items-center justify-between w-full p-3 rounded-md text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
                  {
                    "bg-sky-100 text-blue-600": pathname.startsWith(link.href),
                  }
                )}
              >
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-6" />
                  <p className="hidden md:block">{link.name}</p>
                </div>
                <ChevronDownIcon
                  className={clsx("w-5 transition-transform", {
                    "rotate-180": openMenu === link.name,
                  })}
                />
              </button>
            )}

            {/* Sous-menus */}
            {openMenu === link.name && link.subItems.length > 0 && (
              <ul className="ml-6 mt-1 space-y-1">
                {link.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.href}
                      className="block p-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
