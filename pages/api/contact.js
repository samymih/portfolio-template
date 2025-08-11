// pages/api/contact.js
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export default async function handler(req, res) {
  // GET - Récupérer la configuration
  if (req.method === 'GET') {
    try {
      const generalPath = path.join(process.cwd(), "config", "general.json");
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(generalPath)) {
        return res.status(404).json({
          contacts: {},
          error: 'Configuration file not found'
        });
      }

      const generalData = JSON.parse(fs.readFileSync(generalPath, "utf8"));

      res.status(200).json({
        contacts: generalData.contact || {},
      });
    } catch (error) {
      console.error("Erreur lors du chargement de la config:", error);
      res.status(500).json({
        contacts: {},
        error: 'Failed to load configuration'
      });
    }
    return;
  }

  // POST - Envoyer le message via Discord webhook
  if (req.method === 'POST') {
    // Validation des données requises
    if (!req.body.name || !req.body.email || !req.body.message) {
      return res.status(400).json({
        message: 'Données manquantes. Nom, email et message sont requis.'
      });
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        message: 'Format d\'email invalide.'
      });
    }

    // Validation de la longueur des champs
    if (req.body.name.length < 2 || req.body.name.length > 100) {
      return res.status(400).json({
        message: 'Le nom doit contenir entre 2 et 100 caractères.'
      });
    }

    if (req.body.message.length < 10 || req.body.message.length > 2000) {
      return res.status(400).json({
        message: 'Le message doit contenir entre 10 et 2000 caractères.'
      });
    }

    try {
      // Lire la configuration pour récupérer le webhook URL
      const generalPath = path.join(process.cwd(), "config", "general.json");
      let webhookUrl = null;

      if (fs.existsSync(generalPath)) {
        try {
          const generalData = JSON.parse(fs.readFileSync(generalPath, "utf8"));
          webhookUrl = generalData.contact?.webhook?.discord || process.env.DISCORD_WEBHOOK_URL;
        } catch (configError) {
          console.error('Erreur lors de la lecture de la config pour le webhook:', configError);
          webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        }
      } else {
        webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      }

      // Vérifier qu'on a bien un webhook URL
      if (!webhookUrl) {
        return res.status(500).json({
          message: 'Configuration du webhook Discord manquante. Veuillez configurer le webhook dans general.json ou via les variables d\'environnement.'
        });
      }
      
      // Préparer le payload pour Discord
      const discordPayload = {
        embeds: [{
          title: `${req.body.name} vous a envoyé un message !`,
          description: req.body.message,
          color: 16763904, // Couleur orange
          timestamp: new Date().toISOString(),
          fields: [
            {
              name: 'Email',
              value: req.body.email,
              inline: true
            },
            {
              name: 'Date',
              value: req.body.date || new Date().toLocaleDateString("fr-FR"),
              inline: true
            }
          ],
          footer: {
            text: 'Formulaire de contact'
          }
        }]
      };

      // Envoyer le message à Discord
      await axios.post(webhookUrl, discordPayload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // Timeout de 10 secondes
      });

      res.status(200).json({
        message: "Message envoyé avec succès !"
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      // Gestion spécifique des erreurs Discord
      if (error.response) {
        console.error('Erreur Discord:', error.response.status, error.response.data);
        return res.status(500).json({
          message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
        });
      }
      
      // Erreur de réseau ou autre
      res.status(500).json({
        message: 'Erreur serveur. Veuillez réessayer plus tard.'
      });
    }
    return;
  }

  // Méthode non autorisée
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ 
    message: `Méthode ${req.method} non autorisée. Utilisez GET ou POST.` 
  });
}