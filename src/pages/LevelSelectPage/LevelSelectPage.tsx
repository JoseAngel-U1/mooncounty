import { useNavigate } from 'react-router-dom';
import LevelSelectScreen from '../../components/ui/LevelSelectScreen/LevelSelectScreen';
import './LevelSelectPage.css';

export default function LevelSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="level-select-page">
      <LevelSelectScreen onSelect={(level) => navigate(`/game/${encodeURIComponent(level.id)}`)} />
    </div>
  );
}
