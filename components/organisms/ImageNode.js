/**
 * Image Node Organism
 */
export function createImageNode(data, onSelect) {
    const div = document.createElement('div');
    div.id = data.id;
    div.className = 'node p-2';
    div.style.left = `${data.x}px`;
    div.style.top = `${data.y}px`;
    div.style.zIndex = data.zIndex;
    
    const img = document.createElement('img');
    img.src = data.content; // The Base64 string
    img.className = 'rounded max-w-[300px] max-h-[300px] pointer-events-none';
    img.style.borderRadius = 'var(--radius-md)';
    img.style.maxWidth = '300px';
    img.style.maxHeight = '300px';
    img.style.pointerEvents = 'none';
    
    div.appendChild(img);
    
    return div;
}
