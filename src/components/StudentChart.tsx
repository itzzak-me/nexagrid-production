'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface ChartProps {
    data: any[];
}

export default function StudentChart({ data }: ChartProps) {
    const { brandColor, mode } = useTheme();

    // Dynamic colors based on theme
    const gridColor = mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const textColor = mode === 'dark' ? '#9CA3AF' : '#4B5563';

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke={gridColor} />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: textColor, fontSize: 12, fontWeight: 600 }}
                    />
                    <Radar
                        name="Performance"
                        dataKey="A"
                        stroke={brandColor}
                        strokeWidth={3}
                        fill={brandColor}
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
