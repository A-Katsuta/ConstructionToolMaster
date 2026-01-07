import { CheckCircle, XCircle, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { RenameResult } from '@/types'
import { cn } from '@/lib/utils'

interface LogPanelProps {
    results: RenameResult[]
    onClose: () => void
}

export function LogPanel({ results, onClose }: LogPanelProps) {
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[80vh] mx-4 bg-card rounded-xl border border-border shadow-2xl flex flex-col animate-fade-in">
                {/* ヘッダー */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold">処理結果</h2>
                        <div className="flex gap-2">
                            <Badge variant="success" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {successCount} 成功
                            </Badge>
                            {failCount > 0 && (
                                <Badge variant="destructive" className="gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {failCount} 失敗
                                </Badge>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* 結果リスト */}
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-2">
                        {results.map((result, index) => (
                            <LogRow key={index} result={result} index={index} />
                        ))}
                    </div>
                </ScrollArea>

                {/* フッター */}
                <div className="p-6 border-t border-border">
                    <Button className="w-full" onClick={onClose}>
                        閉じる
                    </Button>
                </div>
            </div>
        </div>
    )
}

function LogRow({ result, index }: { result: RenameResult; index: number }) {
    return (
        <div
            className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-colors",
                result.success
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
            )}
            style={{ animationDelay: `${index * 20}ms` }}
        >
            <div className="shrink-0 mt-0.5">
                {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground font-mono truncate">
                        {result.originalName}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className={cn(
                        "font-mono font-medium truncate",
                        result.success ? "text-green-400" : "text-muted-foreground"
                    )}>
                        {result.newName}
                    </span>
                </div>
                {result.error && (
                    <p className="text-xs text-red-400 mt-1">
                        エラー: {result.error}
                    </p>
                )}
            </div>
        </div>
    )
}

// 処理中表示
export function ProcessingOverlay({ current, total }: { current: number; total: number }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-card rounded-xl border border-border p-8 text-center animate-fade-in">
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">処理中...</h3>
                <p className="text-muted-foreground">
                    {current} / {total} ファイルを処理中
                </p>
                <div className="mt-4 h-2 w-48 mx-auto bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(current / total) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
