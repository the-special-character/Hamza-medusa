import {Text, clx} from "@medusajs/ui"

import {getCategoriesList, getCollectionsList} from "@lib/data"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "../../components/medusa-cta"

const fetchCollections = async () => {
    const {collections} = await getCollectionsList()
    return collections
}

const fetchCategories = async () => {
    const {product_categories} = await getCategoriesList()
    return product_categories
}

export default async function Footer() {
    const productCollections = await fetchCollections().then(
        (collections) => collections
    )
    const productCategories = await fetchCategories().then(
        (categories) => categories
    )
    return (
        <footer className="border-t border-ui-border-base w-full dark:bg-black text-white">
            <div className="content-container flex flex-col w-full">

                <div className="flex flex-col lg:flex-row items-start justify-between py-12">

                    {/* Left Column for Links */}
                    <div className="flex flex-col gap-y-4">
                        <Text className="font-galindo text-md font-bold">Processing and Shipping</Text>
                        <Text className="font-galindo text-md font-bold">Our Copyrights Policy</Text>
                        <Text className="font-galindo text-md font-bold">Our Return Policy</Text>
                        <Text className="font-galindo text-md font-bold">Catalog</Text>
                        <Text className="font-galindo text-md font-bold">Articles</Text>
                        <Text className="font-galindo text-md font-bold">Privacy Policy</Text>
                        <Text className="font-galindo text-md font-bold">Terms and Conditions</Text>
                        {/* List of policies and services links */}
                    </div>

                    {/* Middle Column for Contact Information */}
                    <div className="flex flex-col gap-y-4">
                        <Text className="font-galindo text-lg font-bold">CONTACT US</Text>
                        <Text className="font-galindo text-md">+1-888-417-8278</Text>
                        <Text className="font-galindo text-md">team@hamza.biz</Text>
                        <Text className="font-galindo text-md font-bold">Monday-Friday</Text>
                        <Text className="font-galindo text-md">10:00 PM - 7:00 AM</Text>
                        <br/>
                        <Text className="font-galindo text-md">1STAG INT LTD</Text>
                        <Text className="font-galindo text-md">Agias Fylaxeos 73, 2nd Floor</Text>
                        <Text className="font-galindo text-md">Limassol, 3087, Cyprus</Text>
                        {/* Contact details */}
                    </div>

                    {/* Right Column for Additional Services */}
                    <div className="flex flex-col gap-y-4">
                        <Text className="font-galindo text-md font-semibold">Free Shipping Worldwide</Text>
                        <Text className="font-galindo text-md font-semibold">365 DAYS Money Back Guarantee</Text>
                        <Text className="font-galindo text-md font-semibold">Included Lifetime Warranty</Text>
                        <Text className="font-galindo text-md font-semibold">Certificate of Authenticity</Text>
                        {/* List additional services or policies */}
                    </div>

                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center py-4">
                    {/* Footer Branding */}
                    <Text className="text-4xl font-bold">
                        HAMZA
                    </Text>

                    {/* Social Icons */}
                    <div>
                        <Text className="font-galindo text-sm">&copy; 2024 HAMZA. All rights reserved.</Text>
                    </div>
                </div>

                <div className="text-center py-4">
                    <Text className="font-galindo text-sm">ICONS PLACEHOLDER</Text>
                </div>

            </div>
        </footer>
    )
}
