"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Input from "@/app/ui/form/Input";
import Select from "@/app/ui/form/Select";
import MultiSelect from "@/app/ui/form/SelectMultiples";
import Checkbox from "@/app/ui/form/Checkbox";
import { useParams, useRouter } from "next/navigation.js";
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
  
const EditMenu = () => { 
  const [categories, setCategories] = useState([]);
  const [menuPlat, setMenuPlat] = useState<ApiResponse | null>(null);
  const [planning, setPlanning] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [plats, setPlats] = useState<Dish[]>([]);
  const id = '28a5e012-bcff-48f5-88e2-baf30a77668a';
  const notification = useNotification()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();
  const params = useParams();
  const router = useRouter();
  const idmenu = params.idmenu as string;
 console.log('params ',params)

 const token = localStorage.getItem("jwtToken");
 const onSubmit = async (data: any) => {
  try {
    // Extraire uniquement les IDs des plats si platIds est un tableau d'objets
    const platIdsArray = Array.isArray(data.platIds) 
      ? data.platIds.map((plat: any) => plat.value || plat)
      : data.platIds;
    
    const { planningId, nom, description, menuJour, enabled } = data;
    console.log('{ planningId, nom, description, menuJour, enabled } ',{ planningId, nom, description, menuJour, enabled })
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/menus/${idmenu}`, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
        "Auth": "Le programmeur"
      },
      body: JSON.stringify({
        planningId,
        nom,
        description,
        platIds: platIdsArray, // Utiliser le tableau d'IDs transformé
        menuJour : menuJour,
        enabled
      }),
    });
    
    // Vérifier d'abord si la réponse est OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Erreur inconnue" }));
      throw new Error(`Erreur lors de la soumission: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    notification.success('Plat modifié avec succès!');
    // Ensuite traiter la réponse
    const responseData = await response.json();
    router.push("/dashboard/menu/liste");
    
    // Ajoutez ici la logique après succès (redirection, message, etc.)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du menu:", error);
    // Afficher un message d'erreur à l'utilisateur
  }
};  

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
      console.log('Papo ',data)
      // Initialiser les valeurs du formulaire avec les données du menu
      if (data) {
        setValue("nom", data.nom);
        setValue("description", data.description);
        setValue("menuJour", data.menuJour);
        setValue("enabled", data.enabled);
        setValue("planningId", data.planning?.id);
        
        // Préparer les plats sélectionnés pour le MultiSelect
        //console.log('data.plats ',data.plats);
        if (data.plats && data.plats.length > 0) {
          const defaultPlatsOptions = data.plats.map((plat:Plat) => ({
            value: plat.id,
            label: plat.nom
          }));
          setValue("platIds", defaultPlatsOptions);
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
    try {
        const response = await fetch(`/api/restaurant/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        
        const data = await response.json();
        setPlats(data.items);
    } catch (error) {
        console.error(error);
    }
  };
  console.log('plats1 ',plats)

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

  const selectOptions: PlanningOption[] = plats.map(item => ({
      value: item.id,
      label: item.nom
  }));


  const defaulPlats  = menuPlat?.plats?.map(plat => ({
      value: plat.id,
      label: plat.nom
  }));

 // menuPlat?.plats?.map(plat => plat.nom)
 console.log('defaulPlats ',defaulPlats)

  console.log('selectOptions ',selectOptions)

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
          <h2 className="text-2xl font-bold text-center mb-6">Modification de menu</h2>
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
            
            <MultiSelect
              label="Plats"
              name="platIds"
              control={control}
              required={true}
              errors={errors}
              options={selectOptions}
              placeholder="Choisissez des éléments"
              // No need to set defaultValue here as you're using setValue
            />
            
            <Checkbox
              label="Menu du jour ?"
              name="menuJour"
              control={control}
              required={false}
              defaultChecked={menuPlat?.menuJour}
              errors={errors}
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

export default EditMenu;