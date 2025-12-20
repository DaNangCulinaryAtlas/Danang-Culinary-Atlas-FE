"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLatestMetrics } from "@/hooks/queries/useLatestMetrics";
import { Activity, Loader2, TrendingUp, BarChart3 } from "lucide-react";
import { adminColors } from "@/configs/colors";
import { useTranslation } from "@/hooks/useTranslation";

export default function MetricsCard() {
    const { data: metrics, isLoading } = useLatestMetrics();
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

    if (!metrics || !metrics.val || !metrics.test_dish || !metrics.test_rest) {
        return (
            <Card className="p-6 border-0 shadow-lg bg-red-50">
                <p className="text-red-600 text-center">{t('admin.recommendation.metrics.unableToLoad')}</p>
            </Card>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 0.7) return adminColors.status.success;
        if (score >= 0.5) return adminColors.status.warning;
        return adminColors.status.error;
    };

    const formatScore = (score: number) => (score * 100).toFixed(2) + "%";

    return (
        <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="p-3 rounded-xl"
                        style={{ background: "linear-gradient(135deg, #06B6D4, #0891B2)" }}
                    >
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{t('admin.recommendation.metrics.title')}</h3>
                        <p className="text-sm text-gray-500">{t('admin.recommendation.metrics.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Validation Metrics */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4" style={{ color: adminColors.primary[500] }} />
                        <h4 className="font-bold text-gray-800">{t('admin.recommendation.metrics.validationSet')}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                            <p className="text-xs font-medium text-gray-600 mb-1">{t('admin.recommendation.metrics.recall')}</p>
                            <p
                                className="text-2xl font-bold"
                                style={{ color: getScoreColor(metrics.val["Recall@10"]) }}
                            >
                                {formatScore(metrics.val["Recall@10"])}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                            <p className="text-xs font-medium text-gray-600 mb-1">{t('admin.recommendation.metrics.ndcg')}</p>
                            <p
                                className="text-2xl font-bold"
                                style={{ color: getScoreColor(metrics.val["NDCG@10"]) }}
                            >
                                {formatScore(metrics.val["NDCG@10"])}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Test Dish Metrics */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4" style={{ color: adminColors.accent.emerald }} />
                        <h4 className="font-bold text-gray-800">{t('admin.recommendation.metrics.testDish')}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                            <p className="text-xs font-medium text-gray-600 mb-1">{t('admin.recommendation.metrics.recall')}</p>
                            <p
                                className="text-2xl font-bold"
                                style={{ color: getScoreColor(metrics.test_dish["Recall@10"]) }}
                            >
                                {formatScore(metrics.test_dish["Recall@10"])}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                            <p className="text-xs font-medium text-gray-600 mb-1">{t('admin.recommendation.metrics.ndcg')}</p>
                            <p
                                className="text-2xl font-bold"
                                style={{ color: getScoreColor(metrics.test_dish["NDCG@10"]) }}
                            >
                                {formatScore(metrics.test_dish["NDCG@10"])}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Test Restaurant Metrics */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4" style={{ color: adminColors.accent.amber }} />
                        <h4 className="font-bold text-gray-800">{t('admin.recommendation.metrics.testRestaurant')}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                            <p className="text-xs font-medium text-gray-600 mb-1">{t('admin.recommendation.metrics.recall')}</p>
                            <p
                                className="text-2xl font-bold"
                                style={{ color: getScoreColor(metrics.test_rest["Recall@10"]) }}
                            >
                                {formatScore(metrics.test_rest["Recall@10"])}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                            <p className="text-xs font-medium text-gray-600 mb-1">{t('admin.recommendation.metrics.ndcg')}</p>
                            <p
                                className="text-2xl font-bold"
                                style={{ color: getScoreColor(metrics.test_rest["NDCG@10"]) }}
                            >
                                {formatScore(metrics.test_rest["NDCG@10"])}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timestamp */}
                <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">
                        {t('admin.recommendation.metrics.lastUpdated')}:{" "}
                        <span className="font-semibold text-gray-700">
                            {new Date(metrics.timestamp).toLocaleString("vi-VN")}
                        </span>
                    </p>
                </div>
            </div>
        </Card>
    );
}
