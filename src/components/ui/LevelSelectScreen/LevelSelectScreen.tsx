import { useEffect, useRef } from 'react';
import { levels } from '../../../game/levels/registry';
import type { AvailableLevel } from '../../../game/levels/registry';
import LevelCard from '../LevelCard/LevelCard';
import NavigationButton from '../../shared/NavigationButton/NavigationButton';
import './LevelSelectScreen.css';

type LevelSelectScreenProps = {
  onSelect: (level: AvailableLevel) => void;
};

export default function LevelSelectScreen({ onSelect }: LevelSelectScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="level-select" aria-labelledby="level-select-title">
      <div className="level-select-content">
        <NavigationButton to="/">VOLVER AL INICIO</NavigationButton>
        <header className="level-select-heading">
          <p>MOONCOUNTY · DESTINOS</p>
          <h1 id="level-select-title" ref={headingRef} tabIndex={-1}>Selecciona un mapa</h1>
          <p>Elige dónde comienza tu aventura.</p>
        </header>
        <div className="level-select-grid">
          {levels.map((level) => 
            <LevelCard 
              key={level.id}
              level={level}
              onSelect={onSelect} 
            />
          )}
        </div>
      </div>
    </main>
  );
}
