import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationButton.css';

type NavigationButtonProps = {
  to: string;
  children: ReactNode;
  className?: string;
};

export default function NavigationButton({ to, children, className = '' }: NavigationButtonProps) {
  const navigate = useNavigate();

  return (
    <button className={`navigation-button ${className}`} type="button" onClick={() => navigate(to)}>
      {children}
    </button>
  );
}
