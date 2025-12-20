"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecommendationHealth } from "@/hooks/queries/useRecommendationHealth";
import { Activity, AlertCircle, CheckCircle2, Loader2, Server } from "lucide-react";
import { adminColors } from "@/configs/colors";
import { useTranslation } from "@/hooks/useTranslation";

export default function SystemHealthCard() {
    const { data: health, isLoading, isError } = useRecommendationHealth();
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

    if (isError || !health) {
        return (
            <Card className="p-6 border-0 shadow-lg bg-red-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-100">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-900">{t('admin.recommendation.systemHealth.systemError')}</h3>
                        <p className="text-sm text-red-600">{t('admin.recommendation.systemHealth.unableToConnect')}</p>
                    </div>
                </div>
            </Card>
        );
    }

    const isHealthy = health.status === "healthy";

    return (
        <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="p-3 rounded-xl"
                        style={{
                            background: isHealthy
                                ? "linear-gradient(135deg, #10B981, #059669)"
                                : "linear-gradient(135deg, #EF4444, #DC2626)",
                        }}
                    >
                        {isHealthy ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-white" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{t('admin.recommendation.systemHealth.title')}</h3>
                        <p className="text-sm text-gray-500">{t('admin.recommendation.systemHealth.subtitle')}</p>
                    </div>
                </div>
                <Badge
                    className="px-3 py-1 font-semibold"
                    style={{
                        background: isHealthy ? adminColors.status.success : adminColors.status.error,
                        color: "white",
                    }}
                >
                    {health.status.toUpperCase()}
                </Badge>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">{t('admin.recommendation.systemHealth.serviceVersion')}</span>
                    </div>
                    <span className="font-bold" style={{ color: adminColors.primary[600] }}>
                        {health.version}
                    </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">{t('admin.recommendation.systemHealth.modelStatus')}</span>
                    </div>
                    <Badge
                        className="font-semibold"
                        style={{
                            background: health.model_loaded
                                ? adminColors.status.success
                                : adminColors.status.warning,
                            color: "white",
                        }}
                    >
                        {health.model_loaded ? t('admin.recommendation.systemHealth.modelLoaded') : t('admin.recommendation.systemHealth.modelNotLoaded')}
                    </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">{t('admin.recommendation.systemHealth.trainingStatus')}</span>
                    </div>
                    <Badge
                        className="font-semibold"
                        style={{
                            background:
                                health.training_status === "idle"
                                    ? adminColors.accent.teal
                                    : adminColors.status.warning,
                            color: "white",
                        }}
                    >
                        {health.training_status === "idle" ? t('admin.recommendation.systemHealth.idle').toUpperCase() : t('admin.recommendation.systemHealth.training').toUpperCase()}
                    </Badge>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-600">{t('admin.recommendation.systemHealth.lastTraining')}</span>
                    </div>
                    <p className="text-sm font-bold" style={{ color: adminColors.primary[700] }}>
                        {new Date(health.last_training).toLocaleString("vi-VN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                </div>
            </div>
        </Card>
    );
}
