import React, { useState, useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import axios from "axios";

export default function Navbar({ page, setPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [config, setConfig] = useState(null);

  // Charger la configuration au montage du composant
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await axios.get('/api/general');
        if (!response.data.error) {
          setConfig(response.data.config);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration navbar:', error);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    const pageElement = document.querySelector(`li.flex.${page}`);
    if (pageElement) {
      pageElement.style.borderBottom = "2px solid #FEA55F";
    }
  }, [page]);

  function thisPage(_page) {
    if (typeof window !== "undefined") {
      document.querySelectorAll(".navbar > ul > li.flex").forEach((el) => {
        el.style.borderBottom = "none";
      });
      const pageElement = document.querySelector(`li.flex.${_page}`);
      if (pageElement) {
        pageElement.style.borderBottom = "2px solid #FEA55F";
      }
    }
    setPage(_page);
    setIsMenuOpen(false); // Ferme le menu après le clic
  }

  // Valeur par défaut si la configuration n'est pas encore chargée
  const navbarName = config?.navbar?.name || "Your Name";

  return (
    <div className="components-container navbar flex">
      <p>{navbarName}</p>
      <div className="burger-menu">
        <Menu
          isOpen={isMenuOpen}
          onStateChange={({ isOpen }) => setIsMenuOpen(isOpen)}
          top
        >
          <a id="home" className="menu-item" onClick={() => thisPage("home")}>
            _home
          </a>
          <a id="about" className="menu-item" onClick={() => thisPage("about")}>
            _about
          </a>
          <a
            id="projects"
            className="menu-item"
            onClick={() => thisPage("projects")}
          >
            _projects
          </a>
          <a
            id="contact"
            className="menu-item"
            onClick={() => thisPage("contact")}
          >
            _contact
          </a>
        </Menu>
      </div>
      <ul className="flex">
        <li className="flex home" onClick={() => thisPage("home")}>
          _hello
        </li>
        <li className="flex about" onClick={() => thisPage("about")}>
          _about-me
        </li>
        <li className="flex projects" onClick={() => thisPage("projects")}>
          _projects
        </li>
        <li className="flex contact" onClick={() => thisPage("contact")}>
          _contact-me
        </li>
      </ul>
    </div>
  );
}