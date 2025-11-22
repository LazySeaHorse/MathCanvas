/**
 * Action Button Molecule
 */
import { createIconElement } from '../../utils/icons.js';

export function createActionButton({ icon, iconName, label, onClick, iconOnly = false }) {
    const button = document.createElement('button');
    button.className = iconOnly ? 'header-icon-btn' : 'action-btn';
    
    if (iconOnly) {
        button.title = label;
        if (iconName) {
            button.appendChild(createIconElement(iconName, 20));
        }
    } else {
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
    }
    
    if (onClick) button.addEventListener('click', onClick);
    return button;
}
