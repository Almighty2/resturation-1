import { NextResponse } from "next/server";

export async function GET(request, {params}){
  
  try {
        const { id } =  await params;
        const token = request.headers.get("Authorization")?.split(" ")[1];

        if (!token) {
          throw new Error("Token manquant");
        }
        // Remplacez cette URL par votre API réelle
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/supplements`,{
          headers: {
             'Authorization': `Bearer ${token}`, 
              'Auth': 'Le programmeur', // Autre en-tête personnalisé si nécessaire
              'Content-Type': 'application/json', // Spécifier le type de contenu
          }
      });
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const dishes = await response.json();
        return NextResponse.json(dishes);
      } catch (error) {
        console.error("Erreur lors de la récupération du menu:", error);
        return NextResponse.json(
          { error: "Impossible de récupérer les menu" },
          { status: 500 }
        );
    }
}