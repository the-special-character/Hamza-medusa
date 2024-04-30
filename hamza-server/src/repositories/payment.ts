import { Payment } from "../models/payment"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import {
  PaymentRepository as MedusaPaymentRepository,
} from "@medusajs/medusa/dist/repositories/payment"

export const PaymentRepository = dataSource
  .getRepository(Payment)
  .extend({
    ...Object.assign(
      MedusaPaymentRepository, 
      { target: Payment }
    ),
  })

export default PaymentRepository