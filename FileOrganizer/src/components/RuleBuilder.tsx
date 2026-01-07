import { useCallback } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { DraggableChip, StaticChip } from '@/components/DraggableChip'
import { Rules } from '@/types'
import { cn } from '@/lib/utils'

interface RuleBuilderProps {
    rules: Rules
    onRulesChange: (rules: Rules) => void
}

const elementLabels = {
    date: '日付',
    sequence: '連番',
    customText: '文字列'
}

export function RuleBuilder({ rules, onRulesChange }: RuleBuilderProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = rules.order.indexOf(active.id as string)
            const newIndex = rules.order.indexOf(over.id as string)

            onRulesChange({
                ...rules,
                order: arrayMove(rules.order, oldIndex, newIndex)
            })
        }
    }, [rules, onRulesChange])

    const activeElements = rules.order.filter(id => {
        if (id === 'date') return rules.useDate
        if (id === 'sequence') return rules.useSequence
        if (id === 'customText') return rules.useCustomText
        return false
    })

    const separatorOptions = [
        { value: '_', label: 'アンダースコア ( _ )' },
        { value: '-', label: 'ハイフン ( - )' },
        { value: ' ', label: 'スペース' },
        { value: '.', label: 'ドット ( . )' },
        { value: '', label: 'なし' }
    ]

    return (
        <div className="space-y-6">
            {/* 要素の選択 */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    構成要素
                </h3>

                {/* 日付 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={rules.useDate}
                            onCheckedChange={(checked) => onRulesChange({ ...rules, useDate: checked })}
                        />
                        <Label className="flex items-center gap-2 cursor-pointer">
                            <StaticChip type="date" label="日付" />
                        </Label>
                    </div>
                    {rules.useDate && (
                        <select
                            value={rules.dateType}
                            onChange={(e) => onRulesChange({ ...rules, dateType: e.target.value as 'execution' | 'creation' })}
                            className="text-sm bg-background border border-input rounded-md px-2 py-1"
                        >
                            <option value="execution">実行日</option>
                            <option value="creation">ファイル作成日</option>
                        </select>
                    )}
                </div>

                {/* 連番 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={rules.useSequence}
                            onCheckedChange={(checked) => onRulesChange({ ...rules, useSequence: checked })}
                        />
                        <Label className="flex items-center gap-2 cursor-pointer">
                            <StaticChip type="sequence" label="連番" />
                        </Label>
                    </div>
                    {rules.useSequence && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">桁数:</span>
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                value={rules.sequenceDigits}
                                onChange={(e) => onRulesChange({ ...rules, sequenceDigits: parseInt(e.target.value) || 2 })}
                                className="w-16 h-8 text-center"
                            />
                        </div>
                    )}
                </div>

                {/* 任意文字列 */}
                <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={rules.useCustomText}
                                onCheckedChange={(checked) => onRulesChange({ ...rules, useCustomText: checked })}
                            />
                            <Label className="flex items-center gap-2 cursor-pointer">
                                <StaticChip type="customText" label="文字列" />
                            </Label>
                        </div>
                    </div>
                    {rules.useCustomText && (
                        <Input
                            placeholder="例: 請求書、プロジェクト名..."
                            value={rules.customText}
                            onChange={(e) => onRulesChange({ ...rules, customText: e.target.value })}
                            className="mt-2"
                        />
                    )}
                </div>
            </div>

            {/* 区切り文字 */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    区切り文字
                </h3>
                <div className="flex flex-wrap gap-2">
                    {separatorOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onRulesChange({ ...rules, separator: opt.value })}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm border transition-all",
                                rules.separator === opt.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary/30 border-border hover:bg-secondary/50"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 順序並べ替え */}
            {activeElements.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        順序（ドラッグで並べ替え）
                    </h3>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={activeElements}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex flex-wrap gap-2 p-4 rounded-lg border-2 border-dashed border-border bg-secondary/10 min-h-[60px]">
                                {activeElements.map((id) => (
                                    <DraggableChip
                                        key={id}
                                        id={id}
                                        type={id as 'date' | 'sequence' | 'customText'}
                                        label={elementLabels[id as keyof typeof elementLabels]}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}

            {/* プレビュー例 */}
            {activeElements.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        ファイル名プレビュー例
                    </h3>
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <code className="text-sm text-primary font-mono">
                            {generatePreviewExample(rules, activeElements)}
                        </code>
                    </div>
                </div>
            )}
        </div>
    )
}

function generatePreviewExample(rules: Rules, activeElements: string[]): string {
    const parts: string[] = []

    for (const element of activeElements) {
        if (element === 'date') {
            parts.push('20260108')
        } else if (element === 'sequence') {
            parts.push('01'.padStart(rules.sequenceDigits, '0'))
        } else if (element === 'customText') {
            parts.push(rules.customText || '文字列')
        }
    }

    return parts.join(rules.separator) + '.pdf'
}
