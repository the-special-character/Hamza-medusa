// TODO: Implement payment processor with web3 https://docs.medusajs.com/modules/carts-and-checkout/backend/add-payment-provider
// This is a TEMPLATE
import { AbstractPaymentProcessor, PaymentProcessorError, PaymentSessionStatus } from "@medusajs/medusa";

// We're using client to connect to the third-party provider's API
class Web3Payment extends AbstractPaymentProcessor {
  static identifier = "web3-payment";
  // methods here...
  constructor(container, options) {
    super(container)
    // you can access options here

    // you can also initialize a client that
    // communicates with a third-party service.
    this.client = new Client(options)

  }

export default Web3Payment;
