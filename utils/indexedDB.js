/**
 * IndexedDB Storage for Multiple Canvases
 */

const DB_NAME = 'MathCanvasDB';
const DB_VERSION = 1;
const CANVAS_STORE = 'canvases';
const CANVAS_DATA_STORE = 'canvasData';

let db = null;

/**
 * Initialize IndexedDB
 */
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            // Create canvases store (metadata)
            if (!database.objectStoreNames.contains(CANVAS_STORE)) {
                database.createObjectStore(CANVAS_STORE, { keyPath: 'id' });
            }
            
            // Create canvasData store (actual canvas state)
            if (!database.objectStoreNames.contains(CANVAS_DATA_STORE)) {
                database.createObjectStore(CANVAS_DATA_STORE, { keyPath: 'canvasId' });
            }
        };
    });
}

/**
 * Get all canvas metadata
 */
export function getAllCanvases() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([CANVAS_STORE], 'readonly');
        const store = transaction.objectStore(CANVAS_STORE);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get canvas data by ID
 */
export function getCanvasData(canvasId) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([CANVAS_DATA_STORE], 'readonly');
        const store = transaction.objectStore(CANVAS_DATA_STORE);
        const request = store.get(canvasId);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Save canvas data
 */
export function saveCanvasData(canvasId, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([CANVAS_DATA_STORE, CANVAS_STORE], 'readwrite');
        
        // Save canvas data
        const dataStore = transaction.objectStore(CANVAS_DATA_STORE);
        const canvasData = {
            canvasId,
            pan: data.pan,
            scale: data.scale,
            fields: data.fields,
            zIndexCounter: data.zIndexCounter
        };
        dataStore.put(canvasData);
        
        // Update lastModified timestamp
        const metaStore = transaction.objectStore(CANVAS_STORE);
        const metaRequest = metaStore.get(canvasId);
        
        metaRequest.onsuccess = () => {
            const canvas = metaRequest.result;
            if (canvas) {
                canvas.lastModified = Date.now();
                metaStore.put(canvas);
            }
        };
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

/**
 * Create new canvas
 */
export function createCanvas(name) {
    return new Promise((resolve, reject) => {
        const id = `canvas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();
        
        const transaction = db.transaction([CANVAS_STORE, CANVAS_DATA_STORE], 'readwrite');
        
        // Create canvas metadata
        const metaStore = transaction.objectStore(CANVAS_STORE);
        const canvas = {
            id,
            name,
            createdAt: now,
            lastModified: now
        };
        metaStore.add(canvas);
        
        // Create empty canvas data
        const dataStore = transaction.objectStore(CANVAS_DATA_STORE);
        const canvasData = {
            canvasId: id,
            pan: { x: 0, y: 0 },
            scale: 1,
            fields: [],
            zIndexCounter: 1
        };
        dataStore.add(canvasData);
        
        transaction.oncomplete = () => resolve(id);
        transaction.onerror = () => reject(transaction.error);
    });
}

/**
 * Delete canvas
 */
export function deleteCanvas(canvasId) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([CANVAS_STORE, CANVAS_DATA_STORE], 'readwrite');
        
        const metaStore = transaction.objectStore(CANVAS_STORE);
        metaStore.delete(canvasId);
        
        const dataStore = transaction.objectStore(CANVAS_DATA_STORE);
        dataStore.delete(canvasId);
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

/**
 * Rename canvas
 */
export function renameCanvas(canvasId, newName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([CANVAS_STORE], 'readwrite');
        const store = transaction.objectStore(CANVAS_STORE);
        const request = store.get(canvasId);
        
        request.onsuccess = () => {
            const canvas = request.result;
            if (canvas) {
                canvas.name = newName;
                canvas.lastModified = Date.now();
                store.put(canvas);
            }
        };
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

/**
 * Export all canvases and their data
 */
export async function exportAllCanvases() {
    const canvases = await getAllCanvases();
    const allData = [];
    
    for (const canvas of canvases) {
        const data = await getCanvasData(canvas.id);
        allData.push({
            metadata: canvas,
            data: data
        });
    }
    
    return {
        version: 1,
        exportedAt: Date.now(),
        canvasCount: allData.length,
        canvases: allData
    };
}

/**
 * Import all canvases with conflict resolution
 * @param {Object} importData - The exported data
 * @param {string} conflictStrategy - 'replace', 'rename', or 'abort'
 * @returns {Promise<{imported: number, skipped: number, conflicts: Array}>}
 */
export async function importAllCanvases(importData, conflictStrategy = 'abort') {
    if (!importData.version || importData.version !== 1) {
        throw new Error('Unsupported export format');
    }
    
    const existingCanvases = await getAllCanvases();
    const existingIds = new Set(existingCanvases.map(c => c.id));
    const conflicts = [];
    let imported = 0;
    let skipped = 0;
    
    for (const item of importData.canvases) {
        const { metadata, data } = item;
        let canvasId = metadata.id;
        let canvasName = metadata.name;
        
        // Check for conflicts
        if (existingIds.has(canvasId)) {
            conflicts.push({ id: canvasId, name: canvasName });
            
            if (conflictStrategy === 'abort') {
                continue; // Will be handled by caller
            } else if (conflictStrategy === 'rename') {
                // Generate new ID and name
                canvasId = `canvas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                canvasName = `${canvasName} (imported)`;
            } else if (conflictStrategy === 'replace') {
                // Delete existing canvas
                await deleteCanvas(canvasId);
            }
        }
        
        // Import canvas
        const transaction = db.transaction([CANVAS_STORE, CANVAS_DATA_STORE], 'readwrite');
        
        const metaStore = transaction.objectStore(CANVAS_STORE);
        const newMetadata = {
            id: canvasId,
            name: canvasName,
            createdAt: metadata.createdAt,
            lastModified: Date.now()
        };
        metaStore.put(newMetadata);
        
        const dataStore = transaction.objectStore(CANVAS_DATA_STORE);
        const newData = {
            canvasId: canvasId,
            pan: data.pan,
            scale: data.scale,
            fields: data.fields,
            zIndexCounter: data.zIndexCounter
        };
        dataStore.put(newData);
        
        await new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
        
        imported++;
    }
    
    return { imported, skipped, conflicts };
}
