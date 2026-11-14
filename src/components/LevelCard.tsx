import type { AvailableLevel, Level } from '../levels/levels';
import './LevelCard.css';

type LevelCardProps = {
  level: Level;
  onSelect: (level: AvailableLevel) => void;
};

export default function LevelCard({ level, onSelect }: LevelCardProps) {
  const available = level.status === 'available';

  return (
    <article className={`level-card${available ? '' : ' level-card--locked'}`}>
      <img className="level-card-image" src={level.image} alt={`Ilustración pixel art de ${level.title}`} width={320} height={180} />
      <div className="level-card-content">
        <span className="level-card-status">{available ? 'DISPONIBLE' : 'BLOQUEADO'}</span>
        <h2>{level.title}</h2>
        <p id={`level-description-${level.id}`}>{level.description}</p>
        <button
          className="level-card-button"
          type="button"
          disabled={!available}
          aria-label={available ? `Explorar ${level.title}` : `${level.title}: bloqueado`}
          aria-describedby={`level-description-${level.id}`}
          onClick={() => {
            if (level.status === 'available') onSelect(level);
          }}
        >
          {available ? 'EXPLORAR' : 'NO DISPONIBLE'}
        </button>
      </div>
    </article>
  );
}
