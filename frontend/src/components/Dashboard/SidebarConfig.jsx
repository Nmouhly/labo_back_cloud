import React, { useState } from 'react';
import './SidebarConfig.css'; // Ensure this file includes styles for your new changes

const SidebarConfig = () => {
  const [visibility, setVisibility] = useState({
    organisation: true,
    equipes: true,
    personnel: {
      visible: true,
      membres: true,
      anciens: true,
    },
    publications: {
      visible: true,
      ouvrages: true,
      revues: true,
      conferences: true,
      reports: true,
      thesesDoctorat: true,
      habilitation: true,
    },
    projets: true,
    informations: true,
    evenements: true,
  });

  const [message, setMessage] = useState('');

  // Updated toggle function to handle nested visibility toggling
  const toggleVisibility = (key, subkey = null) => {
    setVisibility((prevVisibility) => {
      if (subkey) {
        // For nested keys (e.g., personnel.membres)
        return {
          ...prevVisibility,
          [key]: {
            ...prevVisibility[key],
            [subkey]: !prevVisibility[key][subkey],
          },
        };
      } else {
        // For top-level keys (e.g., organisation)
        return { ...prevVisibility, [key]: !prevVisibility[key] };
      }
    });
  };

  const handleSave = () => {
    localStorage.setItem('sidebarVisibility', JSON.stringify(visibility));
    setMessage('Les paramètres ont été enregistrés avec succès !');
    setTimeout(() => setMessage(''), 3000); // Reset the message after 3 seconds
  };

  return (
    <div className="sidebar-config-container">
      <h2>Configuration de la sidebar</h2>
      <p>
        Décochez une case pour rendre l'élément invisible.
      </p>
      <ul>
        {/* Organisation */}
        <li>
          <input
            type="checkbox"
            checked={visibility.organisation}
            onChange={() => toggleVisibility('organisation')}
          />
          <span>Organisation</span>
        </li>

        {/* Équipes */}
        <li>
          <input
            type="checkbox"
            checked={visibility.equipes}
            onChange={() => toggleVisibility('equipes')}
          />
          <span>Équipes</span>
        </li>

        {/* Personnel */}
        <li>
          <input
            type="checkbox"
            checked={visibility.personnel.visible}
            onChange={() => toggleVisibility('personnel', 'visible')}
          />
          <span>Personnel</span>
          <ul>
            <li>
              <input
                type="checkbox"
                checked={visibility.personnel.membres}
                onChange={() => toggleVisibility('personnel', 'membres')}
                disabled={!visibility.personnel.visible} // Disable if Personnel is not visible
              />
              <span>Membres</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={visibility.personnel.anciens}
                onChange={() => toggleVisibility('personnel', 'anciens')}
                disabled={!visibility.personnel.visible} // Disable if Personnel is not visible
              />
              <span>Anciens</span>
            </li>
          </ul>
        </li>

       {/* Publications */}
<li>
  <input
    type="checkbox"
    checked={visibility.publications.visible}
    onChange={() => toggleVisibility('publications', 'visible')}
  />
  <span>Publications</span>
  <ul>
    <li>
      <input
        type="checkbox"
        checked={visibility.publications.ouvrages}
        onChange={() => toggleVisibility('publications', 'ouvrages')}
        disabled={!visibility.publications.visible} // Désactivé si Publications est caché
      />
      <span>Ouvrages</span>
    </li>
    <li>
      <input
        type="checkbox"
        checked={visibility.publications.revues}
        onChange={() => toggleVisibility('publications', 'revues')}
        disabled={!visibility.publications.visible} // Désactivé si Publications est caché
      />
      <span>Revues</span>
    </li>
    <li>
      <input
        type="checkbox"
        checked={visibility.publications.conferences}
        onChange={() => toggleVisibility('publications', 'conferences')}
        disabled={!visibility.publications.visible} // Désactivé si Publications est caché
      />
      <span>Conférences</span>
    </li>
    <li>
      <input
        type="checkbox"
        checked={visibility.publications.reports}
        onChange={() => toggleVisibility('publications', 'reports')}
        disabled={!visibility.publications.visible} // Désactivé si Publications est caché
      />
      <span>Rapports</span>
    </li>
    <li>
      <input
        type="checkbox"
        checked={visibility.publications.thesesDoctorat}
        onChange={() => toggleVisibility('publications', 'thesesDoctorat')}
        disabled={!visibility.publications.visible} // Désactivé si Publications est caché
      />
      <span>Thèses et Habilitations</span>
    </li>
  </ul>
</li>

        {/* Projets */}
        <li>
          <input
            type="checkbox"
            checked={visibility.projets}
            onChange={() => toggleVisibility('projets')}
          />
          <span>Projets</span>
        </li>

        {/* Informations */}
        <li>
          <input
            type="checkbox"
            checked={visibility.informations}
            onChange={() => toggleVisibility('informations')}
          />
          <span>Informations</span>
        </li>

        {/* Événements */}
        <li>
          <input
            type="checkbox"
            checked={visibility.evenements}
            onChange={() => toggleVisibility('evenements')}
          />
          <span>Événements</span>
        </li>
      </ul>

      <button className="save-button" onClick={handleSave}>Enregistrer</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SidebarConfig;
