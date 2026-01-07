import type { Tool } from '../types';
import futureToolSheet from '../../future_versions/tools_sheet.md?raw';

// future_versions/tools_photos 内の画像ファイルを一括 import（No.xx_名称.png 形式を想定）
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
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none"><rect width="600" height="400" rx="24" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ccc" font-size="28" font-family="sans-serif">Tool</text></svg>';

// 既存ゲーム内で使用していた初期データ
const baseTools: Tool[] = [
    {
        id: '1',
        formalName: 'インパクトドライバー',
        colloquialNames: ['インパクト', 'ドライバー'],
        description: 'ネジやボルトを強い回転と打撃で締め込む電動工具。先端ビットを付け替えて使う。',
        imageUrl: '/images/impact-driver.png',
        category: 'power',
        difficulty: 1,
    },
    {
        id: '2',
        formalName: 'モンキーレンチ',
        colloquialNames: ['モンキー'],
        description: '口幅をネジで調整できるスパナ。ボルト・ナットをつかんで回す。',
        imageUrl: '/images/monkey-wrench.png',
        category: 'hand',
        difficulty: 1,
    },
    {
        id: '3',
        formalName: 'ディスクグラインダー',
        colloquialNames: ['サンダー', 'グラインダー'],
        description: '砥石や切断砥石を高速回転させて研削・切断する電動工具。火花に注意。',
        imageUrl: '/images/disc-grinder.png',
        category: 'power',
        difficulty: 2,
    },
    {
        id: '4',
        formalName: 'コンベックス',
        colloquialNames: ['スケール', 'メジャー'],
        description: '引き出した目盛り付きテープで長さを測る巻尺。ロックで固定できる。',
        imageUrl: '/images/measuring-tape.png',
        category: 'measurement',
        difficulty: 1,
    },
    {
        id: '5',
        formalName: '安全帯（フルハーネス）',
        colloquialNames: ['ハーネス'],
        description: '高所作業で墜落を防ぐ命綱。胴ベルト型より転落時の姿勢保持に優れる。',
        imageUrl: '/images/safety-harness.png',
        category: 'safety',
        difficulty: 2,
    },
];

const normalizeName = (name: string) => name.replace(/[ー－\-‐―]/g, '').trim();

/**
 * future_versions/工具写真一覧.md を Markdown 表としてパースし、Tool 配列に変換する。
 * | No. | 正式名称 | 通称 | 工具の用途説明 | 分類など |
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
        const formalNameVariants = formalNameRaw.split(/、|,|・/).map(n => n.trim()).filter(Boolean);
        const formalName = formalNameVariants[0] ?? formalNameRaw;
        const colloquialNames = colloquial.split(/、|,|・/).map(n => n.trim()).filter(Boolean);

        // ファイル名と一致する名称があればその写真を優先利用（例: No.01_〇〇.jpg）
        const matchedPhoto =
            formalNameVariants
                .map(name => photoMap[name])
                .find(Boolean) ??
            photoMap[formalName];

        toolsFromSheet.push({
            id: `F${no.padStart(3, '0')}`,
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

// future_versions の85件をすべて取り込み、名称重複は正規化して除外
const futureTools = parseFutureTools(futureToolSheet);
const futureByName = new Map<string, Tool>();
futureTools.forEach(t => {
    const key = normalizeName(t.formalName);
    if (!futureByName.has(key)) {
        futureByName.set(key, t);
    }
});

const mergedTools: Tool[] = [];

// 1) future(85件) を優先登録
futureByName.forEach(t => mergedTools.push(t));

// 2) futureになかった初期データだけ追加（例: 安全帯）
baseTools.forEach(b => {
    const key = normalizeName(b.formalName);
    if (!futureByName.has(key)) {
        mergedTools.push(b);
    }
});

// 写真付き85件+初期分（重複除外）をゲームで利用
export const tools: Tool[] = mergedTools;
