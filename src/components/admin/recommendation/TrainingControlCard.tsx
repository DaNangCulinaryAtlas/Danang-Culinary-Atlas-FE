"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTrainingStatus } from "@/hooks/queries/useTrainingStatus";
import { useTrainingTrigger } from "@/hooks/mutations/useTrainingTrigger";
import {
    Play,
    Loader2,
    Clock,
    RefreshCw,
    Zap,
    Calendar,
    Timer,
} from "lucide-react";
import { adminColors } from "@/configs/colors";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function TrainingControlCard() {
    const { data: status, isLoading } = useTrainingStatus();
    const triggerTraining = useTrainingTrigger();
    const [showConfirm, setShowConfirm] = useState(false);
    const { t } = useTranslation();

    const handleTriggerTraining = () => {
        if (status?.is_training) {
            return;
        }
        setShowConfirm(true);
    };

    const confirmTrigger = () => {
        triggerTraining.mutate();
        setShowConfirm(false);
    };

    if (isLoading) {
        return (
            <Card className="p-6 border-0 shadow-lg">
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: adminColors.primary[500] }} />
                </div>
            </Card>
        );
    }

    if (!status) {
        return (
            <Card className="p-6 border-0 shadow-lg bg-red-50">
                <p className="text-red-600 text-center">{t('admin.recommendation.trainingControl.unableToLoad')}</p>
            </Card>
        );
    }

    return (
        <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="p-3 rounded-xl"
                        style={{
                            background: status.is_training
                                ? "linear-gradient(135deg, #F59E0B, #D97706)"
                                : "linear-gradient(135deg, #0C516F, #14B8A6)",
                        }}
                    >
                        {status.is_training ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                            <Zap className="w-6 h-6 text-white" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{t('admin.recommendation.trainingControl.title')}</h3>
                        <p className="text-sm text-gray-500">{t('admin.recommendation.trainingControl.subtitle')}</p>
                    </div>
                </div>
                <Badge
                    className="px-3 py-1 font-semibold"
                    style={{
                        background: status.is_training ? adminColors.status.warning : adminColors.status.info,
                        color: "white",
                    }}
                >
                    {status.is_training ? t('admin.recommendation.systemHealth.training').toUpperCase() : t('admin.recommendation.systemHealth.idle').toUpperCase()}
                </Badge>
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">{t('admin.recommendation.trainingControl.lastTraining')}</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: adminColors.primary[600] }}>
                        {new Date(status.last_train_time).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                        })}
                    </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">{t('admin.recommendation.trainingControl.autoRetrain')}</span>
                    </div>
                    <Badge
                        className="font-semibold"
                        style={{
                            background: status.auto_retrain_enabled
                                ? adminColors.status.success
                                : adminColors.status.error,
                            color: "white",
                        }}
                    >
                        {status.auto_retrain_enabled ? t('admin.recommendation.trainingControl.enabled') : t('admin.recommendation.trainingControl.disabled')}
                    </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">{t('admin.recommendation.trainingControl.trainingInterval')}</span>
                    </div>
                    <span className="font-bold" style={{ color: adminColors.primary[600] }}>
                        {status.train_interval_hours}{t('admin.recommendation.trainingControl.hours')}
                    </span>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                    <div className="flex items-center gap-2 mb-1">
                        <Timer className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-gray-600">{t('admin.recommendation.trainingControl.nextTrainingIn')}</span>
                    </div>
                    <p className="text-lg font-bold text-amber-700">
                        {status.next_training_in_hours !== null && status.next_training_in_hours !== undefined
                            ? `${status.next_training_in_hours.toFixed(1)} ${t('admin.recommendation.trainingControl.hours')}`
                            : 'N/A'}
                    </p>
                </div>
            </div>

            {!showConfirm ? (
                <Button
                    onClick={handleTriggerTraining}
                    disabled={status.is_training}
                    className="w-full h-12 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    style={{
                        background:
                            status.is_training
                                ? adminColors.neutral[300]
                                : adminColors.gradients.primarySoft,
                        color: "white",
                    }}
                >
                    {status.is_training ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {t('admin.recommendation.trainingControl.trainingInProgress')}
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 mr-2" />
                            {t('admin.recommendation.trainingControl.triggerManualTraining')}
                        </>
                    )}
                </Button>
            ) : (
                <div className="space-y-3">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm font-medium text-amber-900">
                            {t('admin.recommendation.trainingControl.confirmMessage')}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowConfirm(false)}
                            variant="outline"
                            className="flex-1 h-11 font-semibold"
                        >
                            {t('admin.recommendation.trainingControl.cancel')}
                        </Button>
                        <Button
                            onClick={confirmTrigger}
                            className="flex-1 h-11 font-semibold text-white"
                            style={{ background: adminColors.gradients.primarySoft }}
                        >
                            {t('admin.recommendation.trainingControl.confirm')}
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
