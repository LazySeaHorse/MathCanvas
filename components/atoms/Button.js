/**
 * Button Atom
 */
export function createButton({ text, onClick, className = '' }) {
    const button = document.createElement('button');
    button.textContent = text;
    // .btn { padding: 8px 16px; radius: 6px; text-sm; font-medium; transition; cursor; border-none; outline-none }
    // hover: opacity-90; active: scale-98
    button.className = `px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer border-none outline-none hover:opacity-90 active:scale-95 ${className}`;
    if (onClick) button.addEventListener('click', onClick);
    return button;
}
