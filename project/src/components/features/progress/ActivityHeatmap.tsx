import React from 'react';
import { motion } from 'framer-motion';

interface ActivityHeatmapProps {
    activityLogs: Record<string, number>;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ activityLogs }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    const getLevel = (count: number) => {
        if (!count) return 'bg-gray-100/50';
        if (count < 3) return 'bg-green-200';
        if (count < 6) return 'bg-green-400';
        if (count < 10) return 'bg-green-600';
        return 'bg-green-800';
    };

    // Group activities by month for the current year
    const monthlyData = months.map((month, monthIndex) => {
        const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return {
                date: dateStr,
                count: activityLogs[dateStr] || 0
            };
        });
        return { month, days };
    });

    return (
        <div className="bg-white rounded-[2rem] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h3 className="text-2xl font-black uppercase tracking-tight">Activity Tracker {currentYear}</h3>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border-2 border-black rounded-xl">
                    <span className="text-[10px] font-black uppercase text-gray-400">Less</span>
                    {[0, 2, 5, 8, 12].map((c, i) => (
                        <div key={i} className={`w-4 h-4 rounded-sm border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${getLevel(c)}`} />
                    ))}
                    <span className="text-[10px] font-black uppercase text-gray-400">More</span>
                </div>
            </div>

            <div className="space-y-3 overflow-x-auto pb-4 custom-scrollbar">
                {monthlyData.map(({ month, days }) => (
                    <div key={month} className="flex items-center gap-4 min-w-[850px]">
                        <div className="w-10 text-[11px] font-black uppercase text-gray-400 text-right">{month}</div>
                        <div className="flex gap-1.5 p-2 bg-slate-50/50 rounded-lg border-2 border-black/5">
                            {days.map((day) => (
                                <motion.div
                                    key={day.date}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.2, zIndex: 10 }}
                                    title={`${day.date}: ${day.count} items`}
                                    className={`w-4 h-4 rounded-sm border-2 border-black/10 hover:border-black cursor-pointer transition-all ${getLevel(day.count)}`}
                                />
                            ))}
                            {/* Pad remaining space to 31 days for alignment */}
                            {Array.from({ length: 31 - days.length }).map((_, i) => (
                                <div key={`pad-${i}`} className="w-4 h-4 opacity-0" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 border-2 border-black rounded-2xl">
                <span className="text-xl">💡</span>
                <p className="text-xs font-bold text-amber-900 leading-relaxed">
                    Stay consistent! Every quiz, game session, and lesson you complete is tracked here.
                    Try to light up every box with deep green!
                </p>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
