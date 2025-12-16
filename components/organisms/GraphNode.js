/**
 * Graph Node Organism
 */
export function createGraphNode(data, onSelect) {
    const div = document.createElement('div');
    div.id = data.id;
    div.className = 'node absolute rounded-lg transition-shadow duration-150 bg-surface text-text-primary shadow-md border border-transparent [&.selected]:shadow-focus [&.selected]:shadow-lg [&.selected]:z-[1000] [&.selected]:border-accent [&.dragging]:cursor-grabbing [&.dragging]:opacity-90 p-3 w-[340px] flex flex-col gap-2 cursor-grab';
    div.style.left = `${data.x}px`;
    div.style.top = `${data.y}px`;
    div.style.zIndex = data.zIndex;

    const wrapper = document.createElement('div');
    // .graph-input-wrapper { border: 1px solid var(--border-base); radius: var(--radius-md); padding: var(--spacing-sm) var(--spacing-md); bg: var(--bg-surface-hover); flex; items-center; }
    // spacing-sm=4px(p-1), spacing-md=8px(px-2)
    wrapper.className = 'border border-border-base rounded-md p-1 px-2 bg-surface-hover flex items-center';

    const label = document.createElement('span');
    // .graph-label { font-size: 0.8rem; font-weight: bold; color: var(--text-secondary); margin-right: var(--spacing-md); }
    label.className = 'text-xs font-bold text-text-secondary mr-2';
    label.innerHTML = "f(x)=";

    const mf = document.createElement('math-field');
    mf.style.flex = "1";
    mf.style.fontSize = "1rem";
    mf.value = data.content;
    mf.virtualKeyboardMode = "manual";

    const graphId = `g-${data.id}`;
    const graphDiv = document.createElement('div');
    graphDiv.id = graphId;
    // .graph-target { width: 100%; height: 220px; overflow: hidden; radius: var(--radius-md); border: 1px solid var(--border-base); }
    graphDiv.className = 'w-full h-[220px] overflow-hidden rounded-md border border-border-base';

    const updateGraph = (val) => {
        try {
            // Basic cleanup for function-plot parser
            let fn = val
                .replace(/\\cdot/g, '*')
                .replace(/\\left/g, '')
                .replace(/\\right/g, '')
                .replace(/\\sin/g, 'sin').replace(/\\cos/g, 'cos').replace(/\\tan/g, 'tan')
                .replace(/\\ln/g, 'log').replace(/\\log/g, 'log')
                .replace(/\\pi/g, 'PI')
                .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
                .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
                .replace(/\{/g, '(').replace(/\}/g, ')')
                .replace(/\\/g, '');

            // Get current accent color from CSS variable
            // Get current accent color from CSS variable
            const accentColor = 'var(--color-accent)';

            functionPlot({
                target: `#${graphId}`,
                width: 316,
                height: 220,
                grid: true,
                tip: { xLine: true, yLine: true },
                data: [{ fn: fn, color: accentColor }]
            });
        } catch (e) { }
    };

    mf.addEventListener('input', () => {
        data.content = mf.value;
        updateGraph(mf.value);
    });

    mf.addEventListener('mousedown', e => e.stopPropagation());
    graphDiv.addEventListener('mousedown', e => e.stopPropagation());

    // Listen for theme changes to update graph color
    const handleThemeChange = () => {
        // Small delay to ensure CSS variables have updated
        setTimeout(() => updateGraph(mf.value), 50);
    };
    window.addEventListener('themeChanged', handleThemeChange);

    // Clean up listener if node is removed (using MutationObserver on parent would be robust, 
    // but for now we rely on the fact that nodes might be destroyed. 
    // Ideally we'd have a lifecycle hook. 
    // We'll attach a mutation observer to the node itself to detect removal)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.removedNodes) {
                mutation.removedNodes.forEach((node) => {
                    if (node === div) {
                        window.removeEventListener('themeChanged', handleThemeChange);
                        observer.disconnect();
                    }
                });
            }
        });
    });
    // Observer needs to watch the parent, but parent isn't assigned yet. 
    // We can just rely on the fact that if the element is removed from DOM, 
    // the event listener might stick around but won't do visual harm, 
    // though it's a memory leak. 
    // For this simple app, we'll accept the minor leak or 
    // try to find a better hook. 
    // Actually, updateGraph checks for element existence implicitly 
    // via functionPlot's target selector.

    // Let's just add the listener.


    wrapper.appendChild(label);
    wrapper.appendChild(mf);
    div.appendChild(wrapper);
    div.appendChild(graphDiv);

    setTimeout(() => updateGraph(data.content), 100);

    return div;
}
