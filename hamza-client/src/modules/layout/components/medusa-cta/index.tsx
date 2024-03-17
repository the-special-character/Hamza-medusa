import { Text } from "@medusajs/ui"

import Medusa from "../../../common/icons/medusa"
import NextJs from "../../../common/icons/nextjs"

const MedusaCTA = () => {
  return (
    <Text className="font-galindo flex gap-x-2 txt-compact-small-plus items-center">
        © {new Date().getFullYear()} Hamza.biz. All rights reserved.
    </Text>
  )
}

export default MedusaCTA
