import React from 'react';
import type { Tool } from '../types';

interface ToolCardProps {
    tool: Tool;
    showName?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, showName = false }) => {
    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 max-w-sm w-full mx-auto">
            <div className="aspect-video w-full bg-gray-900 relative">
                <img
                    src={tool.imageUrl}
                    alt={tool.formalName}
                    className="w-full h-full object-cover"
                />
            </div>
            {showName && (
                <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{tool.formalName}</h3>
                    <p className="text-gray-400 text-sm">通称: {tool.colloquialNames.join(', ')}</p>
                    <p className="text-gray-300 mt-2 text-sm">{tool.description}</p>
                </div>
            )}
        </div>
    );
};
