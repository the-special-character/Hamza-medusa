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
import { SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getProductPrice } from '@lib/util/get-product-price';
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

    console.log(products);

    return (
        <div className="text-white">
            <Suspense fallback={<SkeletonProductGrid />}>
                {data && (
                    <div>
                        <div className="mb-8 text-2xl-semi">
                            <h1>{products.title}</h1>
                        </div>
                        <SimpleGrid
                            minChildWidth={{
                                base: '100%',
                                sm: '50%',
                                lg: '25%',
                            }}
                            spacing="20px"
                        >
                            {products.map((product) => (
                                <LocalizedClientLink
                                    key={product.id}
                                    href={`/products/${product.handle}`}
                                    className="group"
                                >
                                    <div key={product.id}>
                                        <Thumbnail
                                            thumbnail={product.thumbnail}
                                            size="small"
                                        />
                                        <div className="flex txt-compact-medium mt-4 ">
                                            <Text className="text-ui-fg-subtle font-bold text-white ">
                                                {product.title}
                                            </Text>
                                            <div className="flex items-center gap-x-2 "></div>
                                        </div>
                                    </div>
                                </LocalizedClientLink>
                            ))}
                        </SimpleGrid>
                    </div>
                )}
            </Suspense>
        </div>
    );
};

export default ProductCollections;
