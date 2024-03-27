import React from 'react'
import { useAdminCollection } from 'medusa-react'
import { Suspense } from 'react'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import Thumbnail from '@modules/products/components/thumbnail'
import { Text } from '@medusajs/ui'
import PreviewPrice from '@modules/products/components/product-preview/price'
import { ProductPreviewType } from 'types/global'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

// TODO: Refactor goals to use <Suspense .. /> to wrap collection && <SkeletonProductGrid /> for loading state

type Props = {
    collectionId: string
}
const ProductCollections = ({ collectionId }: Props) => {
    const { collection, isLoading } = useAdminCollection(collectionId)

    return (
        <div className="text-white">
            <Suspense fallback={<SkeletonProductGrid />}>
                {collection && (
                    <div>
                        <div className="mb-8 text-2xl-semi">
                            <h1>{collection.title}</h1>
                        </div>
                        {collection.products.map((product) => (
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
    )
}

export default ProductCollections
