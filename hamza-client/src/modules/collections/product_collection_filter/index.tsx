import React from 'react'
import { useAdminCollection } from 'medusa-react'

// TODO: Refactor goals to use <Suspense .. /> to wrap collection && <SkeletonProductGrid /> for loading state
const ProductCollections = () => {
    const { collection, isLoading } = useAdminCollection(
        'pcol_01HSGAMXDJD725MR3VSW631SN2'
    )

    return (
        <div>
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
