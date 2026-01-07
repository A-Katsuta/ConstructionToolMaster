import { useMemo } from 'react'
import { FileInfo, Rules, PreviewItem } from '@/types'
import { generateNewFileName } from '@/lib/renameEngine'

export function useRenamePreview(
    files: FileInfo[],
    rules: Rules,
    targetPath: string
): PreviewItem[] {
    return useMemo(() => {
        const executionDate = new Date()

        return files.map((file, index) => {
            const newName = generateNewFileName(file, rules, index, executionDate)

            return {
                original: file.name,
                newName,
                targetPath: targetPath ? `${targetPath}\\${newName}` : newName
            }
        })
    }, [files, rules, targetPath])
}
