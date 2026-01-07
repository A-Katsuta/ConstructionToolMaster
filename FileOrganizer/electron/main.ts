import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import Store from 'electron-store'
import { getFilesInDirectory, executeRenameAndMove, FileInfo, RenameResult } from './fileOperations'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const store = new Store({
    defaults: {
        sourcePath: '',
        targetPath: '',
        rules: {
            useDate: true,
            useSequence: true,
            useCustomText: false,
            dateType: 'execution', // 'execution' | 'creation'
            sequenceDigits: 2,
            customText: '',
            separator: '_',
            order: ['date', 'customText', 'sequence']
        }
    }
})

let mainWindow: BrowserWindow | null = null

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        title: 'ファイル整理自動化パック',
        autoHideMenuBar: true
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// IPC Handlers

// フォルダ選択ダイアログ
ipcMain.handle('select-folder', async (_, type: 'source' | 'target') => {
    const result = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openDirectory'],
        title: type === 'source' ? '整理対象フォルダを選択' : '移動先フォルダを選択'
    })

    if (!result.canceled && result.filePaths.length > 0) {
        const folderPath = result.filePaths[0]
        store.set(type === 'source' ? 'sourcePath' : 'targetPath', folderPath)
        return folderPath
    }
    return null
})

// 保存されたパスを取得
ipcMain.handle('get-stored-paths', () => {
    return {
        sourcePath: store.get('sourcePath') as string,
        targetPath: store.get('targetPath') as string
    }
})

// ルール設定を取得
ipcMain.handle('get-rules', () => {
    return store.get('rules')
})

// ルール設定を保存
ipcMain.handle('save-rules', (_, rules) => {
    store.set('rules', rules)
    return true
})

// ソースフォルダ内のファイル一覧を取得
ipcMain.handle('get-files', async (): Promise<FileInfo[]> => {
    const sourcePath = store.get('sourcePath') as string
    if (!sourcePath) return []
    return getFilesInDirectory(sourcePath)
})

// リネーム＆移動を実行
ipcMain.handle('execute-rename', async (_, files: { original: string; newName: string }[]): Promise<RenameResult[]> => {
    const sourcePath = store.get('sourcePath') as string
    const targetPath = store.get('targetPath') as string

    if (!sourcePath || !targetPath) {
        return files.map(f => ({
            originalName: f.original,
            newName: f.newName,
            success: false,
            error: 'フォルダが設定されていません'
        }))
    }

    return executeRenameAndMove(sourcePath, targetPath, files)
})
