import { ArrowRight, FileIcon, AlertCircle, Loader2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { PreviewItem } from '@/types'
import { cn } from '@/lib/utils'

interface PreviewPanelProps {
    items: PreviewItem[]
    targetPath: string
    isLoading: boolean
    isExecuting: boolean
    onExecute: () => void
    onRefresh: () => void
}

export function PreviewPanel({
    items,
    targetPath,
    isLoading,
    isExecuting,
    onExecute,
    onRefresh
}: PreviewPanelProps) {
    const hasItems = items.length > 0
    const canExecute = hasItems && targetPath && !isExecuting

    return (
        <div className="flex flex-col h-full">
            {/* ヘッダー */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">プレビュー</h2>
                    {hasItems && (
                        <Badge variant="secondary">
                            {items.length} ファイル
                        </Badge>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isLoading || isExecuting}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            '更新'
                        )}
                    </Button>
                </div>
            </div>

            {/* プレビューリスト */}
            <ScrollArea className="flex-1 py-4">
                {!hasItems ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                        <FileIcon className="h-12 w-12 mb-4 opacity-30" />
                        <p className="text-sm">整理対象フォルダを選択してください</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <PreviewRow key={index} item={item} index={index} />
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* 移動先表示 */}
            {targetPath && (
                <div className="py-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        移動先: <span className="text-foreground font-mono">{targetPath}</span>
                    </p>
                </div>
            )}

            {/* 実行ボタン */}
            <div className="pt-4 border-t border-border">
                {!targetPath && hasItems && (
                    <div className="flex items-center gap-2 text-amber-400 text-sm mb-3">
                        <AlertCircle className="h-4 w-4" />
                        <span>移動先フォルダを選択してください</span>
                    </div>
                )}
                <Button
                    className={cn(
                        "w-full h-12 text-base font-semibold gap-2",
                        canExecute && "pulse-glow"
                    )}
                    disabled={!canExecute}
                    onClick={onExecute}
                >
                    {isExecuting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            処理中...
                        </>
                    ) : (
                        <>
                            <Play className="h-5 w-5" />
                            一括実行（リネーム＋移動）
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

function PreviewRow({ item, index }: { item: PreviewItem; index: number }) {
    const hasChanged = item.original !== item.newName

    return (
        <div
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors animate-fade-in",
                hasChanged ? "bg-secondary/30" : "bg-secondary/10"
            )}
            style={{ animationDelay: `${index * 30}ms` }}
        >
            <div className="flex items-center gap-2 w-5 text-muted-foreground text-xs">
                {index + 1}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="truncate text-sm text-muted-foreground font-mono">
                        {item.original}
                    </span>
                    {hasChanged && (
                        <>
                            <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate text-sm text-foreground font-mono font-medium">
                                {item.newName}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
