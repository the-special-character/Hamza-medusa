import { registerOverriddenValidators } from "@medusajs/medusa"
import { StorePostAuthReq as MedusaStorePostAuthReq } from "@medusajs/medusa/dist/api/routes/store/auth";
import { IsString } from "class-validator"

class StorePostAuthReq extends MedusaStorePostAuthReq {
    @IsString()
    wallet_address: string
}

registerOverriddenValidators(StorePostAuthReq)