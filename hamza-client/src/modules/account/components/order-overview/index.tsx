'use client';

import { Order } from '@medusajs/medusa';
import { Button } from '@medusajs/ui';
import { useOrder } from 'medusa-react';

import OrderCard from '../order-card';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const OrderOverview = ({ orders }: { orders: Order[] }) => {
    console.log('ORDER OVERVIEW', orders);
    // lets go through the orders.length and map and console.log the orders
    const mapOrders = orders.map((order) => {
        console.log(`Order is ${JSON.stringify(order)}`);
        return { ...order, processed: true }; // Example of a transformation
    });

    // Filtering processed orders
    const processedOrders = mapOrders.filter((order) => order.processed);

    // Getting all order IDs from the processed orders
    const orderIds = processedOrders.map((order) => order.id);

    const first_order = useOrder(orderIds[0]);

    console.log(`First order is ${JSON.stringify(first_order)} `);
    // Logging all order IDs
    console.log(`Order IDs: ${orderIds.join(', ')}`);

    if (orders?.length) {
        return (
            <div className="flex flex-col gap-y-8 w-full bg-black text-white p-8">
                {orders.map((o) => (
                    <div
                        key={o.id}
                        className="border-b border-gray-200 pb-6 last:pb-0 last:border-none bg-black text-white"
                    >
                        <OrderCard order={o} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center gap-y-4 bg-black text-white p-8">
            <h2 className="text-large-semi">Nothing to see here</h2>
            <p className="text-base-regular">
                You don&apos;t have any orders yet, let us change that {':)'}
            </p>
            <div className="mt-4">
                <LocalizedClientLink href="/" passHref>
                    <Button>Continue shopping</Button>
                </LocalizedClientLink>
            </div>
        </div>
    );
};

export default OrderOverview;
