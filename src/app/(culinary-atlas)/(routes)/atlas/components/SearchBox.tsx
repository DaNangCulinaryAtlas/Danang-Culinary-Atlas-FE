import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

export default function SearchBox() {
    const [searchQuery, setSearchQuery] = useState('Grilled Meat');
    return(
        <div className="relative mb-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants..."
            className="w-full px-4 py-6 pr-12 border border-gray-200 rounded-xl "
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
    )
}