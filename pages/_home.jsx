import React, { useState, useEffect } from "react";
import createWindowandRedirect from "./_func/redirect";
import ChessboardCustom from "./_components/chessboard";
import axios from "axios";

export default function Home() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await axios.get('/api/general');
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setConfig(response.data.config);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
        setError('Erreur de chargement de la configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="container-background">
        <div className="container">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  const { hero } = config;

  return (
    <div className="container-background">
      <div className="container container-grid">
        <div className="presentation">
          <p>Hi all. I am</p>
          <h1>{hero.name}</h1>
          <p className="pre-blue">{">"} {hero.subtitle}</p>
          <p className="pre-grey">{hero.cta.parenthesis}:</p>
          <p className="presentation-code">
            <span className="pre-code-blue">const</span>{" "}
            <span className="pre-code-green">{hero.cta.name}</span> ={" "}
            <span
              className="pre-code-ahref"
              onClick={() => createWindowandRedirect(hero.cta.link)}
            >
              {'"'}{hero.cta.link}{'"'}
            </span>
          </p>
        </div>
        <div className="snake-game">
          <div className="border-snakegame">
            {Array.from({ length: 4 }, (_, i) => (
              <span className="vis" key={i}>
                <img src="/svg-x.svg" alt="x" />
              </span>
            ))}
          </div>
          <ChessboardCustom />
        </div>
      </div>
    </div>
  );
}