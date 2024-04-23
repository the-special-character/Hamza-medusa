import React from 'react';
import { useRegion } from 'medusa-react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

import { useRegions } from 'medusa-react';

// const { regions, isLoading } = useRegions()
//         {regions?.length && (
//                 {regions.map((region) => (
//                     <li key={region.id}>
//                         {region.name}

const WishlistPopoverItem = ({ item }) => {
    return (
        <LocalizedClientLink
            href={`/products/${item.handle}`}
            className="font-normal"
        >
            <div className="flex hover:bg-gray-100">
                <div className="overflow-hidden rounded-md mr-4">
                    <img
                        className="w-16 h-auto"
                        src={item.thumbnail}
                        alt={item.title}
                    />
                </div>
                <div className="flex items-center">
                    <div>
                        <p className="font-medium text-sm">{item.title}</p>
                    </div>
                </div>
            </div>
        </LocalizedClientLink>
    );
};

export default WishlistPopoverItem;
