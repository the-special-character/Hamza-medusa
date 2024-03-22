import { initialize as initializeProductModule } from '@medusajs/product'

export async function retrieveCollection(id: string) {
    const productModule = await initializeProductModule()

    const collection = await productModule.retrieveCollection(id)

    // do something with the product collection or return it
}
