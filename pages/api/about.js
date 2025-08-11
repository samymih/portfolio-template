// pages/api/about.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Chemins vers les fichiers de configuration
    const aboutPath = path.join(process.cwd(), 'config', 'about.json');
    const aboutItemsPath = path.join(process.cwd(), 'config', 'aboutItems.json');
    const generalPath = path.join(process.cwd(), 'config', 'general.json');
    
    // Vérifier que tous les fichiers existent
    const files = [
      { path: aboutPath, name: 'about.json' },
      { path: aboutItemsPath, name: 'aboutItems.json' },
      { path: generalPath, name: 'general.json' }
    ];

    for (const file of files) {
      if (!fs.existsSync(file.path)) {
        console.warn(`Fichier manquant: ${file.name}`);
      }
    }

    // Charger les données avec gestion d'erreur individuelle
    let aboutData = { about: [] };
    let aboutItemsData = { about: [] };
    let generalData = { about: { contacts: {} } };

    if (fs.existsSync(aboutPath)) {
      aboutData = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));
    }

    if (fs.existsSync(aboutItemsPath)) {
      aboutItemsData = JSON.parse(fs.readFileSync(aboutItemsPath, 'utf8'));
    }

    if (fs.existsSync(generalPath)) {
      generalData = JSON.parse(fs.readFileSync(generalPath, 'utf8'));
    }

    res.status(200).json({
      aboutContent: aboutData.about || [],
      aboutItems: aboutItemsData,
      contacts: generalData.about?.contacts || {}
    });

  } catch (error) {
    console.error('Erreur lors du chargement des configurations about:', error);
    res.status(500).json({
      aboutContent: [],
      aboutItems: { about: [] },
      contacts: {},
      error: 'Failed to load configuration files'
    });
  }
}