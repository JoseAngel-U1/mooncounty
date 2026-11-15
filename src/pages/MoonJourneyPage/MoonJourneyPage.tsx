import NavigationButton from '../../components/shared/NavigationButton/NavigationButton';
import PhaserGame from '../../components/shared/PhaserGame/PhaserGame';
import './MoonJourneyPage.css';

export default function MoonJourneyPage() {
  return (
    <main className="moon-journey-view" aria-label="Viaje a la Luna — Interior de la nave">
      <PhaserGame key="moon-journey-ship-interior" sceneKey="ship-interior" />
      <NavigationButton className="moon-journey-back" to="/levels">VOLVER A MAPAS</NavigationButton>
    </main>
  );
}
