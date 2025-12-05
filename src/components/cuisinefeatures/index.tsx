import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function CuisineFeatures() {
  const { t } = useTranslation();

  const features = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      titleKey: "home.cuisineFeatures.feature1Title",
      descriptionKey: "home.cuisineFeatures.feature1Description"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
      titleKey: "home.cuisineFeatures.feature2Title",
      descriptionKey: "home.cuisineFeatures.feature2Description"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
      titleKey: "home.cuisineFeatures.feature3Title",
      descriptionKey: "home.cuisineFeatures.feature3Description"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      titleKey: "home.cuisineFeatures.feature4Title",
      descriptionKey: "home.cuisineFeatures.feature4Description"
    }
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative group h-full"
            >
              {/* Card Container */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                  <Image
                    width={400}
                    height={300}
                    src={feature.image}
                    alt={t(feature.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-gray-800 font-bold text-xl mb-3 text-center">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-center flex-grow">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}