// Global type declarations

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

export interface PreviewItem {
    original: string
    newName: string
    targetPath: string
}

export interface ElectronAPI {
    selectFolder: (type: 'source' | 'target') => Promise<string | null>
    getStoredPaths: () => Promise<{ sourcePath: string; targetPath: string }>
    getRules: () => Promise<Rules>
    saveRules: (rules: Rules) => Promise<boolean>
    getFiles: () => Promise<FileInfo[]>
    executeRename: (files: { original: string; newName: string }[]) => Promise<RenameResult[]>
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}
