export default function CuisineFeatures() {
    const features = [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
        title: "Street-Food Paradise",
        description: "A city where every corner bursts with sizzling flavors—from night-market bites to seaside grills."
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
        title: "Heritage in Every Bowl",
        description: "Generations-old recipes keep the soul of Central Vietnam alive in every noodle and broth."
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
        title: "Sea-to-Table Freshness",
        description: "Daily catches from the East Sea bring unmatched freshness to iconic seafood dishes."
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
        title: "Flavors of East-West",
        description: "Classic Vietnamese taste meets global influence, crafting bold and unique experiences."
      }
    ];
  
    return (
      <div className= "py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.id} 
                className="relative group"
              >
                {/* Card Container */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
  
                  {/* Content */}
                  <div className="p-6 ">
                    <h3 className="text-gray-800 font-bold text-xl mb-3 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-center">
                      {feature.description}
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