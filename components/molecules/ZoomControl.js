/**
 * Zoom Control Molecule
 */
export function createZoomControl({ onZoomIn, onZoomOut, onZoomReset, onFullReset, initialZoom = 100 }) {
    const container = document.createElement('div');
    container.className = 'flex flex-col bg-surface shadow-lg rounded-lg border border-border-base z-30 overflow-hidden pointer-events-auto';

    const btnClass = 'p-3 bg-transparent border-none text-text-secondary cursor-pointer transition-colors duration-150 hover:bg-surface-hover active:bg-surface-active';

    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = `${btnClass} border-b border-border-base`;
    zoomInBtn.textContent = '+';
    zoomInBtn.addEventListener('click', onZoomIn);

    const indicator = document.createElement('button');
    indicator.id = 'zoom-indicator';
    indicator.className = 'p-2 text-xs font-bold text-text-secondary text-center cursor-pointer transition-colors duration-150 hover:bg-surface-hover bg-transparent border-none';
    indicator.textContent = `${initialZoom}%`;
    indicator.addEventListener('click', (e) => {
        if (e.detail === 1) {
            onZoomReset();
        } else if (e.detail === 2) {
            onFullReset();
        }
    });

    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = `${btnClass} border-t border-border-base`;
    zoomOutBtn.textContent = '-';
    zoomOutBtn.addEventListener('click', onZoomOut);

    container.appendChild(zoomInBtn);
    container.appendChild(indicator);
    container.appendChild(zoomOutBtn);

    return container;
}
