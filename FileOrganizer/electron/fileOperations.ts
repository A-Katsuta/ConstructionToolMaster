import fs from 'fs-extra'
import path from 'path'

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

/**
 * 指定ディレクトリ内のファイル一覧を取得
 */
export async function getFilesInDirectory(dirPath: string): Promise<FileInfo[]> {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true })
        const files: FileInfo[] = []

        for (const entry of entries) {
            if (entry.isFile()) {
                const fullPath = path.join(dirPath, entry.name)
                const stats = await fs.stat(fullPath)
                files.push({
                    name: entry.name,
                    path: fullPath,
                    createdAt: stats.birthtime,
                    modifiedAt: stats.mtime,
                    size: stats.size,
                    isDirectory: false
                })
            }
        }

        return files.sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    } catch (error) {
        console.error('Failed to read directory:', error)
        return []
    }
}

/**
 * ファイルをリネームして移動先へ移動
 * 重複時は上書きする
 */
export async function executeRenameAndMove(
    sourcePath: string,
    targetPath: string,
    files: { original: string; newName: string }[]
): Promise<RenameResult[]> {
    const results: RenameResult[] = []

    // ターゲットフォルダが存在しない場合は作成
    await fs.ensureDir(targetPath)

    for (const file of files) {
        const sourceFile = path.join(sourcePath, file.original)
        const targetFile = path.join(targetPath, file.newName)

        try {
            // ファイルが存在するか確認
            const exists = await fs.pathExists(sourceFile)
            if (!exists) {
                results.push({
                    originalName: file.original,
                    newName: file.newName,
                    success: false,
                    error: 'ファイルが見つかりません'
                })
                continue
            }

            // 移動（上書き有効）
            await fs.move(sourceFile, targetFile, { overwrite: true })

            results.push({
                originalName: file.original,
                newName: file.newName,
                success: true
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '不明なエラー'

            // 使用中のファイルの場合
            if (errorMessage.includes('EBUSY') || errorMessage.includes('EPERM')) {
                results.push({
                    originalName: file.original,
                    newName: file.newName,
                    success: false,
                    error: 'ファイルが使用中です。閉じてから再試行してください。'
                })
            } else {
                results.push({
                    originalName: file.original,
                    newName: file.newName,
                    success: false,
                    error: errorMessage
                })
            }
        }
    }

    return results
}
