import { NextResponse } from "next/server";

export async function GET(request, {params}){
  
  try {
        const { id } =  await params;
        const token = request.headers.get("Authorization")?.split(" ")[1];

        if (!token) {
          throw new Error("Token manquant");
        }
        // Remplacez cette URL par votre API réelle
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/menus`,{
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

export async function POST(req, { params }) {
  try {
    const { id } = params; // Récupérer l'ID du restaurant depuis l'URL
    const { planningId, nom, description, platIds,menuJour,enabled }  = await req.json(); // Lire les données envoyées
    const token = req.headers.get("Authorization")?.split(" ")[1];
    // Validation des champs obligatoires
    if (!planningId || !nom ) {
      return NextResponse.json({ 
        success: false, 
        message: "Tous les champs sont requis" 
      }, { status: 400 });
    }
    // Envoi des données au service externe
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/menus`,
      {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planningId, 
          nom, 
          description, 
          platIds,
          menuJour,
          enabled
        }),
      }
    );

    // Récupération du corps de la réponse
    const responseData = await res.json();

    if (!res.ok) {
      // Gestion détaillée des erreurs de l'API
      return NextResponse.json({ 
        success: false, 
        message: `Erreur API externe: ${res.status}`,
        error: responseData 
      }, { status: res.status });
    }

    // Assurez-vous que responseData a la structure attendue
    // Si l'ID est dans une propriété spécifique, extrayez-le
    const platId = responseData.id || responseData.platId || responseData.dishId || 
                   (responseData.dish && responseData.dish.id) || 
                   (responseData.data && responseData.data.id);
                   
    // Si vous ne trouvez pas d'ID, utilisez l'objet complet
    const dataToReturn = platId ? 
      { 
        ...responseData,
        id: platId // Assurez-vous que l'ID est bien disponible au premier niveau
      } : responseData;

    return NextResponse.json({ 
      success: true, 
      message: "Plat créé avec succès",
      data: dataToReturn
    });
  } catch (error) {
    console.error("Erreur lors de la création du plat:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Erreur serveur", 
      error: error.message 
    }, { status: 500 });
  }
}