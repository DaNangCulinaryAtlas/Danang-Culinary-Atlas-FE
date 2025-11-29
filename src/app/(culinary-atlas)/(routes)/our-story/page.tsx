'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function OurStory() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-4 md:px-8 lg:px-16 bg-linear-to-br from-blue-50 via-white to-blue-50">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        {t('ourStory.title')} <span className="text-[#44BACA]">Danang Culinary Atlas</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {t('ourStory.subtitle')}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-4xl mx-auto">
                    {/* Section 1: The Problem */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('ourStory.problemTitle')}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            {t('ourStory.problemDescription1')}
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {t('ourStory.problemDescription2')}
                        </p>
                    </div>

                    {/* Section 2: Our Mission */}
                    <div className="mb-16 bg-blue-50 p-8 rounded-2xl border-l-4 border-[#44BACA]">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('ourStory.missionTitle')}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            {t('ourStory.missionDescription1')} <span className="font-semibold text-[#44BACA]">Danang Culinary Atlas</span> {t('ourStory.missionDescription1Part2')}
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {t('ourStory.missionDescription2')}
                        </p>
                    </div>

                    {/* Section 3: Our Values */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('ourStory.valuesTitle')}</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white border-2 border-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#44BACA] rounded-full flex items-center justify-center mb-4">
                                    <span className="text-white text-xl font-bold">🗺️</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('ourStory.values.value1.title')}</h3>
                                <p className="text-gray-700">{t('ourStory.values.value1.description')}</p>
                            </div>

                            <div className="bg-white border-2 border-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#44BACA] rounded-full flex items-center justify-center mb-4">
                                    <span className="text-white text-xl font-bold">🔍</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('ourStory.values.value2.title')}</h3>
                                <p className="text-gray-700">{t('ourStory.values.value2.description')}</p>
                            </div>

                            <div className="bg-white border-2 border-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#44BACA] rounded-full flex items-center justify-center mb-4">
                                    <span className="text-white text-xl font-bold">⭐</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('ourStory.values.value3.title')}</h3>
                                <p className="text-gray-700">{t('ourStory.values.value3.description')}</p>
                            </div>

                            <div className="bg-white border-2 border-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#44BACA] rounded-full flex items-center justify-center mb-4">
                                    <span className="text-white text-xl font-bold">✨</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('ourStory.values.value4.title')}</h3>
                                <p className="text-gray-700">{t('ourStory.values.value4.description')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Our Journey */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('ourStory.journeyTitle')}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            {t('ourStory.journeyDescription1')}
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {t('ourStory.journeyDescription2')}
                        </p>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-linear-to-r from-[#44BACA] to-[#2B7A8E] text-white p-12 rounded-2xl text-center">
                        <h2 className="text-3xl font-bold mb-4">{t('ourStory.ctaTitle')}</h2>
                        <p className="text-xl mb-8 opacity-95">
                            {t('ourStory.ctaDescription')}
                        </p>
                        <a href="/atlas" className="inline-block bg-white text-[#44BACA] font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors">
                            {t('ourStory.ctaButton')}
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer Message */}
            <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50 text-center">
                <div className="max-w-4xl mx-auto">
                    <p className="text-gray-600 text-lg">
                        {t('ourStory.footerMessage')}
                    </p>
                </div>
            </section>
        </div>
    );
}
