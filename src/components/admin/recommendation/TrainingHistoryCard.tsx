"use client";

import { Card } from "@/components/ui/card";
import { useTrainingHistory } from "@/hooks/queries/useTrainingHistory";
import { History, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { adminColors } from "@/configs/colors";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

export default function TrainingHistoryCard() {
    const { data: history, isLoading } = useTrainingHistory();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <Card className="p-6 border-0 shadow-lg">
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: adminColors.primary[500] }} />
                </div>
            </Card>
        );
    }

    if (!history || !history.history || history.history.length === 0) {
        return (
            <Card className="p-6 border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="p-3 rounded-xl"
                        style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}
                    >
                        <History className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{t('admin.recommendation.history.title')}</h3>
                        <p className="text-sm text-gray-500">{t('admin.recommendation.history.noRecords')}</p>
                    </div>
                </div>
            </Card>
        );
    }

    const formatScore = (score: number) => (score * 100).toFixed(2) + "%";

    const getTrendIcon = (current: number, previous: number | null) => {
        if (!previous) return <Minus className="w-4 h-4 text-gray-400" />;
        if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    const getTrendColor = (current: number, previous: number | null) => {
        if (!previous) return "text-gray-600";
        if (current > previous) return "text-green-600";
        if (current < previous) return "text-red-600";
        return "text-gray-600";
    };

    return (
        <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="p-3 rounded-xl"
                        style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}
                    >
                        <History className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{t('admin.recommendation.history.title')}</h3>
                        <p className="text-sm text-gray-500">{t('admin.recommendation.history.subtitle')}</p>
                    </div>
                </div>
                <Badge
                    className="px-3 py-1 font-semibold text-white"
                    style={{ background: adminColors.accent.teal }}
                >
                    {history.total_trainings} {t('admin.recommendation.history.sessions')}
                </Badge>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {history.history.map((item, index) => {
                    const previousItem = index < history.history.length - 1 ? history.history[index + 1] : null;

                    return (
                        <div
                            key={index}
                            className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        className="font-semibold text-white"
                                        style={{
                                            background:
                                                index === 0 ? adminColors.status.success : adminColors.primary[500],
                                        }}
                                    >
                                        {index === 0 ? t('admin.recommendation.history.latest') : `${t('admin.recommendation.history.session')} ${history.total_trainings - index}`}
                                    </Badge>
                                </div>
                                <p className="text-xs font-medium text-gray-600">
                                    {new Date(item.timestamp).toLocaleString("vi-VN")}
                                </p>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Validation */}
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-gray-600 mb-2">{t('admin.recommendation.history.validation')}</h5>
                                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                        <span className="text-xs text-gray-600">{t('admin.recommendation.metrics.recall')}</span>
                                        <div className="flex items-center gap-1">
                                            {getTrendIcon(
                                                item.val["Recall@10"],
                                                previousItem?.val["Recall@10"] || null
                                            )}
                                            <span
                                                className={`text-sm font-bold ${getTrendColor(
                                                    item.val["Recall@10"],
                                                    previousItem?.val["Recall@10"] || null
                                                )}`}
                                            >
                                                {formatScore(item.val["Recall@10"])}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                        <span className="text-xs text-gray-600">{t('admin.recommendation.metrics.ndcg')}</span>
                                        <div className="flex items-center gap-1">
                                            {getTrendIcon(
                                                item.val["NDCG@10"],
                                                previousItem?.val["NDCG@10"] || null
                                            )}
                                            <span
                                                className={`text-sm font-bold ${getTrendColor(
                                                    item.val["NDCG@10"],
                                                    previousItem?.val["NDCG@10"] || null
                                                )}`}
                                            >
                                                {formatScore(item.val["NDCG@10"])}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Test Dish */}
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-gray-600 mb-2">{t('admin.recommendation.history.testDish')}</h5>
                                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                        <span className="text-xs text-gray-600">{t('admin.recommendation.metrics.recall')}</span>
                                        <div className="flex items-center gap-1">
                                            {getTrendIcon(
                                                item.test_dish["Recall@10"],
                                                previousItem?.test_dish["Recall@10"] || null
                                            )}
                                            <span
                                                className={`text-sm font-bold ${getTrendColor(
                                                    item.test_dish["Recall@10"],
                                                    previousItem?.test_dish["Recall@10"] || null
                                                )}`}
                                            >
                                                {formatScore(item.test_dish["Recall@10"])}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                        <span className="text-xs text-gray-600">{t('admin.recommendation.metrics.ndcg')}</span>
                                        <div className="flex items-center gap-1">
                                            {getTrendIcon(
                                                item.test_dish["NDCG@10"],
                                                previousItem?.test_dish["NDCG@10"] || null
                                            )}
                                            <span
                                                className={`text-sm font-bold ${getTrendColor(
                                                    item.test_dish["NDCG@10"],
                                                    previousItem?.test_dish["NDCG@10"] || null
                                                )}`}
                                            >
                                                {formatScore(item.test_dish["NDCG@10"])}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Test Restaurant */}
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-gray-600 mb-2">{t('admin.recommendation.history.testRestaurant')}</h5>
                                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                        <span className="text-xs text-gray-600">{t('admin.recommendation.metrics.recall')}</span>
                                        <div className="flex items-center gap-1">
                                            {getTrendIcon(
                                                item.test_rest["Recall@10"],
                                                previousItem?.test_rest["Recall@10"] || null
                                            )}
                                            <span
                                                className={`text-sm font-bold ${getTrendColor(
                                                    item.test_rest["Recall@10"],
                                                    previousItem?.test_rest["Recall@10"] || null
                                                )}`}
                                            >
                                                {formatScore(item.test_rest["Recall@10"])}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                        <span className="text-xs text-gray-600">{t('admin.recommendation.metrics.ndcg')}</span>
                                        <div className="flex items-center gap-1">
                                            {getTrendIcon(
                                                item.test_rest["NDCG@10"],
                                                previousItem?.test_rest["NDCG@10"] || null
                                            )}
                                            <span
                                                className={`text-sm font-bold ${getTrendColor(
                                                    item.test_rest["NDCG@10"],
                                                    previousItem?.test_rest["NDCG@10"] || null
                                                )}`}
                                            >
                                                {formatScore(item.test_rest["NDCG@10"])}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
