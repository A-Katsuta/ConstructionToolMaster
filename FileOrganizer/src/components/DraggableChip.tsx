import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Calendar, Hash, Type } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DraggableChipProps {
    id: string
    type: 'date' | 'sequence' | 'customText'
    label: string
    onRemove?: () => void
    disabled?: boolean
}

const iconMap = {
    date: Calendar,
    sequence: Hash,
    customText: Type
}

const colorMap = {
    date: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
    sequence: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
    customText: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
}

export function DraggableChip({ id, type, label, onRemove, disabled }: DraggableChipProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const Icon = iconMap[type]

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border",
                "select-none transition-all duration-200",
                colorMap[type],
                isDragging && "opacity-50 scale-105 shadow-lg z-50",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <button
                className={cn(
                    "cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-white/10",
                    disabled && "cursor-not-allowed"
                )}
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-4 w-4" />
            </button>
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="ml-1 p-0.5 rounded hover:bg-white/10 transition-colors"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </div>
    )
}

// 非ドラッグ版（プレビュー表示用）
export function StaticChip({ type, label }: { type: 'date' | 'sequence' | 'customText', label: string }) {
    const Icon = iconMap[type]

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs",
            colorMap[type]
        )}>
            <Icon className="h-3 w-3" />
            <span>{label}</span>
        </div>
    )
}
