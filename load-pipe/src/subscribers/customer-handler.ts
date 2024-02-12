import {
  type SubscriberConfig,
  type SubscriberArgs,
  type ConfigModule,
} from "@medusajs/medusa";
import CustomerService from "../services/customer";

export default async function customerHandler({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs) {
  const configModule: ConfigModule = container.resolve("configModule");
}

export const config: SubscriberConfig = {
  event: CustomerService.Events.CREATED,
  context: {
    subscriberId: "customer-handler",
  },
};
