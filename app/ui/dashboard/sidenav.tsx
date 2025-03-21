"use client";
import { PowerIcon } from "@heroicons/react/24/solid";
import NavLinks from "./nav-links";
import Link from "next/link";
import AcmeLogo from "../acme-logo";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SideNav() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Déconnexion via next-auth
      await signOut({
        redirect: false
      });
      
      // Redirection après la déconnexion
      window.location.href = "/login";
    } catch (error) {
      console.error("Erreur pendant la déconnexion:", error);
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/*  Liens */}
      <Link
        href='/'
        className='mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40'
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {/* Liens de Navigation */}
        <NavLinks />
        <div className="h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        {/* Bouton de déconnexion */}
        <button
          type="button" // Changé de "submit" à "button"
          onClick={handleLogout}
          disabled={isLoading}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">
            {isLoading ? "Déconnexion en cours..." : "Se Déconnecter"}
          </div>
        </button>
      </div>
    </div>
  );
}