/**
 * Action Bar Organism
 */
import { createActionButton } from '../molecules/ActionButton.js';

export function createActionBar({ onUndo, onExport, onImport, onSave, iconOnly = false }) {
    const container = document.createElement('div');
    container.className = 'action-bar';

    // Undo button
    const undoBtn = createActionButton({
        iconName: 'undo',
        label: 'Undo',
        onClick: onUndo,
        iconOnly
    });

    // Export button with choice dialog
    const exportBtn = createActionButton({
        iconName: 'upload',
        label: 'Export',
        onClick: (e) => showExportDialog(onExport, e.currentTarget),
        iconOnly
    });

    // Import button (with file input and choice dialog)
    const importBtn = createActionButton({
        iconName: 'download',
        label: 'Import',
        onClick: async (e) => {
            const choice = await showImportDialog(e.currentTarget);
            if (choice) {
                importInput.dataset.importType = choice;
                importInput.click();
            }
        },
        iconOnly
    });

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.className = 'hidden';
    importInput.style.display = 'none';
    importInput.addEventListener('change', (e) => onImport(e.target));

    importBtn.appendChild(importInput);

    // Save button
    const saveBtn = createActionButton({
        iconName: 'save',
        label: 'Save',
        onClick: onSave,
        iconOnly
    });

    container.appendChild(undoBtn);
    container.appendChild(exportBtn);
    container.appendChild(importBtn);
    container.appendChild(saveBtn);

    return container;
}

/**
 * Ensure dropdown styles line injected
 */
function ensureDropdownStyles() {
    if (document.getElementById('action-bar-dropdown-styles')) return;

    const style = document.createElement('style');
    style.id = 'action-bar-dropdown-styles';
    style.textContent = `
        .dropdown-item {
            display: block;
            width: 100%;
            padding: 0.5rem 0.75rem;
            background: transparent;
            border: none;
            border-radius: var(--radius-md);
            text-align: left;
            font-size: 0.875rem;
            color: var(--color-slate-700);
            cursor: pointer;
            transition: background 0.15s ease;
        }
        .dropdown-item:hover {
            background: var(--color-slate-100);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Show export choice dropdown
 */
function showExportDialog(onExport, buttonElement) {
    ensureDropdownStyles();
    return new Promise((resolve) => {
        const dropdown = document.createElement('div');
        dropdown.className = 'export-import-dropdown';

        // Position below the button
        const rect = buttonElement.getBoundingClientRect();
        dropdown.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 8}px;
            left: ${rect.left}px;
            background: white;
            border: 1px solid var(--color-slate-200);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            min-width: 180px;
            padding: 0.5rem;
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
        `;

        dropdown.innerHTML = `
            <button class="dropdown-item" id="export-nodes">Selected Nodes</button>
            <button class="dropdown-item" id="export-single">Current Canvas</button>
            <button class="dropdown-item" id="export-all">All Canvases</button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(dropdown);

        const cleanup = () => {
            document.body.removeChild(dropdown);
            document.body.removeChild(overlay);
        };

        dropdown.querySelector('#export-nodes').onclick = () => {
            cleanup();
            onExport('nodes');
            resolve();
        };

        dropdown.querySelector('#export-single').onclick = () => {
            cleanup();
            onExport('single');
            resolve();
        };

        dropdown.querySelector('#export-all').onclick = () => {
            cleanup();
            onExport('all');
            resolve();
        };

        overlay.onclick = () => {
            cleanup();
            resolve();
        };
    });
}

/**
 * Show import choice dropdown
 */
function showImportDialog(buttonElement) {
    ensureDropdownStyles();
    return new Promise((resolve) => {
        const dropdown = document.createElement('div');
        dropdown.className = 'export-import-dropdown';

        // Position below the button
        const rect = buttonElement.getBoundingClientRect();
        dropdown.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 8}px;
            left: ${rect.left}px;
            background: white;
            border: 1px solid var(--color-slate-200);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            min-width: 180px;
            padding: 0.5rem;
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
        `;

        dropdown.innerHTML = `
            <button class="dropdown-item" id="import-nodes">Append Nodes</button>
            <button class="dropdown-item" id="import-single">Single Canvas</button>
            <button class="dropdown-item" id="import-all">All Canvases</button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(dropdown);

        const cleanup = () => {
            document.body.removeChild(dropdown);
            document.body.removeChild(overlay);
        };

        dropdown.querySelector('#import-nodes').onclick = () => {
            cleanup();
            resolve('nodes');
        };

        dropdown.querySelector('#import-single').onclick = () => {
            cleanup();
            resolve('single');
        };

        dropdown.querySelector('#import-all').onclick = () => {
            cleanup();
            resolve('all');
        };

        overlay.onclick = () => {
            cleanup();
            resolve(null);
        };
    });
}
