"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Select from "@/app/ui/form/Select";
import MultiSelect from "@/app/ui/form/SelectMultiple";
import Input from "@/app/ui/form/Input";
import { Upload, GetProp, UploadFile, UploadProps, message } from "antd";
import Button from "@/app/ui/button";
import Checkbox from "@/app/ui/form/Checkbox";
import { useNotification } from "@/app/ui/information/message";

type ApiResponse = {
    categorie: {
        id: string;
        nom: string;
    };
    nom: string;
    description: string;
    prix: string;
    plats?: Array<{
        id: string;
        nom: string;
    }>;
    enabled?: boolean;
};
interface PropsPlas {
    id: string;
    code: string | null;
    nom: string;
  }
interface RawCategory {
  id: string;
  nom: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface FormData {
  categorie: string;
  nom: string;
  prix: string;
  description: string;
  enabled: string;
  items: string[];
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const AnimatedForm = () => {
  const [categories, setCategories] = useState<RawCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [plat, setPlat] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = '28a5e012-bcff-48f5-88e2-baf30a77668a';
  const notification = useNotification()
  const idplat = params.idplat as string;
  const token = typeof window !== 'undefined' ? localStorage.getItem("jwtToken") : null;
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormData>();

  const getPlat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/restaurant/${id}/plat/${idplat}`, {
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
      
      // Initialiser les valeurs du formulaire avec les données du plat
      if (data) {
        setValue("nom", data.nom);
        setValue("description", data.description);
        setValue("categorie", data.categorie.id);
        setValue("prix", data.prix);
        setValue("enabled", data.enabled);
        
        // Préparer les suppléments sélectionnés pour le MultiSelect si nécessaire
        if (data.plats && data.plats.length > 0) {
           const platIds = data.plats.map((plat:PropsPlas) => plat.nom);
           setValue("items", platIds);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du plat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
        setIsSubmitting(true);
        const response = await fetch(`/api/restaurant/${id}/repas/${idplat}`, {
          method: "PATCH",
          headers: {
            'Authorization': `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categorieId: data.categorie,
            nom: data.nom,
            description: data.description,
            prix: (data.prix),
            enabled: data.enabled
          }),
        });
        console.log('response ',response)
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(`Erreur lors de la soumission1: ${response.status}${errorData ? ' - ' + JSON.stringify(errorData) : ''}`);
        }
        
        // Récupérer et traiter la réponse correctement
        const responseData = await response.json();
        console.log('Réponse du serveur:', responseData);
        
        // Réinitialiser le formulaire et rediriger
        notification.success('Plat modifié avec succès!');
        reset();
        router.push("/dashboard/plats/liste");
        
      } catch (err: any) {
        console.error("Erreur de soumission:", err);
        setError(err.message || "Une erreur est survenue lors de la mise à jour du plat.");
      } finally {
        setIsSubmitting(false);
      }
  };

  const getCategorieByRestaurant = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/restaurant/${id}/plats/categorie`,
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
            "Auth": "Le programmeur",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error("Format de données invalide");
      }
      
      setCategories(data.items);
    } catch (err: any) {
      console.error("Erreur lors du chargement des catégories:", err);
      setError(err.message || "Erreur lors du chargement des catégories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getCategorieByRestaurant();
      if (idplat) {
        getPlat();
      }
    } else {
      router.push('/login');
    }
  }, [idplat]);

  // Création des options pour le composant Select
  const categoriesOptions: CategoryOption[] = categories.map((item) => ({
    value: item.id,
    label: item.nom,
  }));

  // Exemple d'options pour les suppléments
  const options = ["Apples", "Nails", "Bananas", "Helicopters"];
  
  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => {
              getCategorieByRestaurant();
              if (idplat) getPlat();
            }}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full mx-auto p-6 bg-white rounded-xl border-2 border-gray-300 shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Modifier le plat</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Select
              label="Catégorie"
              name="categorie"
              control={control}
              required={true}
              errors={errors}
              options={categoriesOptions}
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
              placeholder="Entrez la description du plat"
            />
            <Input
              label="Prix du plat"
              name="prix"
              control={control}
              required={true}
              errors={errors}
              type="number"
              placeholder="Entrez le prix du plat"
            />
            <MultiSelect
              label="Sélectionnez les suppléments"
              name="items"
              control={control}
              errors={errors}
              options={options}
              placeholder="Choisissez vos items"
              required={false}
            />
            <Checkbox
                  label="Active ?"
                  name="enabled"
                  control={control}
                  required={false}
                  errors={errors}
            />   
            <Button 
                type="submit" 
                className={`primary ${isSubmitting || uploadingImage ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitting || uploadingImage}
            >
                {isSubmitting ? 'Envoi en cours...' : uploadingImage ? 'Téléchargement de l\'image...' : 'Mettre à jour'}
            </Button>
          </form>
        </motion.div>
      )}
    </>
  );
};

export default AnimatedForm;