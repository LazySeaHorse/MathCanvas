/**
 * Registry of all available tools/nodes in the application.
 * Defines metadata for each tool including label, icon, and type.
 */

export const TOOLS = {
    math: {
        id: 'math',
        label: 'Math',
        icon: 'function',
        type: 'mode',
        description: 'Add mathematical equations'
    },
    text: {
        id: 'text',
        label: 'Text',
        icon: 'type',
        type: 'mode',
        description: 'Add properties markdown text'
    },
    graph: {
        id: 'graph',
        label: 'Graph',
        icon: 'chart',
        type: 'mode',
        description: 'Add 2D function graphs'
    },
    table: {
        id: 'table',
        label: 'Table',
        icon: 'table',
        type: 'mode',
        description: 'Add data tables'
    },
    image: {
        id: 'image',
        label: 'Image',
        icon: 'image',
        type: 'action',
        description: 'Upload an image'
    },
    video: {
        id: 'video',
        label: 'Video',
        icon: 'video',
        type: 'action',
        description: 'Embed a video'
    }
};

export const DEFAULT_TOOL_CONFIG = {
    toolbar: ['math', 'text', 'graph', 'table', 'image', 'video'],
    more: []
};
