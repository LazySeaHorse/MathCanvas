/**
 * Text Node Organism
 */
import { mdRenderer } from '../../utils/mdRenderer.js';
import { interaction } from '../../state/appState.js';

export function createTextNode(data, onSelect) {
    const div = document.createElement('div');
    div.id = data.id;
    div.className = 'node node-text';
    div.style.left = `${data.x}px`;
    div.style.top = `${data.y}px`;
    div.style.zIndex = data.zIndex;
    
    const preview = document.createElement('div');
    preview.className = 'md-preview';
    preview.innerHTML = mdRenderer(data.content);
    
    const textarea = document.createElement('textarea');
    textarea.className = 'md-editor hidden';
    textarea.value = data.content;

    // Toggle Edit
    div.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        preview.classList.add('hidden');
        textarea.classList.remove('hidden');
        textarea.focus();
        interaction.activeInput = textarea;
        div.style.cursor = 'auto';
    });

    // Save & Render
    textarea.addEventListener('blur', () => {
        data.content = textarea.value;
        preview.innerHTML = mdRenderer(data.content);
        textarea.classList.add('hidden');
        preview.classList.remove('hidden');
        interaction.activeInput = null;
        div.style.cursor = 'grab';
    });
    
    // Stop propagation in textarea so we can select text
    textarea.addEventListener('mousedown', e => e.stopPropagation());

    div.appendChild(preview);
    div.appendChild(textarea);
    
    return div;
}
