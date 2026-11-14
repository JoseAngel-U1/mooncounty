import { useEffect, useRef } from 'react';
import NavigationButton from '../../components/shared/NavigationButton/NavigationButton';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="not-found-page" aria-labelledby="not-found-title">
      <div>
        <p className="not-found-code">MOONCOUNTY · 404</p>
        <h1 id="not-found-title" ref={headingRef} tabIndex={-1}>Destino no encontrado</h1>
        <p>La página o el nivel que buscas no existe.</p>
        <NavigationButton to="/levels">VOLVER A MAPAS</NavigationButton>
      </div>
    </main>
  );
}
