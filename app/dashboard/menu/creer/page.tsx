"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Input from "@/app/ui/form/Input";
import Select from "@/app/ui/form/Select";
import MultiSelect from "@/app/ui/form/SelectMultiples";
import Checkbox from "@/app/ui/form/Checkbox";
import { useRouter } from "next/navigation";
import { useNotification } from "@/app/ui/information/message";

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
  const [categories,setCategories] = useState([]);
  const [planning,setPlanning] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [plats, setPlats] = useState<Dish[]>([]);
  const id = '28a5e012-bcff-48f5-88e2-baf30a77668a';
  const notification = useNotification();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },setValue, watch
  } = useForm();
  const router = useRouter();
  const onSubmit = async (data:any) => {

    const { planningId, nom, description, platIds,menuJour,enabled } = data;
      
      const response = await fetch(`/api/restaurant/${id}/menu`, {
        method: "POST",
        headers: {
         'Authorization': `Bearer ${token}`, 
          "Content-Type": "application/json",
          "Auth": "Le programmeur"
        },
        body: JSON.stringify({
            planningId,
            nom,
            description,
            platIds,
            menuJour,
            enabled
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Erreur lors de la soumission: ${response.status}${errorData ? ' - ' + JSON.stringify(errorData) : ''}`);
      }

      notification.success('Menu crée avec succès!');
      //showMessage("success", 'Menu créer avec succès');
      router.push("/dashboard/menu/liste");
      // Récupérer et traiter la réponse correctement
     // const responseData = await response.json();
  };
  const token = localStorage.getItem("jwtToken");

    const getCategorieByRestaurant = async ()=>{
        setIsLoading(true)
        const reponse = await fetch(`/api/restaurant/${id}/plats/categorie`,{
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Auth': 'Le programmeur', // Autre en-tête personnalisé si nécessaire
                'Content-Type': 'application/json', // Spécifier le type de contenu
            }
        });

        if(!reponse.ok){
            setIsLoading(false)
            throw new Error(`Erreur: ,${reponse.status}`)
        }
        setIsLoading(false)
        const data = await reponse.json();
        setCategories(data.items);
    }

    const getPlannings = async ()=>{
        setIsLoading(true)
        const reponse = await fetch(`/api/restaurant/${id}/plannings`,{
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Auth': 'Le programmeur', // Autre en-tête personnalisé si nécessaire
                'Content-Type': 'application/json', // Spécifier le type de contenu
            }
        });

        if(!reponse.ok){
            setIsLoading(false)
            throw new Error(`Erreur: ,${reponse.status}`)
        }
        setIsLoading(false)
        const data = await reponse.json();
        setPlanning(data.items);
    }
    console.log('Test ',JSON.stringify(planning))

    useEffect(()=>{
        getCategorieByRestaurant();
        getPlannings();
        getPlats()
    },[])

    let planningsOptions: PlanningOption[] = [];
    
    if (Array.isArray(planning) && planning.length > 0) {
        planningsOptions = (planning as RawPlanning[]).map(item => ({
          value: item.id,
          label: item.nomJour
        }));
    }
    const options = ["Apples", "Nails", "Bananas", "Helicopters"];

    const getPlats = async()=> {
        setIsLoading(true)
        const response = await fetch(`/api/restaurant/${id}`,{
            headers: {
               'Authorization': `Bearer ${token}`, 
                'Auth': 'Le programmeur', // Autre en-tête personnalisé si nécessaire
                'Content-Type': 'application/json', // Spécifier le type de contenu
            }
        });
        if (!response.ok) {
            setIsLoading(false)
            throw new Error(`Erreur: ${response.status}`);
        }
        setIsLoading(false)
        const data= await response.json();
        setPlats(data.items);
    }

    const selectOptions : PlanningOption[] = plats.map(item => ({
        value: item.id,
        label: item.nom
      }));
      
      
    
    

  return (
     <>
       {!categories ? (
                <p>Chargement...</p>
            )
            :
            (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full mx-auto p-6 bg-white rounded-xl border-2 border-gray-300 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                    <h2 className="text-2xl font-bold text-center mb-6">Création de menu</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                       <Select 
                            label="Planning" 
                            name="planningId"
                            control={control}
                            required={true} 
                            errors={errors} 
                            options={planningsOptions}
                            placeholder="Rechercher une catégorie" 
                        />

                        <Input 
                            label="Nom" 
                            name="nom"
                            control={control}
                            required={true} 
                            errors={errors} 
                            placeholder="Entrez le nom du plat"
                        />
                        <Input 
                            label="Description" 
                            name="description"
                            control={control}
                            required={true} 
                            errors={errors} 
                            placeholder="Entrez la description du menu"
                        />
                       <MultiSelect
                            label="Fruits et objets"
                            name="platIds"
                            control={control}
                            required={true}
                            errors={errors}
                            options={selectOptions}  // Utiliser la prop "options" comme définie dans l'interface
                            placeholder="Choisissez des éléments"
                        />
                        <Checkbox
                            label="Menu du jour ?"
                            name="menuJour"
                            control={control}
                            required={false}
                            errors={errors}
                        />
                        <Checkbox
                            label="Active ?"
                            name="enabled"
                            control={control}
                            required={false}
                            errors={errors}
                        />
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold mt-4 hover:bg-blue-600 transition-all duration-300"
                            type="submit"
                        >
                            Créer le menu
                        </motion.button>
                    </form>
                </motion.div>
            )
        }
     </>
  );
};

export default AnimatedForm;