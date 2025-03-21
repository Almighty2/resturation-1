"use client"
import React from "react";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import TableauDeBord from "../components/TableauDeBord";
import Graphe from "../components/Graphe";

const AnimatedForm = () => { 
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.accessToken) {
      localStorage.setItem("jwtToken", session.user.accessToken);
    }
  }, [session]);
  return (
      <main className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl mb-8 font-bold">Tableau de bord</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <TableauDeBord
                          title="Revenu"
                          values="Revenu"
                          isLoading={true}
                          borderColor="border-green-500"
                          textColor="text-green-500"
                     />
                     <TableauDeBord
                          title="Dépense"
                          values="Revenu"
                          isLoading={true}
                          borderColor="border-red-500"
                          textColor="text-red-500"
                     />
                     <TableauDeBord
                          title="Solde"
                          values="Revenu"
                          isLoading={true}
                          borderColor="border-blue-500"
                          textColor="text-blue-500"
                     />
                </div>
                <Graphe />
        </div>        
      </main>
  );
};

export default AnimatedForm;