"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Input from "@/app/ui/form/Input";
import Select from "@/app/ui/form/Select";
import Checkbox from "@/app/ui/form/Checkbox";
import { useParams, useRouter } from "next/navigation";
import { useNotification } from "@/app/ui/information/message";

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

  interface Plat {
    id: string;
    code: string | null;
    nom: string;
  }

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
  
const StatutMenu = () => { 
  const [categories, setCategories] = useState([]);
  const [menuPlat, setMenuPlat] = useState<ApiResponse | null>(null);
  const [planning, setPlanning] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [plats, setPlats] = useState<Dish[]>([]);
  const id = '28a5e012-bcff-48f5-88e2-baf30a77668a';
  const notification = useNotification();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();
  const router = useRouter();
  const params = useParams();
  const idmenu = params.idmenu as string;
 
  const onSubmit = async (data:any) => {
    console.log("Form Data:", data);
    const {enabled } = data;
      
    const token = localStorage.getItem("jwtToken");
    const response = await fetch(`/api/restaurant/${id}/menu/${idmenu}`, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${token}`, 
        "Content-Type": "application/json",
        "Auth": "Le programmeur"
      },
      body: JSON.stringify({
        enabled
      }),
    });
    
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Erreur lors de la soumission: ${response.status}${errorData ? ' - ' + JSON.stringify(errorData) : ''}`);
    }
     
    router.push('/dashboard/menu/liste');
    // Récupérer et traiter la réponse correctement
    const responseData = await response.json();
};
  
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
      notification.success("Le statut du menu à été changé avec succès");
      setMenuPlat(data);
      
      // Initialiser les valeurs du formulaire avec les données du menu
      if (data) {
        setValue("nom", data.nom);
        setValue("description", data.description);
        setValue("menuJour", data.menuJour);
        setValue("enabled", data.enabled);
        setValue("planningId", data.planning?.id);
        
        // Préparer les plats sélectionnés pour le MultiSelect
        // Puis utilisez-le dans votre code
        if (data.plats && data.plats.length > 0) {
            const platIds = data.plats.map((plat: Plat) => plat.nom);
            setValue("platIds", platIds);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du menu:", error);
    } finally {
      setIsLoading(false);
    }
  };
    
  const getCategorieByRestaurant = async () => {
    setIsLoading(true);
    try {
      const reponse = await fetch(`/api/restaurant/${id}/plats/categorie`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Auth': 'Le programmeur',
          'Content-Type': 'application/json',
        }
      });

      if (!reponse.ok) {
        throw new Error(`Erreur: ${reponse.status}`);
      }
      
      const data = await reponse.json();
      setCategories(data.items);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlannings = async () => {
    setIsLoading(true);
    try {
      const reponse = await fetch(`/api/restaurant/${id}/plannings`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Auth': 'Le programmeur',
          'Content-Type': 'application/json',
        }
      });

      if (!reponse.ok) {
        throw new Error(`Erreur: ${reponse.status}`);
      }
      
      const data = await reponse.json();
      setPlanning(data.items);
    } catch (error) {
      console.error("Erreur lors de la récupération des plannings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/restaurant/${id}/plats`, {
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
      setPlats(data.items);
    } catch (error) {
      console.error("Erreur lors de la récupération des plats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategorieByRestaurant();
    getPlannings();
    getPlats();
    if (idmenu) {
      getMenu();
    }
  }, []);

  let planningsOptions: PlanningOption[] = [];
    
  if (Array.isArray(planning) && planning.length > 0) {
    planningsOptions = (planning as RawPlanning[]).map(item => ({
      value: item.id,
      label: item.nomJour
    }));
  }


  return (
    <>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full mx-auto p-6 bg-white rounded-xl border-2 border-gray-300 shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Activer/Désactiver un menu</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Select 
              label="Planning" 
              name="planningId"
              control={control}
              required={true} 
              errors={errors} 
              options={planningsOptions}
              placeholder="Rechercher une catégorie" 
              defaultValue={menuPlat?.planning?.id}
            />

            <Input 
              label="Nom" 
              name="nom"
              control={control}
              required={true} 
              defaultValue={menuPlat?.nom}
              errors={errors} 
              placeholder="Entrez le nom du plat"
            />
            
            <Input 
              label="Description" 
              name="description"
              control={control}
              required={true} 
              defaultValue={menuPlat?.description}
              errors={errors} 
              placeholder="Entrez la description du menu"
            />         
            <Checkbox
              label="Active ?"
              name="enabled"
              control={control}
              required={false}
              defaultChecked={menuPlat?.enabled}
              errors={errors}
            />
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold mt-4 hover:bg-blue-600 transition-all duration-300"
              type="submit"
            >
              Mettre à jour le menu
            </motion.button>
          </form>
        </motion.div>
      )}
    </>
  );
};

export default StatutMenu;