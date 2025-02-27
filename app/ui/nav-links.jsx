'use client'

import { ArrowLeftEndOnRectangleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation.js";

const links= [
   {
    name : 'Inscription',
    href : '/signup',
    icon : PencilSquareIcon
   },
   {
    name : 'Connexion',
    href : '/login',
    icon : ArrowLeftEndOnRectangleIcon
   },
];
export default function NavLinks(){
    const pathname= usePathname();
    return (
       <>
            {
                links.map(link=>{
                    const LinkIcon= link.icon;
                    return (
                        <Link 
                          key={link.name} 
                          href={link.href} 
                          className={pathname==link.href ? "nav-link active" : "nav-link"}
                        >
                            <LinkIcon style={{width: '20px'}}/>
                            {link.name}
                        </Link>
                    )
                })
            }
       </>
    )
}