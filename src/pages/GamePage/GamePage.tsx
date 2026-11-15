import { Navigate, useParams } from 'react-router-dom';
import NavigationButton from '../../components/shared/NavigationButton/NavigationButton';
import PhaserGame from '../../components/shared/PhaserGame/PhaserGame';
import { getLevelById } from '../../game/levels/levels';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './GamePage.css';

export default function GamePage() {
  const { levelId } = useParams<{ levelId: string }>();
  const level = getLevelById(levelId);

  // Validar antes de montar Phaser, también en accesos directos a la URL.
  if (!level) return <NotFoundPage />;
  if (level.status === 'locked') return <Navigate to="/levels" replace />;
  if (level.kind === 'page') return <Navigate to={level.path} replace />;

  return (
    <main className="game-view">
      <PhaserGame key={level.id} sceneKey={level.sceneKey} />
      <NavigationButton className="game-back" to="/levels">VOLVER A MAPAS</NavigationButton>
    </main>
  );
}
