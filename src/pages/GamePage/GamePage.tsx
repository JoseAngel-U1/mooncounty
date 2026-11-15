import { Navigate, useParams } from 'react-router-dom';
import NavigationButton from '../../components/shared/NavigationButton/NavigationButton';
import PhaserGame from '../../components/shared/PhaserGame/PhaserGame';
import LaunchPanel from '../../components/ui/LaunchPanel/LaunchPanel';
import { getLevelById } from '../../game/levels/registry';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './GamePage.css';

export default function GamePage() {
  const { levelId } = useParams<{ levelId: string }>();
  const level = getLevelById(levelId);

  // Validar antes de montar Phaser, también en accesos directos a la URL.
  if (!level) return <NotFoundPage />;
  if (level.status === 'locked') return <Navigate to="/levels" replace />;

  return (
    <main className="game-view">
      <PhaserGame key={level.id} sceneKey={level.sceneKey} />
      {level.id === 'earth' && <LaunchPanel />}
      <NavigationButton className="game-back" to="/levels">VOLVER A MAPAS</NavigationButton>
    </main>
  );
}
