import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import { useTokens } from "../../context/TokenContext";
import {
    User,
    Mail,
    Calendar,
    Trophy,
    Clock,
    Shield,
    Award
} from "lucide-react";

const Profile: React.FC = () => {
    const { user } = useAuth();
    const { userProgress, getLevelProgress } = useGame();
    const { balance, transactions } = useTokens();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 bg-purple-500 rounded-2xl border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <User className="h-20 w-20 text-white" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 border-2 border-black rounded-lg px-2 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                Lvl {userProgress.level}
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <h1 className="text-4xl font-black text-black mb-2 uppercase tracking-tight">
                                {user.name}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 font-bold">
                                <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-1 capitalize">
                                    <Shield className="h-4 w-4" />
                                    {user.role}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Joined Feb 2024
                                </div>
                            </div>

                            {/* Level Progress */}
                            <div className="mt-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-black uppercase text-gray-500">Level {userProgress.level} Progress</span>
                                    <span className="text-sm font-black text-black">{Math.round(userProgress.experience)} / {userProgress.experienceToNext} XP</span>
                                </div>
                                <div className="w-full h-4 bg-gray-200 rounded-full border-2 border-black overflow-hidden pointer-events-none">
                                    <div
                                        className="h-full bg-green-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${getLevelProgress()}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white border-2 border-black rounded-2xl p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[100px]">
                                <div className="text-2xl mb-1">💎</div>
                                <div className="text-xl font-black">{balance}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Diamonds</div>
                            </div>
                            <div className="bg-white border-2 border-black rounded-2xl p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[100px]">
                                <div className="text-2xl mb-1">⭐</div>
                                <div className="text-xl font-black">{userProgress.totalPoints}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Points</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats & Streak */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-3xl border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Current Streak
                            </h2>
                            <div className="text-center py-6">
                                <div className="text-6xl mb-2">🔥</div>
                                <div className="text-5xl font-black mb-2">{userProgress.streak}</div>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Day Streak</p>
                                <p className="mt-4 text-xs font-bold text-purple-600 bg-purple-50 p-2 rounded-xl border-2 border-dashed border-purple-200">
                                    Keep it up! Reach 7 days for 50 💎 bonus
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                                <Award className="h-5 w-5 text-blue-500" />
                                Activities
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border-2 border-black">
                                    <span className="font-bold text-sm">Quizzes Taken</span>
                                    <span className="px-3 py-1 bg-black text-white rounded-xl text-xs font-black">{userProgress.quizzesTaken}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border-2 border-black">
                                    <span className="font-bold text-sm">Games Played</span>
                                    <span className="px-3 py-1 bg-black text-white rounded-xl text-xs font-black">{userProgress.gamesPlayed}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border-2 border-black">
                                    <span className="font-bold text-sm">Subjects Completed</span>
                                    <span className="px-3 py-1 bg-black text-white rounded-xl text-xs font-black">{userProgress.subjectsCompleted.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
                            <h2 className="text-2xl font-black uppercase mb-8 flex items-center justify-between">
                                <span>Diamond History</span>
                                <span className="text-xs font-black bg-gray-100 px-3 py-1 rounded-full border-2 border-black">Last 10 Transactions</span>
                            </h2>

                            <div className="space-y-4">
                                {transactions.length > 0 ? (
                                    transactions.slice(0, 10).map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-black hover:bg-white transition-all hover:scale-[1.01]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    {tx.amount > 0 ? '💎' : '🛒'}
                                                </div>
                                                <div>
                                                    <div className="font-black text-black">{tx.reason}</div>
                                                    <div className="text-xs font-bold text-gray-500">{new Date(tx.date).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className={`text-lg font-black ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200">
                                        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-400 font-bold uppercase tracking-wider">No transaction history found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
