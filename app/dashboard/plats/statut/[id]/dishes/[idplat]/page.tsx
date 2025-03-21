"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams ,useRouter} from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useNotification } from "@/app/ui/information/message";

type ApiResponse = {
  id: string;
  restaurant: {
    id: string;
    code: string | null;
    nom: string;
  };
  categorie: {
    id: string;
    code: string | null;
    nom: string;
  };
  image: {
    id: string;
    name: string | null;
    label: string | null;
    url: string | null;
    size: string | null;
  };
  code: string | null;
  nom: string;
  description: string;
  prix: string;
  enabled: boolean;
  edited: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

const AnimatedDishCard = () => {
  const [plat, setPlat] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const params = useParams();
  const router = useRouter();
  const idrestaurant = '28a5e012-bcff-48f5-88e2-baf30a77668a';
  const idplat = params.idplat as string;
  const token = localStorage.getItem("jwtToken");
  const notification= useNotification()

  const getPlat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/restaurant/${idrestaurant}/plat/${idplat}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Auth: "Le programmeur",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }

      const data = await response.json();
      setPlat(data);
      setIsEnabled(data.enabled);
    } catch (error) {
      console.error("Erreur lors de la récupération du menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPlat();
  }, []);

  const toggleAvailability = async () => {
    if (!plat) return;

    try {
      const newStatus = !isEnabled;
      const response = await fetch(`/api/restaurant/${idrestaurant}/dishes/${idplat}`, {
        method: "PATCH",
        headers: {
            'Authorization': `Bearer ${token}`, 
            "Content-Type": "application/json",
            "Auth": "Le programmeur"
        },
        body: JSON.stringify({ enabled: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour");
      }

      setIsEnabled(newStatus);
      notification.success("Le statut du menu à été changé avec succès");
      router.push('/dashboard/plats/liste');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 flex justify-center">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !plat ? (
        <div className="text-center p-6">
          <p className="text-lg text-gray-600">Aucun menu trouvé</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-10xl bg-white p-8 rounded-xl border shadow-lg"
        >
          {/* Titre du plat */}
          <h2 className="text-4xl font-extrabold text-gray-800 text-center">{plat.nom}</h2>

          {/* Image avec zoom au survol */}
          {plat.image?.url && (
            <div
              className="mt-4 overflow-hidden rounded-lg border cursor-pointer"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <motion.img
                src={plat.image.url}
                alt={plat.image.label || "Image du plat"}
                className="w-full h-[500px] object-cover transition-transform duration-300"
                animate={{ scale: isZoomed ? 1.2 : 1 }}
              />
            </div>
          )}

          {/* Informations du plat */}
          <div className="mt-6 space-y-3">
            <p className="text-gray-700 text-lg">{plat.description}</p>
            <p className="text-3xl font-semibold text-green-600">{plat.prix} FCFA</p>
          </div>

          {/* Informations du restaurant et catégorie */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700">
              <strong>Restaurant :</strong> {plat.restaurant.nom} ({plat.restaurant.code || "N/A"})
            </p>
            <p className="text-gray-700">
              <strong>Catégorie :</strong> {plat.categorie.nom} ({plat.categorie.code || "N/A"})
            </p>
          </div>

          {/* Statut du plat avec formulaire */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isEnabled ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                }`}
              >
                {isEnabled ? "Disponible" : "Indisponible"}
              </span>
            </div>
            <div className="flex items-center mt-6">
                <label className="mr-2 text-gray-700 font-medium">Activer / Désactiver :</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isEnabled || false}
                    onChange={toggleAvailability}
                    />
                    <div
                    className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 
                                rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 
                                peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 
                                after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full 
                                after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
                    ></div>
                </label>
                </div>

          </div>
          {/* Dates */}
          <div className="mt-4 text-gray-500 text-sm">
            <p>
              <strong>Ajouté le :</strong> {formatDate(plat.createdAt)}
            </p>
            <p>
              <strong>Mis à jour le :</strong> {formatDate(plat.updatedAt)}
            </p>
          </div>

          {/* Bouton retour à la liste */}
          <div className="mt-8 flex justify-end">
            <Link
              className="flex items-center gap-5 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
              href="/dashboard/plats/liste"
            >
              Liste des plats
              <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedDishCard;