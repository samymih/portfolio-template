import React, { useState, useEffect } from 'react';
import { SiTwitter, SiGithub, SiLinkedin } from 'react-icons/si';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import createWindowandRedirect from '../_func/redirect';
import Twitter from './Twitter';
import axios from 'axios';

export default function Footer() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration par défaut
  const defaultConfig = {
    footer: {
      leftLink: {
        url: 'https://www.linkedin.com/in/username',
        icon: '<FaLinkedin />'
      },
      rightLink: {
        url: 'https://github.com/username',
        icon: '<FaGithub />',
        name: 'github'
      }
    }
  };

  const iconMap = {
    'github': <FaGithub />,
    'linkedin': <FaLinkedin />,
    'twitter': <FaTwitter />,
  };

  const getIcon = (iconString) => {
    return iconMap[iconString] || <SiGithub />; 
  };

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/general');
        console.log('Réponse de la configuration footer:', response.data);
        
        // Vérifier la structure de la réponse
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        
        // Utiliser response.data.config au lieu de response.data directement
        const configData = response.data.config || response.data;
        setConfig(configData);
        
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration footer:', error);
        setError(error.message);
        // Utiliser la configuration par défaut en cas d'erreur
        setConfig(defaultConfig);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Utiliser la configuration par défaut si aucune config n'est chargée
  const footerConfig = config?.footer || defaultConfig.footer;

  if (loading) {
    return (
      <div className="components-container footer flex">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="components-container footer flex">
      <p>find me in:</p>
      <ul className="flex">
        <li
          className="flex twitter"
          style={{
            borderRight: '2px solid #1b2c3d',
          }}
          onClick={() => createWindowandRedirect(footerConfig.leftLink?.url || 'https://www.linkedin.com/in/username')}
        >
          {footerConfig.leftLink?.icon ? getIcon(footerConfig.leftLink.icon) : <FaLinkedin />}
        </li>
        <li
          className="flex github"
          onClick={() =>
            createWindowandRedirect(footerConfig.rightLink?.url || 'https://github.com/username')
          }
        >
          @{footerConfig.rightLink?.name || 'github'}
          {footerConfig.rightLink?.icon ? getIcon(footerConfig.rightLink.icon) : <SiGithub />}
        </li>
      </ul>
      {error && (
        <div className="error-message" style={{ fontSize: '0.8em', color: '#ff6b6b', marginTop: '5px' }}>
          Config error: {error}
        </div>
      )}
    </div>
  );
}