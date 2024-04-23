import React from 'react';
import { Suspense } from 'react';
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid';
import Thumbnail from '@modules/products/components/thumbnail';
import { Text } from '@medusajs/ui';
import PreviewPrice from '@modules/products/components/product-preview/price';
import { ProductPreviewType } from 'types/global';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { useProducts } from 'medusa-react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
// TODO: Refactor goals to use <Suspense .. /> to wrap collection && <SkeletonProductGrid /> for loading state

type Props = {
    vendorName: string;
};
const ProductCollections = ({ vendorName }: Props) => {
    const { data, error, isLoading } = useQuery(
        ['products', { vendor: vendorName }],
        () =>
            axios.get(
                `http://localhost:9000/store/custom/products?store_name=${vendorName}`
            )
    );

    if (isLoading) {
        return null; // Suspense will handle the loading fallback.
    }

    if (error) return <div>Error: {error?.message}</div>;

    const products = data?.data;

    // console.log(products);

    return (
        <div className="text-white">
            <Suspense fallback={<SkeletonProductGrid />}>
                {data && (
                    <div>
                        <div className="mb-8 text-2xl-semi">
                            <h1>{products.title}</h1>
                        </div>
                        {products.map((product) => (
                            <div key={product.id}>
                                <Thumbnail
                                    thumbnail={product.thumbnail}
                                    size="small"
                                />
                                <div className="flex txt-compact-medium mt-4 justify-between">
                                    <Text className="text-ui-fg-subtle font-bold text-white ">
                                        {product.title}
                                    </Text>
                                    <div className="flex items-center gap-x-2 "></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Suspense>
        </div>
    );
};

export default ProductCollections;
