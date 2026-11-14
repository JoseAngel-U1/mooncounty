import './StartScreen.css';

type StartScreenProps = {
  onStart: () => void;
};

// Distribución determinista: las estrellas no cambian al renderizar de nuevo.
const stars = Array.from({ length: 64 }, (_, index) => ({
  left: `${(index * 37 + 7) % 100}%`,
  top: `${(index * 23 + 3) % 89}%`,
}));

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="start-screen" aria-labelledby="start-title">
      <div className="start-stars" aria-hidden="true">
        {stars.map((position, index) => (
          <span className="start-star" key={index} style={position} />
        ))}
      </div>

      <header className="start-heading">
        <p className="start-eyebrow">UNA AVENTURA ESPACIAL</p>
        <h1 id="start-title">MoonCounty</h1>
        <p className="start-tagline">Un pequeño paso. Tu próxima misión.</p>
      </header>

      <div className="start-action">
        <button className="start-button" type="button" onClick={onStart}>
          INICIAR
        </button>
        <p className="start-controls">WASD / FLECHAS PARA MOVERTE</p>
      </div>

      <div className="start-landscape" aria-hidden="true">
        <div className="start-moon" />
        <svg className="start-pixel-scene" viewBox="0 0 800 260" preserveAspectRatio="xMidYMax meet" shapeRendering="crispEdges">
          {/* Módulo lunar: silueta escalonada, paneles y patas. */}
          <g transform="translate(100 80)">
            <path fill="#667391" d="M20 104h12v32H20v12H0v-8h12v-24h8zm104 0h12v12h8v24h12v8h-24v-12h-8z" />
            <path fill="#e0aa60" d="M24 64h104v44H24z" />
            <path fill="#ad7446" d="M24 92h104v16H24zM36 64h8v28h-8zm72 0h8v28h-8z" />
            <path fill="#c9d5df" d="M40 24h16V12h40v12h16v40H40z" />
            <path fill="#91a6b9" d="M96 24h16v40H96zM40 56h56v8H40z" />
            <path fill="#253b61" d="M52 28h20v20H52zm32 0h16v20H84z" />
            <path fill="#88dfd9" d="M56 32h12v4H56zm32 0h8v4h-8z" />
            <path fill="#e9e5cd" d="M72-12h4v24h-4zM60-16h28v4H60z" />
            <path fill="#3d4866" d="M62 76h28v32H62z" />
            <path fill="#adb9ca" d="M64 108h4v40h-4zm20 0h4v40h-4zM68 116h16v4H68zm0 12h16v4H68zm0 12h16v4H68z" />
          </g>

          {/* Astronauta decorativo de la portada. */}
          <g transform="translate(372 128)">
            <path fill="#7c8fa9" d="M0 36h16v48H0z" />
            <path fill="#edf1df" d="M20 0h32v8h8v32h-8v8H20v-8h-8V8h8zM16 48h40v40H16zM8 52h8v32H8zm48 0h8v32h-8zM16 88h16v20H16zm24 0h16v20H40z" />
            <path fill="#273c5b" d="M20 12h32v24H20z" />
            <path fill="#e4ae64" d="M24 16h24v16H24z" />
            <path fill="#fff0b0" d="M24 16h16v4H24z" />
            <path fill="#b0bed0" d="M16 80h40v8H16zM12 104h20v8H12zm28 0h20v8H40z" />
            <path fill="#667b98" d="M28 56h16v16H28z" />
            <path fill="#90dfce" d="M32 60h8v4h-8z" />
          </g>

          {/* Cohete en tierra, sin animaciones ni efectos de despegue. */}
          <g transform="translate(602 20)">
            <path fill="#d38c73" d="M40 0h8v8h8v12h8v16H24V20h8V8h8z" />
            <path fill="#e4e9e0" d="M24 36h40v140H24z" />
            <path fill="#a4b5c9" d="M56 36h8v140h-8z" />
            <path fill="#7086a4" d="M32 52h24v32H32z" />
            <path fill="#253c60" d="M36 56h16v24H36z" />
            <path fill="#a3e2de" d="M36 56h12v8H36z" />
            <path fill="#d38c73" d="M24 116h40v12H24zM16 136h8v56H0v-24h8v-16h8zm48 0h8v16h8v16h8v24H64z" />
            <path fill="#61718b" d="M28 176h32v12H28zM24 188h12v12H24zm28 0h12v12H52z" />
          </g>
          <path fill="#6c7598" d="M66 242h44v4H66zm188-10h32v4h-32zm202 18h52v4h-52zm254-12h36v4h-36z" />
        </svg>
      </div>
    </main>
  );
}
