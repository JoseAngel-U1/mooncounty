import { useNavigate } from 'react-router-dom';
import StartScreen from '../../components/ui/StartScreen/StartScreen';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <StartScreen onStart={() => navigate('/levels')} />
    </div>
  );
}
