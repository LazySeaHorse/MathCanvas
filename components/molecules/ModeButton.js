/**
 * Mode Button Molecule
 */
import { createIconElement } from '../../utils/icons.js';

export function createModeButton({ id, icon, iconName, label, onClick, isActive = false }) {
    const button = document.createElement('button');
    button.id = id;
    button.className = `mode-btn ${isActive ? 'active' : ''}`;
    
    if (iconName) {
        button.appendChild(createIconElement(iconName, 18));
    } else if (icon) {
        const iconSpan = document.createElement('span');
        iconSpan.textContent = icon;
        button.appendChild(iconSpan);
    }
    
    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    button.appendChild(labelSpan);
    
    if (onClick) button.addEventListener('click', onClick);
    return button;
}
