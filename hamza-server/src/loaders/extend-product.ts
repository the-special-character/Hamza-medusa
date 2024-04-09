// export default async function () {
//   const imports = (await import(
//     "@medusajs/medusa/dist/api/routes/store/products/index"
//   )) as any;
//   imports.allowedStoreProductsFields = [
//     ...imports.allowedStoreProductsFields,
//     "store_id",
//   ];
//   imports.defaultStoreProductsFields = [
//     ...imports.defaultStoreProductsFields,
//     "store_id",
//   ];
// }

// ^^ This works for adding store_id to the /store route but following
// the same pattern for /admin route doesn't work. This is because the
// /admin route is not using the registerOverriddenValidators function?

export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/products/index"
  )) as any;
  imports.allowedAdminProductFields = [
    ...imports.allowedAdminProductFields,
    "store_id",
  ];
  imports.defaultAdminProductFields = [
    ...imports.defaultAdminProductFields,
    "store_id",
  ];
}
