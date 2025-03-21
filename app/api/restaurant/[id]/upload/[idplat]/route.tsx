// app/api/restaurant/[idrestaurant]/dishes/[idplat]/images/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; idplat: string } }
) {
  try {
    const { id, idplat } = params;
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    console.log('Envoi vers l\'API externe pour le restaurant:', id, 'et le plat:', idplat);
    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    // Récupérer les données du formulaire
    const formData = await request.formData();
    const file = formData.get('file') as File;;
    formData.append('image', file); // Remplace 'file' par 'image'

    for (const pair of formData.entries()) {
      console.log(`FormData envoyé: ${pair[0]} =>`, pair[1]);
    }
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier trouvé" }, { status: 400 });
    }
    
    console.log('Fichier reçu:', (file as File).name, 'Taille:', (file as File).size);
    console.log('Envoi vers l\'API externe pour le restaurant:', id, 'et le plat:', idplat);

    // Transférer directement à l'API externe
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}/dishes/${idplat}/images`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Ne pas définir Content-Type pour FormData
      },
      body: formData,
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API externe: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Erreur API: ${response.status}` },
        { status: response.status }
      );
    }

    // Retourner la réponse de l'API externe
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}