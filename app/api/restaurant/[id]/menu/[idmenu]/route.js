import { NextResponse } from "next/server";

export async function GET(request, {params}){
  
  try {
        const { id, idmenu } = params;
        const token = request.headers.get("Authorization")?.split(" ")[1];

        if (!token) {
          throw new Error("Token manquant");
        }
        // Remplacez cette URL par votre API réelle
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/menus/${idmenu}`,{
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

export async function PATCH(request, { params }) {
  try {
    const { id, idmenu } = params;
    // Extraction du corps de la requête
    
    const requestBody = await request.json();

    // Vérification du token d'authentification
    const authHeader = request.headers.get("Authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token d'authentification manquant" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Envoi de la requête PATCH à l'API
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/menus/${idmenu}/enabled`, {
      method: "PATCH",
      headers: {
        'Authorization': `Bearer ${token}`, 
         'Auth': 'Le programmeur', // Autre en-tête personnalisé si nécessaire
         'Content-Type': 'application/json', // Spécifier le type de contenu
      },
      body: JSON.stringify(requestBody),
    });

    // Vérification de la réponse de l'API
    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: `Erreur lors de la modification: ${apiResponse.status}` }),
        { status: apiResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const responseData = await apiResponse.json();

    // Retourne la réponse réussie
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Une erreur est survenue lors du traitement de la demande" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

