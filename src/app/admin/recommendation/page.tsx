"use client";

import { Brain } from "lucide-react";
import { adminColors } from "@/configs/colors";
import SystemHealthCard from "@/components/admin/recommendation/SystemHealthCard";
import TrainingControlCard from "@/components/admin/recommendation/TrainingControlCard";
import MetricsCard from "@/components/admin/recommendation/MetricsCard";
import TrainingHistoryCard from "@/components/admin/recommendation/TrainingHistoryCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function RecommendationPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className="p-4 rounded-2xl shadow-xl"
                        style={{ background: adminColors.gradients.primarySoft }}
                    >
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1
                            className="text-3xl font-bold tracking-tight"
                            style={{ color: adminColors.primary[700] }}
                        >
                            {t('admin.recommendation.title')}
                        </h1>
                        <p className="text-gray-600 font-medium mt-1">
                            {t('admin.recommendation.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Overview Section - System Health & Training Control */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemHealthCard />
                <TrainingControlCard />
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 gap-6">
                <MetricsCard />
            </div>

            {/* History Section */}
            <div className="grid grid-cols-1 gap-6">
                <TrainingHistoryCard />
            </div>

            {/* Footer Info */}
            <div
                className="p-6 rounded-xl shadow-lg"
                style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}
            >
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{t('admin.recommendation.about.title')}</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {t('admin.recommendation.about.description')}
                        </p>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                            <div>
                                <p className="font-semibold text-gray-600">{t('admin.recommendation.about.recall')}</p>
                                <p className="text-gray-500">{t('admin.recommendation.about.recallDesc')}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">{t('admin.recommendation.about.ndcg')}</p>
                                <p className="text-gray-500">{t('admin.recommendation.about.ndcgDesc')}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">{t('admin.recommendation.about.autoTraining')}</p>
                                <p className="text-gray-500">{t('admin.recommendation.about.autoTrainingDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
