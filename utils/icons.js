/**
 * Icon utility - loads SVG icons
 */

const iconCache = {};

export async function loadIcon(name) {
    if (iconCache[name]) {
        return iconCache[name];
    }
    
    try {
        const response = await fetch(`./assets/icons/${name}.svg`);
        const svg = await response.text();
        iconCache[name] = svg;
        return svg;
    } catch (error) {
        console.error(`Failed to load icon: ${name}`, error);
        return '';
    }
}

export function createIconElement(name, size = 20) {
    const wrapper = document.createElement('span');
    wrapper.className = 'icon-wrapper';
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.width = `${size}px`;
    wrapper.style.height = `${size}px`;
    
    loadIcon(name).then(svg => {
        wrapper.innerHTML = svg;
        const svgEl = wrapper.querySelector('svg');
        if (svgEl) {
            svgEl.setAttribute('width', size);
            svgEl.setAttribute('height', size);
        }
    });
    
    return wrapper;
}
