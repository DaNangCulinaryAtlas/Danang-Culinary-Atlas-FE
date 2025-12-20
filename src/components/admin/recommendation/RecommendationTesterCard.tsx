"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { getRecommendations } from "@/services/recommendation";
import { Sparkles, Loader2, Search, AlertCircle } from "lucide-react";
import { adminColors } from "@/configs/colors";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RecommendationTesterCard() {
    const [userId, setUserId] = useState("");
    const [hour, setHour] = useState(new Date().getHours().toString());
    const [k, setK] = useState("10");
    const [targetType, setTargetType] = useState<"dish" | "restaurant">("dish");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Update hour to current time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setHour(new Date().getHours().toString());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const handleTest = async () => {
        if (!userId.trim()) {
            setError("Please enter a user ID");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await getRecommendations({
                user_id: userId,
                hour: parseInt(hour),
                k: parseInt(k),
                target_type: targetType,
            });

            if (response.success && response.data) {
                setResults(response.data);
            } else {
                setError(response.message || "Failed to get recommendations");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div
                    className="p-3 rounded-xl"
                    style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)" }}
                >
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Recommendation Tester</h3>
                    <p className="text-sm text-gray-500">Test Recommendations in Real-time</p>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {/* User ID */}
                <div>
                    <Label htmlFor="userId" className="text-sm font-semibold text-gray-700 mb-2 block">
                        User ID
                    </Label>
                    <Input
                        id="userId"
                        placeholder="Enter user ID (e.g., user_123)"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="h-11"
                    />
                </div>

                {/* Hour */}
                <div>
                    <Label htmlFor="hour" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Hour of Day (0-23)
                    </Label>
                    <Input
                        id="hour"
                        type="number"
                        min="0"
                        max="23"
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        className="h-11"
                    />
                </div>

                {/* K Value */}
                <div>
                    <Label htmlFor="k" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Number of Recommendations (K)
                    </Label>
                    <Input
                        id="k"
                        type="number"
                        min="1"
                        max="50"
                        value={k}
                        onChange={(e) => setK(e.target.value)}
                        className="h-11"
                    />
                </div>

                {/* Target Type */}
                <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">Target Type</Label>
                    <RadioGroup value={targetType} onValueChange={(val) => setTargetType(val as any)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dish" id="dish" />
                            <Label htmlFor="dish" className="font-normal cursor-pointer">
                                Dish Recommendation
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="restaurant" id="restaurant" />
                            <Label htmlFor="restaurant" className="font-normal cursor-pointer">
                                Restaurant Recommendation
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <Button
                onClick={handleTest}
                disabled={isLoading}
                className="w-full h-12 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-white mb-6"
                style={{ background: adminColors.gradients.primarySoft }}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Getting Recommendations...
                    </>
                ) : (
                    <>
                        <Search className="w-5 h-5 mr-2" />
                        Get Recommendations
                    </>
                )}
            </Button>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-red-900 text-sm">Error</p>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Results */}
            {results && (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-900">Recommendation Results</h4>
                            <Badge className="font-semibold text-white" style={{ background: adminColors.status.success }}>
                                Success
                            </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">User ID:</span>
                                <span className="font-semibold text-gray-900">{results.user_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Context Hour:</span>
                                <span className="font-semibold text-gray-900">{results.context_hour}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Context Label:</span>
                                <span className="font-semibold text-gray-900">{results.context_label}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Target Type:</span>
                                <Badge className="text-xs" style={{ background: adminColors.accent.teal }}>
                                    {results.target_type}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3">
                            Recommendations ({results.recommendations.length})
                        </h4>
                        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                            {results.recommendations.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                            style={{ background: adminColors.gradients.primarySoft }}
                                        >
                                            #{item.rank}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{item.id}</p>
                                            <p className="text-xs text-gray-500">Score: {item.score.toFixed(4)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
