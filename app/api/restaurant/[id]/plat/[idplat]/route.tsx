import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; idplat: string } }
){
  
  try {
        const { id, idplat } = params;
        const token = request.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
          throw new Error("Token manquant");
        }
        // Remplacez cette URL par votre API réelle
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/dishes/${idplat}`,{
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
        console.error("Erreur lors de la récupération du plat:", error);
        return NextResponse.json(
          { error: "Impossible de récupérer le plat" },
          { status: 500 }
        );
    }    
}





export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; idplat: string } }
) {
  try {
    const { id, idplat } = params;
    
    // Extraction et vérification du token
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      console.error("Token d'authentification manquant");
      return NextResponse.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      );
    }
    
    console.log("Token reçu (début):", token.substring(0, 10) + "...");
    
    // Extraction de l'image à partir du formulaire
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: "Aucune image n'a été fournie" },
        { status: 400 }
      );
    }
    
    console.log("Image reçue:", imageFile.name, imageFile.size, "bytes");
    
    // Préparation de la requête vers l'API externe
    const apiFormData = new FormData();
    apiFormData.append('image', imageFile);

    // Exécution de la requête vers l'API externe
    console.log(`Envoi à l'API: ${id}/dishes/${idplat}/images`);
    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/dishes/${idplat}/images`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: apiFormData,
      }
    );

    // Traitement de la réponse de l'API
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Erreur API ${apiResponse.status}:`, errorText);
      return NextResponse.json(
        { error: `Erreur lors de la mise à jour de l'image: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const responseData = await apiResponse.json();
    console.log("Réponse API reçue avec succès:", responseData);

    // Retourne la réponse réussie
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement de la demande" },
      { status: 500 }
    );
  }
}
