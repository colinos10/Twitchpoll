// netlify/functions/getPoll.js
const fetch = require('node-fetch'); // Pour faire des requêtes HTTP

exports.handler = async (event, context) => {
    // 1. Récupère les variables d'environnement (configurées sur Netlify)
    const token = process.env.TWITCH_TOKEN;
    const channelId = process.env.TWITCH_CHANNEL_ID;
    const clientId = process.env.TWITCH_CLIENT_ID;

    // Vérifie que tout est bien configuré
    if (!token || !channelId || !clientId) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Le serveur n'est pas correctement configuré. Vérifie les variables d'environnement."
            })
        };
    }

    try {
        // 2. Appelle l'API Twitch pour récupérer les polls
        const response = await fetch(`https://api.twitch.tv/helix/polls?broadcaster_id=${channelId}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur API Twitch : ${response.status}`);
        }

        const data = await response.json();

        // 3. Retourne les données au frontend
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Erreur dans getPoll:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Impossible de récupérer les données du poll. Réessaye plus tard.",
                details: error.message // Seulement pour le débogage (à supprimer en production)
            })
        };
    }
};
