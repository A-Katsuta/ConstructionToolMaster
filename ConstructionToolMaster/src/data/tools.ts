import type { Tool } from '../types';

export const tools: Tool[] = [
    {
        id: '1',
        formalName: 'インパクトドライバ',
        colloquialNames: ['インパクト', 'ガチャ'],
        description: 'ネジ締めや穴あけに使用する電動工具。回転と打撃を組み合わせて強力に締め付ける。',
        imageUrl: 'https://placehold.co/600x400/orange/white?text=Impact+Driver', // Placeholder
        category: 'power',
        difficulty: 1,
    },
    {
        id: '2',
        formalName: 'モンキーレンチ',
        colloquialNames: ['モンキー'],
        description: 'ボルトやナットを締めたり緩めたりする工具。口の開き幅を調節できる。',
        imageUrl: 'https://placehold.co/600x400/gray/white?text=Monkey+Wrench', // Placeholder
        category: 'hand',
        difficulty: 1,
    },
    {
        id: '3',
        formalName: 'ディスクグラインダ',
        colloquialNames: ['サンダー', 'グラインダ'],
        description: '金属や石材の研磨、切断に使用する電動工具。円盤状の砥石を回転させる。',
        imageUrl: 'https://placehold.co/600x400/red/white?text=Disc+Grinder', // Placeholder
        category: 'power',
        difficulty: 2,
    },
    {
        id: '4',
        formalName: 'コンベックス',
        colloquialNames: ['スケール', 'メジャー'],
        description: '長さを測るための測定工具。金属製のテープが巻かれている。',
        imageUrl: 'https://placehold.co/600x400/yellow/black?text=Convex', // Placeholder
        category: 'measurement',
        difficulty: 1,
    },
    {
        id: '5',
        formalName: '安全帯',
        colloquialNames: ['命綱'],
        description: '高所作業での墜落を防止するための保護具。現在は「墜落制止用器具」が正式名称。',
        imageUrl: 'https://placehold.co/600x400/blue/white?text=Safety+Belt', // Placeholder
        category: 'safety',
        difficulty: 2,
    },
];
