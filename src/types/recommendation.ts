export interface RecommendationRequest {
    hour: number;
    k: number;
    target_type: 'dish' | 'restaurant';
    user_id: string;
}

export interface RecommendationItem {
    id: string;
    score: number;
    rank: number;
}

export interface RecommendationResponse {
    user_id: string;
    context_hour: number;
    context_label: string;
    target_type: 'dish' | 'restaurant';
    recommendations: RecommendationItem[];
}

// Health Check Types
export interface HealthCheckResponse {
    status: string;
    version: string;
    model_loaded: boolean;
    training_status: string;
    last_training: string;
}

// Training Status Types
export interface TrainingStatusResponse {
    is_training: boolean;
    last_train_time: string;
    auto_retrain_enabled: boolean;
    train_interval_hours: number;
    next_training_in_hours: number;
}

// Metrics Types
export interface MetricSet {
    "Recall@10": number;
    "NDCG@10": number;
}

export interface LatestMetricsResponse {
    val: MetricSet;
    test_dish: MetricSet;
    test_rest: MetricSet;
    timestamp: string;
}

export interface TrainingHistoryItem {
    val: MetricSet;
    test_dish: MetricSet;
    test_rest: MetricSet;
    timestamp: string;
}

export interface TrainingHistoryResponse {
    total_trainings: number;
    history: TrainingHistoryItem[];
}

// Training Trigger Types
export interface TrainingTriggerResponse {
    status: string;
    message: string;
}
