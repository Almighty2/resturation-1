"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

type ApiResponse = {
  id: string;
  restaurant: {
    id: string;
    code: string | null;
    nom: string;
  };
  planning: {
    id: string;
    code: string | null;
    nom: string | null;
  };
  plats: Array<{
    id: string;
    code: string | null;
    nom: string;
  }>;
  code: string | null;
  nom: string;
  description: string;
  menuJour: boolean;
  enabled: boolean;
  edited: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

interface RawPlanning {
  id: string;
  nom: string;
  indiceJour: string;
  nomJour: string;
}

interface Dish {
  id: string;
  nom: string;
}

interface PlanningOption {
  value: string;
  label: string;
}

const AnimatedForm = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuPlat, setMenuPlat] = useState<ApiResponse | null>(null);
  const id = '28a5e012-bcff-48f5-88e2-baf30a77668a';
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();
  const params = useParams();
  const idrestaurant = params.id as string;
  const idmenu = params.idmenu as string;
  const token = localStorage.getItem("jwtToken");

  const getMenu = async() => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/restaurant/${id}/menu/${idmenu}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Auth': 'Le programmeur',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
      
      const data = await response.json();
      setMenuPlat(data);
      
    } catch (error) {
      console.error("Erreur lors de la récupération du menu:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getMenu();
  }, []);

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !menuPlat ? (
        <div className="text-center p-6">
          <p className="text-lg text-gray-600">Aucun menu trouvé</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full mx-auto p-6 bg-white rounded-xl border-2 border-gray-300 shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{menuPlat.nom}</h2>
            <div className="flex items-center space-x-2">
              {menuPlat.menuJour && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Menu du jour
                </span>
              )}
              {menuPlat.enabled ? (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Actif
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Inactif
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Détails du menu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Restaurant</p>
                <p className="font-medium">{menuPlat.restaurant.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Planning</p>
                <p className="font-medium">{menuPlat.planning?.nom || "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Code</p>
                <p className="font-medium">{menuPlat.code || "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dernière mise à jour</p>
                <p className="font-medium">{formatDate(menuPlat.updatedAt)}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{menuPlat.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Plats ({menuPlat.plats.length})</h3>
            {menuPlat.plats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuPlat.plats.map((plat) => (
                  <div key={plat.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800">{plat.nom}</h4>
                    {plat.code && <p className="text-sm text-gray-500">Code: {plat.code}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucun plat dans ce menu</p>
            )}
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
              href='/dashboard/menu/liste'
            >
              Liste menus
              <ArrowRightIcon className="w-5 md:w-6"/>
            </Link>
            {/* <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => {
                // Logique pour supprimer le menu
                console.log("Supprimer le menu");
              }}
            >
              Supprimer
            </button> */}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AnimatedForm;