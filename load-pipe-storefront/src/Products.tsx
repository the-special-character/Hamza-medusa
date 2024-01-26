"use client"
import { Product } from "@medusajs/medusa"
import { useProducts } from "medusa-react"

const Products = () => {
  const { products, isLoading } = useProducts()

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <ul>
      {products?.map((product: Product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  )
}

export default Products
