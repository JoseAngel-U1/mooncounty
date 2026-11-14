import { useState } from 'react';
import PhaserGame from './components/PhaserGame';
import StartScreen from './components/StartScreen';
import LevelSelectScreen from './components/LevelSelectScreen';
import type { AvailableLevel } from './levels/levels';

type NavigationState =
  | { screen: 'start' }
  | { screen: 'levels' }
  | { screen: 'game'; level: AvailableLevel };

export default function App() {
  const [navigation, setNavigation] = useState<NavigationState>({ screen: 'start' });

  if (navigation.screen === 'start') {
    return <StartScreen onStart={() => setNavigation({ screen: 'levels' })} />;
  }

  if (navigation.screen === 'levels') {
    return (
      <LevelSelectScreen
        onBack={() => setNavigation({ screen: 'start' })}
        onSelect={(level) => setNavigation({ screen: 'game', level })}
      />
    );
  }

  return (
    <main className="game-view">
      <PhaserGame key={navigation.level.id} sceneKey={navigation.level.sceneKey} />
      <button className="navigation-button game-back" type="button" onClick={() => setNavigation({ screen: 'levels' })}>
        VOLVER A MAPAS
      </button>
    </main>
  );
}
