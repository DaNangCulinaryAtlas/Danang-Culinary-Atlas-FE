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
