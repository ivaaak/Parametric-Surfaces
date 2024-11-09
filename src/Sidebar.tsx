import React from 'react';
import styles from './Sidebar.module.css';
import { Surface } from './types';

interface SidebarProps {
  surfaces: Surface[];
  selectedSurface: Surface;
  onSelectSurface: (surface: Surface) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  surfaces,
  selectedSurface,
  onSelectSurface
}) => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Parametric Surfaces</h2>
      <h5>Formulas are referenced from <a href="http://www.3d-meier.de/tut3/Seite0.html">"Parametrische Flächen und Körper"</a>.</h5>
      <br/>
      <ul className={styles.list}>
        {surfaces.map((surface) => (
          <li 
            key={surface.id}
            className={`${styles.listItem} ${
              selectedSurface.id === surface.id ? styles.selected : ''
            }`}
            onClick={() => onSelectSurface(surface)}
          >
            {surface.name}
          </li>
        ))}
      </ul>
    </div>
  );
};