import React, {useEffect, useState} from 'react';

import {retrieveCollection} from '../retrieve_collection/index'

const ProductCollectionFilter = (collectionId: string) => {
    const [collection, setCollection] = useState('Demo')

    const collectionExample = retrieveCollection(collectionId)
    console.log("Collection Example: ", collectionExample)

    // useEffect(() => {
    //     try {
    //         const collection = retrieveCollection(collectionId)
    //         setCollection(collection)
    //     } catch (e) {
    //         console.error('Failed to fetch collection: ', e)
    //     }
    // }, [collectionId]);
    // return (
    //     <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
    //         {collection ? (
    //                 <div className="mb-8 text-2xl-semi">
    //                     <h1>{collection.title}</h1>
    //                     <p>{collection.description}</p>
    //                 </div>
    //             ) :
    //             <div>Loading...</div>
    //         }
    //     </div>
    // )
}