// pages/api/general.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const generalPath = path.join(process.cwd(), 'config', 'general.json');
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(generalPath)) {
      return res.status(404).json({
        config: null,
        error: 'Le fichier config/general.json n\'existe pas'
      });
    }

    const configData = fs.readFileSync(generalPath, 'utf8');
    const config = JSON.parse(configData);

    res.status(200).json({
      config,
      error: null
    });

  } catch (error) {
    console.error('Erreur lors du chargement de la config generale:', error);
    res.status(500).json({
      config: null,
      error: error.message || 'Erreur inconnue lors du chargement de la configuration'
    });
  }
}