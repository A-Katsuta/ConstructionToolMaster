import { Folder, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FolderSelectorProps {
    type: 'source' | 'target'
    path: string
    onSelect: () => void
    className?: string
}

export function FolderSelector({ type, path, onSelect, className }: FolderSelectorProps) {
    const isSource = type === 'source'

    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-sm font-medium text-muted-foreground">
                {isSource ? '📁 整理対象フォルダ（元）' : '📂 移動先フォルダ（先）'}
            </label>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 justify-start gap-2 h-12 px-4 bg-secondary/30 hover:bg-secondary/50 border-dashed"
                    onClick={onSelect}
                >
                    {path ? (
                        <FolderOpen className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                        <Folder className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <span className={cn(
                        "truncate text-left",
                        path ? "text-foreground" : "text-muted-foreground"
                    )}>
                        {path || 'クリックしてフォルダを選択...'}
                    </span>
                </Button>
            </div>
            {path && (
                <p className="text-xs text-muted-foreground truncate">
                    パス: {path}
                </p>
            )}
        </div>
    )
}
