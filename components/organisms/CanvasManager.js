/**
 * Canvas Manager Organism
 * UI for managing multiple canvases
 */
import { getAllCanvases, deleteCanvas, renameCanvas } from '../../utils/indexedDB.js';

export function createCanvasManager(callbacks) {
    const { onLoad, onClose, onCreate } = callbacks;
    
    // Create overlay backdrop
    const overlay = document.createElement('div');
    overlay.className = 'canvas-manager-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'canvas-manager-modal';
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 24px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const title = document.createElement('h2');
    title.textContent = 'My Canvases';
    title.style.cssText = `
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #1e293b;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.className = 'canvas-manager-close';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 32px;
        color: #64748b;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = '#f1f5f9';
    closeBtn.onmouseout = () => closeBtn.style.background = 'none';
    closeBtn.onclick = onClose;
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Create new canvas button
    const newCanvasBtn = document.createElement('button');
    newCanvasBtn.textContent = '+ New Canvas';
    newCanvasBtn.className = 'new-canvas-btn';
    newCanvasBtn.style.cssText = `
        margin: 16px 24px;
        padding: 12px 24px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
    `;
    newCanvasBtn.onmouseover = () => newCanvasBtn.style.background = '#2563eb';
    newCanvasBtn.onmouseout = () => newCanvasBtn.style.background = '#3b82f6';
    newCanvasBtn.onclick = async () => {
        const name = prompt('Canvas name:', 'Untitled Canvas');
        if (name) {
            await onCreate(name);
            onClose();
        }
    };
    
    // Create canvas list container
    const listContainer = document.createElement('div');
    listContainer.className = 'canvas-list';
    listContainer.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 0 24px 24px 24px;
    `;
    
    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(newCanvasBtn);
    modal.appendChild(listContainer);
    overlay.appendChild(modal);
    
    // Prevent clicks on modal from closing
    modal.onclick = (e) => e.stopPropagation();
    
    // Close on overlay click
    overlay.onclick = onClose;
    
    // Render canvas list
    async function renderList() {
        const canvases = await getAllCanvases();
        
        // Sort by last modified (newest first)
        canvases.sort((a, b) => b.lastModified - a.lastModified);
        
        listContainer.innerHTML = '';
        
        if (canvases.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = `
                text-align: center;
                padding: 48px 24px;
                color: #94a3b8;
            `;
            empty.textContent = 'No canvases yet. Create one to get started.';
            listContainer.appendChild(empty);
            return;
        }
        
        canvases.forEach(canvas => {
            const item = createCanvasItem(canvas);
            listContainer.appendChild(item);
        });
    }
    
    function createCanvasItem(canvas) {
        const item = document.createElement('div');
        item.className = 'canvas-item';
        item.style.cssText = `
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            transition: border-color 0.2s;
        `;
        item.onmouseover = () => item.style.borderColor = '#cbd5e1';
        item.onmouseout = () => item.style.borderColor = '#e2e8f0';
        
        const topRow = document.createElement('div');
        topRow.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        `;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = canvas.name;
        nameSpan.style.cssText = `
            font-size: 16px;
            font-weight: 500;
            color: #1e293b;
        `;
        
        const dateSpan = document.createElement('span');
        dateSpan.textContent = formatDate(canvas.lastModified);
        dateSpan.style.cssText = `
            font-size: 13px;
            color: #64748b;
        `;
        
        topRow.appendChild(nameSpan);
        topRow.appendChild(dateSpan);
        
        const actions = document.createElement('div');
        actions.style.cssText = `
            display: flex;
            gap: 8px;
        `;
        
        const loadBtn = createActionButton('Load', '#3b82f6', async () => {
            await onLoad(canvas.id);
            onClose();
        });
        
        const renameBtn = createActionButton('Rename', '#64748b', async () => {
            const newName = prompt('New name:', canvas.name);
            if (newName && newName !== canvas.name) {
                await renameCanvas(canvas.id, newName);
                await renderList();
            }
        });
        
        const deleteBtn = createActionButton('Delete', '#ef4444', async () => {
            if (confirm(`Delete "${canvas.name}"? This cannot be undone.`)) {
                await deleteCanvas(canvas.id);
                await renderList();
            }
        });
        
        actions.appendChild(loadBtn);
        actions.appendChild(renameBtn);
        actions.appendChild(deleteBtn);
        
        item.appendChild(topRow);
        item.appendChild(actions);
        
        return item;
    }
    
    function createActionButton(text, color, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 6px 12px;
            background: white;
            color: ${color};
            border: 1px solid ${color};
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        `;
        btn.onmouseover = () => {
            btn.style.background = color;
            btn.style.color = 'white';
        };
        btn.onmouseout = () => {
            btn.style.background = 'white';
            btn.style.color = color;
        };
        btn.onclick = onClick;
        return btn;
    }
    
    function formatDate(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        
        return new Date(timestamp).toLocaleDateString();
    }
    
    // Initialize
    renderList();
    
    return overlay;
}
