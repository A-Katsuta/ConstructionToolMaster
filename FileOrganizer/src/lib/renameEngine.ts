import { FileInfo, Rules } from '@/types'

/**
 * ルールに基づいてファイル名を生成
 */
export function generateNewFileName(
    file: FileInfo,
    rules: Rules,
    index: number,
    executionDate: Date
): string {
    const activeElements = rules.order.filter(id => {
        if (id === 'date') return rules.useDate
        if (id === 'sequence') return rules.useSequence
        if (id === 'customText') return rules.useCustomText
        return false
    })

    if (activeElements.length === 0) {
        // ルールが何も選択されていない場合は元の名前を返す
        return file.name
    }

    const parts: string[] = []

    for (const element of activeElements) {
        if (element === 'date') {
            const date = rules.dateType === 'execution'
                ? executionDate
                : new Date(file.createdAt)
            parts.push(formatDate(date))
        } else if (element === 'sequence') {
            parts.push(String(index + 1).padStart(rules.sequenceDigits, '0'))
        } else if (element === 'customText') {
            if (rules.customText.trim()) {
                parts.push(rules.customText.trim())
            }
        }
    }

    // 元のファイルの拡張子を取得
    const ext = getFileExtension(file.name)

    // 新しいファイル名を生成
    const baseName = parts.join(rules.separator)

    return ext ? `${baseName}.${ext}` : baseName
}

/**
 * 日付をYYYYMMDD形式にフォーマット
 */
function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
}

/**
 * ファイル名から拡張子を取得
 */
function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.')
    if (lastDot === -1 || lastDot === 0) {
        return ''
    }
    return filename.slice(lastDot + 1)
}

/**
 * ファイル名から拡張子を除いた部分を取得
 */
export function getFileNameWithoutExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.')
    if (lastDot === -1 || lastDot === 0) {
        return filename
    }
    return filename.slice(0, lastDot)
}

/**
 * ファイルサイズを人間が読みやすい形式にフォーマット
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB']
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`
}
