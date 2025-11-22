/**
 * Button Atom
 */
export function createButton({ text, onClick, className = '' }) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `btn ${className}`;
    if (onClick) button.addEventListener('click', onClick);
    return button;
}
