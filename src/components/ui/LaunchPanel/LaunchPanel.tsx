import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  EARTH_LAUNCH_CODE_LENGTH,
  isEarthLaunchCode,
} from '../../../game/levels/earth/earthMissionConfig';
import { setEarthLaunchPanelListener } from '../../../game/levels/earth/earthLaunchPanelBridge';
import type { EarthLaunchPanelRequest } from '../../../game/levels/earth/earthLaunchPanelBridge';
import './LaunchPanel.css';

type LaunchPanelPhase = 'entry' | 'completed';

const NON_DIGITS = /\D+/g;

export default function LaunchPanel() {
  const [request, setRequest] = useState<EarthLaunchPanelRequest | null>(null);
  const [phase, setPhase] = useState<LaunchPanelPhase>('entry');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEarthLaunchPanelListener((next) => {
      setRequest(next);
      setPhase(next.completed ? 'completed' : 'entry');
      setCode('');
      setError(null);
    });

    return () => setEarthLaunchPanelListener(null);
  }, []);

  useEffect(() => {
    if (request && phase === 'entry') inputRef.current?.focus();
  }, [request, phase]);

  const closePanel = useCallback(() => {
    setRequest(null);
    request?.onClose();
  }, [request]);

  useEffect(() => {
    if (!request) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [request, closePanel]);

  if (!request) return null;

  const handleCodeChange = (value: string) => {
    setCode(value.replace(NON_DIGITS, '').slice(0, EARTH_LAUNCH_CODE_LENGTH));
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code.length !== EARTH_LAUNCH_CODE_LENGTH) {
      setError(`Introduce exactamente ${EARTH_LAUNCH_CODE_LENGTH} dígitos.`);
      return;
    }

    if (!isEarthLaunchCode(code)) {
      setError('Código incorrecto. Revisa el código del coordinador e inténtalo de nuevo.');
      return;
    }

    request.onCompleted();
    setPhase('completed');
    setCode('');
    setError(null);
  };

  return (
    <div className="launch-panel">
      <div
        className="launch-panel-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="launch-panel-title"
      >
        <button
          type="button"
          className="launch-panel-close"
          aria-label="Cerrar panel de lanzamiento"
          onClick={closePanel}
        >
          ×
        </button>

        {phase === 'entry' ? (
          <>
            <h2 id="launch-panel-title" className="launch-panel-title">Panel de lanzamiento</h2>
            <p className="launch-panel-text">
              Introduce el código de autorización que te entregó el coordinador.
            </p>
            <form className="launch-panel-form" onSubmit={handleSubmit} noValidate>
              <label className="launch-panel-label" htmlFor="launch-code">
                Código de {EARTH_LAUNCH_CODE_LENGTH} dígitos
              </label>
              <input
                ref={inputRef}
                id="launch-code"
                className="launch-panel-input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={code}
                onChange={(event) => handleCodeChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'launch-code-error' : undefined}
              />
              {error && (
                <p id="launch-code-error" className="launch-panel-error" role="alert">
                  {error}
                </p>
              )}
              <div className="launch-panel-actions">
                <button type="button" className="launch-panel-button launch-panel-button-secondary" onClick={closePanel}>
                  Cerrar
                </button>
                <button type="submit" className="launch-panel-button">
                  Autorizar lanzamiento
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 id="launch-panel-title" className="launch-panel-title">¡Misión Tierra completada!</h2>
            <p className="launch-panel-text">
              El código de autorización fue aceptado y la nave está lista para el despegue.
            </p>
            <p className="launch-panel-text launch-panel-text-muted">
              La segunda misión aún no está disponible en este prototipo.
            </p>
            <div className="launch-panel-actions">
              <button type="button" className="launch-panel-button" onClick={closePanel}>
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
