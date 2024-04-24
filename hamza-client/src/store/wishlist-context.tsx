// import React, {createContext, ReactNode, useEffect, useState} from "react"
// import { useMedusa, useRegion } from "medusa-react"
// import { useQuery, useMutation } from '@tanstack/react-query';
// import axios from "axios";
//
// type WishlistItem = {
//     id: string
//     product_id: string
//     wishlist_id: string
// }
//
// type Wishlist = {
//     id?: string
//     items: WishlistItem[]
// }
//
// type WishlistContextType = {
//     wishlist: Wishlist;
//     loading: boolean;
//     actions: {
//         addItem: (product_id: string) => Promise<void>;
//         removeItem: (id: string) => Promise<void>;
//     };
// };
//
// const defaultWishlistContext: WishlistContextType = {
//     wishlist: {
//         items: [],
//     },
//     loading: false,
//     actions: {
//         addItem: async () => {},
//         removeItem: async () => {},
//     },
// }
//
// const WishlistContext = createContext<WishlistContextType>(defaultWishlistContext)
// export default WishlistContext
//
// interface WishlistProviderProps {
//     children: ReactNode;
//     productIds: string[];
//     countryCode: string;
// }
//
//
// const WISHLIST_ID = "wishlist_id"
// const isBrowser = typeof window !== "undefined"
//
//
// export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children, productIds, countryCode }) => {
//     const [wishlist, setWishlist] = useState<Wishlist>(defaultWishlistContext.wishlist)
//     const [loading, setLoading] = useState<boolean>(defaultWishlistContext.loading)
//     const { region } = useRegion(countryCode)
//     const { client } = useMedusa()
//
//     const setWishlistItem = (wishlist: Wishlist) => {
//         if (isBrowser) {
//             localStorage.setItem(WISHLIST_ID, wishlist.id || '')
//         }
//         setWishlist(wishlist)
//     }
//
//     useEffect(() => {
//         const initializeWishlist = async () => {
//             const existingWishlistId = isBrowser
//                 ? localStorage.getItem(WISHLIST_ID)
//                 : null
//
//             if (existingWishlistId && existingWishlistId !== "undefined") {
//                 try {
//                     const query = ['wish', { region: region?.id }]
//                     const fetchWishlist = () => axios.get(`/store/wishlist${existingWishlistId}`)
//
//                     const { data, error: error, isLoading: boolean } = useQuery(query, fetchWishlist)
//
//                     if (data) {
//                         setWishlistItem(data?.data)
//                         return
//                     }
//                 } catch (e) {
//                     localStorage.setItem(WISHLIST_ID, '')
//                 }
//             }
//             initializeWishlist()
//         }, [region])
//
//             if (region) {
//                 try{
//                     const query = ['wish', { region: region.id }]
//                     const fetchWishlist = () => axios.get(`/store/wishlist`, {
//                     params: {
//                         region: region.id,
//                     },
//                 })
//
//                     const {data, error, isLoading} = useQuery(query, fetchWishlist)
//                     if (data){
//                         setWishlistItem(data?.data)
//                         setLoading(false)
//                     } else if (error){
//                         console.log(error)
//                     }
//                 }
//                 catch(e){
//                     console.log(e)
//                 }
//             }
//         }
//
//
//
//     const addWishItem = (product_id: string) => {
//         setLoading(true)
//         try {
//             const query = ['item', { product_id: product_id }]
//             const fetchWishlist = () => axios.get(`/store/wishlist/${wishlist.id}/wish-item`)
//             const { data, error, isLoading } = useMutation(query, fetchWishlist)
//             setWishlistItem(data?.data)
//             setLoading(false)
//         } catch (e) {
//             console.log(e)
//         }
//     }
//
//     const removeWishItem = (product_id: string) => {
//         setLoading(true)
//         try {
//             const query = ['item', { product_id: product_id }]
//             const fetchWishlist = () => axios.get(`/store/wishlist/${wishlist.id}/wish-item/${product_id}`)
//             const { data, error, isLoading } = useMutation(query, fetchWishlist)
//             setWishlistItem(data?.data)
//             setLoading(false)
//         } catch (e) {
//             console.log(e)
//         }
//     }
//
//     return (
//         <WishlistContext.Provider value={{
//         wishlist,
//             loading,
//             actions: {
//             addItem: addWishItem,  // Assuming you implement addItem using addWishItem logic
//                 removeItem: removeWishItem,
//         }
//     }}>
//     {children}
//     </WishlistContext.Provider>
// );
//
//
// }
