import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderSelector } from '@/components/FolderSelector'
import { RuleBuilder } from '@/components/RuleBuilder'
import { PreviewPanel } from '@/components/PreviewPanel'
import { LogPanel } from '@/components/LogPanel'
import { useRenamePreview } from '@/hooks/useRenamePreview'
import { FileInfo, Rules, RenameResult } from '@/types'
import { FileStack, Sparkles } from 'lucide-react'

const defaultRules: Rules = {
    useDate: true,
    useSequence: true,
    useCustomText: false,
    dateType: 'execution',
    sequenceDigits: 2,
    customText: '',
    separator: '_',
    order: ['date', 'customText', 'sequence']
}

function App() {
    const [sourcePath, setSourcePath] = useState('')
    const [targetPath, setTargetPath] = useState('')
    const [rules, setRules] = useState<Rules>(defaultRules)
    const [files, setFiles] = useState<FileInfo[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isExecuting, setIsExecuting] = useState(false)
    const [results, setResults] = useState<RenameResult[] | null>(null)

    // プレビューを計算
    const previewItems = useRenamePreview(files, rules, targetPath)

    // 初期化：保存された設定を読み込み
    useEffect(() => {
        async function loadSettings() {
            try {
                const paths = await window.electronAPI.getStoredPaths()
                if (paths.sourcePath) setSourcePath(paths.sourcePath)
                if (paths.targetPath) setTargetPath(paths.targetPath)

                const savedRules = await window.electronAPI.getRules()
                if (savedRules) setRules(savedRules as Rules)
            } catch (error) {
                console.error('Failed to load settings:', error)
            }
        }
        loadSettings()
    }, [])

    // ソースフォルダが変更されたらファイル一覧を更新
    useEffect(() => {
        if (sourcePath) {
            loadFiles()
        } else {
            setFiles([])
        }
    }, [sourcePath])

    // ルールが変更されたら保存
    useEffect(() => {
        window.electronAPI.saveRules(rules)
    }, [rules])

    // ファイル一覧を読み込み
    const loadFiles = useCallback(async () => {
        setIsLoading(true)
        try {
            const fileList = await window.electronAPI.getFiles()
            setFiles(fileList)
        } catch (error) {
            console.error('Failed to load files:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // フォルダ選択
    const handleSelectFolder = async (type: 'source' | 'target') => {
        const path = await window.electronAPI.selectFolder(type)
        if (path) {
            if (type === 'source') {
                setSourcePath(path)
            } else {
                setTargetPath(path)
            }
        }
    }

    // 実行
    const handleExecute = async () => {
        if (!targetPath || previewItems.length === 0) return

        setIsExecuting(true)
        try {
            const filesToProcess = previewItems.map(item => ({
                original: item.original,
                newName: item.newName
            }))

            const executeResults = await window.electronAPI.executeRename(filesToProcess)
            setResults(executeResults)

            // 成功したファイルがあればファイル一覧を更新
            const hasSuccess = executeResults.some(r => r.success)
            if (hasSuccess) {
                await loadFiles()
            }
        } catch (error) {
            console.error('Execution failed:', error)
        } finally {
            setIsExecuting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* ヘッダー */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <FileStack className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                ファイル整理自動化パック
                                <Sparkles className="h-4 w-4 text-amber-400" />
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                事務作業20分短縮
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="container mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: 'calc(100vh - 140px)' }}>
                    {/* 左パネル: 設定 */}
                    <Card className="lg:h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">⚙️ 設定</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* フォルダ選択 */}
                            <div className="space-y-4">
                                <FolderSelector
                                    type="source"
                                    path={sourcePath}
                                    onSelect={() => handleSelectFolder('source')}
                                />
                                <FolderSelector
                                    type="target"
                                    path={targetPath}
                                    onSelect={() => handleSelectFolder('target')}
                                />
                            </div>

                            <div className="border-t border-border pt-6">
                                <RuleBuilder rules={rules} onRulesChange={setRules} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 右パネル: プレビュー */}
                    <Card className="lg:h-full flex flex-col">
                        <CardContent className="flex-1 pt-6">
                            <PreviewPanel
                                items={previewItems}
                                targetPath={targetPath}
                                isLoading={isLoading}
                                isExecuting={isExecuting}
                                onExecute={handleExecute}
                                onRefresh={loadFiles}
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* 結果ダイアログ */}
            {results && (
                <LogPanel
                    results={results}
                    onClose={() => setResults(null)}
                />
            )}
        </div>
    )
}

export default App
