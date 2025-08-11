// pages/api/projects.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const projectsPath = path.join(process.cwd(), 'config', 'projects.json');
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(projectsPath)) {
      return res.status(404).json({
        projects: { projects: [] },
        error: 'Projects configuration file not found'
      });
    }

    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

    res.status(200).json(projectsData);

  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error);
    res.status(500).json({
      projects: { projects: [] },
      error: 'Failed to load projects configuration'
    });
  }
}