import React from "react"
import {useAdminCollections} from "medusa-react"

const ProductCollections = () => {
    const {collections, isLoading} = useAdminCollections()

    return (
        <div>
            {isLoading && <span>Loading...</span>}
            {collections && !collections.length && <span>
        No Product Collections
      </span>}
            {collections && collections.length > 0 && (
                <ul>
                    {collections.map((collection) => (
                        <ul>
                            <li key={collection.id}>{collection.title}</li>
                            <li>
                                {collection.products.map((product) => (
                                    <ul>
                                        <li key={product.id}>{product.title}</li>
                                    </ul>
                                ))}
                            </li>
                        </ul>

                    ))}
                </ul>
            )}
        </div>
    )
}

export default ProductCollections