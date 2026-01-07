import { contextBridge, ipcRenderer } from 'electron'

export interface FileInfo {
    name: string
    path: string
    createdAt: Date
    modifiedAt: Date
    size: number
    isDirectory: boolean
}

export interface RenameResult {
    originalName: string
    newName: string
    success: boolean
    error?: string
}

export interface Rules {
    useDate: boolean
    useSequence: boolean
    useCustomText: boolean
    dateType: 'execution' | 'creation'
    sequenceDigits: number
    customText: string
    separator: string
    order: string[]
}

export interface ElectronAPI {
    selectFolder: (type: 'source' | 'target') => Promise<string | null>
    getStoredPaths: () => Promise<{ sourcePath: string; targetPath: string }>
    getRules: () => Promise<Rules>
    saveRules: (rules: Rules) => Promise<boolean>
    getFiles: () => Promise<FileInfo[]>
    executeRename: (files: { original: string; newName: string }[]) => Promise<RenameResult[]>
}

contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: (type: 'source' | 'target') => ipcRenderer.invoke('select-folder', type),
    getStoredPaths: () => ipcRenderer.invoke('get-stored-paths'),
    getRules: () => ipcRenderer.invoke('get-rules'),
    saveRules: (rules: Rules) => ipcRenderer.invoke('save-rules', rules),
    getFiles: () => ipcRenderer.invoke('get-files'),
    executeRename: (files: { original: string; newName: string }[]) => ipcRenderer.invoke('execute-rename', files)
} as ElectronAPI)
