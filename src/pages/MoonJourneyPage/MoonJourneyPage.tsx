import { useEffect, useRef } from 'react';
import NavigationButton from '../../components/shared/NavigationButton/NavigationButton';
import './MoonJourneyPage.css';

export default function MoonJourneyPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="moon-journey-page" aria-labelledby="moon-journey-title">
      <div className="moon-journey-content">
        <NavigationButton to="/levels">VOLVER A MAPAS</NavigationButton>
        <section className="moon-journey-panel">
          <p className="moon-journey-kicker">MOONCOUNTY · NIVEL 2</p>
          <h1 id="moon-journey-title" ref={headingRef} tabIndex={-1}>Viaje a la Luna</h1>
          <p className="moon-journey-description">
            Plantilla base lista para implementar el trayecto hacia la Luna y el enfrentamiento contra los AVE.
          </p>
        </section>
      </div>
    </main>
  );
}
