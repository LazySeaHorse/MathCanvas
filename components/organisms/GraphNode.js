/**
 * Graph Node Organism
 */
export function createGraphNode(data, onSelect) {
    const div = document.createElement('div');
    div.id = data.id;
    div.className = 'node node-graph';
    div.style.left = `${data.x}px`;
    div.style.top = `${data.y}px`;
    div.style.zIndex = data.zIndex;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'graph-input-wrapper';
    
    const label = document.createElement('span');
    label.className = 'graph-label';
    label.innerHTML = "f(x)=";
    
    const mf = document.createElement('math-field');
    mf.style.flex = "1";
    mf.style.fontSize = "1rem";
    mf.value = data.content;
    mf.virtualKeyboardMode = "manual";
    
    const graphId = `g-${data.id}`;
    const graphDiv = document.createElement('div');
    graphDiv.id = graphId;
    graphDiv.className = 'graph-target';

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

            functionPlot({
                target: `#${graphId}`,
                width: 316, 
                height: 220,
                grid: true,
                tip: { xLine: true, yLine: true },
                data: [{ fn: fn, color: '#3b82f6' }]
            });
        } catch(e) {}
    };

    mf.addEventListener('input', () => {
        data.content = mf.value;
        updateGraph(mf.value);
    });

    mf.addEventListener('mousedown', e => e.stopPropagation());
    graphDiv.addEventListener('mousedown', e => e.stopPropagation());

    wrapper.appendChild(label);
    wrapper.appendChild(mf);
    div.appendChild(wrapper);
    div.appendChild(graphDiv);

    setTimeout(() => updateGraph(data.content), 100);
    
    return div;
}
