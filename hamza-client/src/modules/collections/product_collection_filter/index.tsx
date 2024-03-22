import React from 'react'
import { useAdminCollection } from 'medusa-react'

// TODO: Refactor goals to use <Suspense .. /> to wrap collection && <SkeletonProductGrid /> for loading state

type Props = {
    collectionId: string
}
const ProductCollections = ({ collectionId }: Props) => {
    const { collection, isLoading } = useAdminCollection(collectionId)

    return (
        <div className="text-white">
            {isLoading && <span>Loading...</span>}
            {collection && (
                <>
                    {collection.products.map((product) => (
                        <div key={product.id}>
                            <span>{product.title}</span>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default ProductCollections
