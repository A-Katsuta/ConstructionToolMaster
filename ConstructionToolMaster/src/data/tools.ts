import type { Tool } from '../types';
import futureToolSheet from '../../future_versions/工具名称一覧.md?raw';

// 未来版フォトをまとめて取り込む（未存在なら空オブジェクト）
const photoModules = import.meta.glob('../../future_versions/tools_photos/*.{png,jpg,jpeg,webp}', {
    eager: true,
    import: 'default',
}) as Record<string, string>;

const photoMap: Record<string, string> = Object.entries(photoModules).reduce((acc, [path, url]) => {
    const filename = path.split('/').pop() || '';
    const namePart = filename.replace(/^No\.\d+_/, '').replace(/\.[^.]+$/, '');
    if (namePart) acc[namePart] = url;
    return acc;
}, {} as Record<string, string>);

const placeholderImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none"><rect width="600" height="400" rx="24" fill=\"%23222\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" fill=\"%23ccc\" font-size=\"28\" font-family=\"sans-serif\">Tool</text></svg>';

const baseTools: Tool[] = [
    {
        id: '1',
        formalName: 'インパクトドライバ',
        colloquialNames: ['インパクト', 'ガチャ'],
        description: 'ネジ締めや穴あけに使用する電動工具。回転と打撃を組み合わせて強力に締め付ける。',
        imageUrl: '/images/impact-driver.png',
        category: 'power',
        difficulty: 1,
    },
    {
        id: '2',
        formalName: 'モンキーレンチ',
        colloquialNames: ['モンキー'],
        description: 'ボルトやナットを締めたり緩めたりする工具。口の開き幅を調節できる。',
        imageUrl: '/images/monkey-wrench.png',
        category: 'hand',
        difficulty: 1,
    },
    {
        id: '3',
        formalName: 'ディスクグラインダ',
        colloquialNames: ['サンダー', 'グラインダ'],
        description: '金属や石材の研磨、切断に使用する電動工具。円盤状の砥石を回転させる。',
        imageUrl: '/images/disc-grinder.png',
        category: 'power',
        difficulty: 2,
    },
    {
        id: '4',
        formalName: 'コンベックス',
        colloquialNames: ['スケール', 'メジャー'],
        description: '長さを測るための測定工具。金属製のテープが巻かれている。',
        imageUrl: '/images/measuring-tape.png',
        category: 'measurement',
        difficulty: 1,
    },
    {
        id: '5',
        formalName: '安全帯',
        colloquialNames: ['命綱'],
        description: '高所作業での墜落を防止するための保護具。現在は「墜落制止用器具」が正式名称。',
        imageUrl: '/images/safety-harness.png',
        category: 'safety',
        difficulty: 2,
    },
];

/**
 * future_versions/工具名称一覧.md は Markdown の表形式。
 * | No. | 正式名称 | 俗称 | 工具の簡易説明 | 関係する業界 |
 * これを Tool 配列に変換し、既存 tools に追加する。
 */
const parseFutureTools = (raw: string): Tool[] => {
    const lines = raw
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.startsWith('|') && !l.startsWith('| ---'));

    const toolsFromSheet: Tool[] = [];

    lines.forEach(line => {
        const cells = line
            .split('|')
            .map(c => c.trim())
            .filter(Boolean);
        if (cells.length < 5) return;

        const [no, formalNameRaw, colloquial, description] = cells;
        const formalNameVariants = formalNameRaw.split(/、|,|，/).map(n => n.trim()).filter(Boolean);
        const formalName = formalNameVariants[0] ?? formalNameRaw;
        const colloquialNames = colloquial.split(/、|,|，/).map(n => n.trim()).filter(Boolean);

        // ファイル名と一致するものを優先的に利用（例: No.01_一輪車.jpg）
        const matchedPhoto =
            formalNameVariants
                .map(name => photoMap[name])
                .find(Boolean) ??
            photoMap[formalName];

        toolsFromSheet.push({
            id: `F${no}`,
            formalName,
            colloquialNames,
            description,
            imageUrl: matchedPhoto ?? placeholderImage,
            category: 'other',
            difficulty: 2,
        });
    });

    return toolsFromSheet;
};

// 既存 formalName と重複するものを除外してマージ
const futureTools = parseFutureTools(futureToolSheet).filter(
    future => !baseTools.some(base => base.formalName === future.formalName),
);

export const tools: Tool[] = [...baseTools, ...futureTools];
