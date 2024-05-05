export interface ButtonProps {
  readonly primary?: boolean;
  readonly backgroundColor?: string;
  readonly size?: 'small' | 'medium' | 'large';
  readonly label: string;
  readonly onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const createButton = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  onClick,
}: ButtonProps) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = label;
  if (onClick) {
    btn.addEventListener('click', onClick);
  }

  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  btn.className = ['storybook-button', `storybook-button--${size}`, 'bg-orange-500', mode].join(' ');

  if (backgroundColor) {
    btn.style.backgroundColor = backgroundColor;
  }

  return btn;
};
