'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Order } from '@medusajs/medusa';
import { Button } from '@medusajs/ui';
import OrderCard from '../order-card';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

// Define a type that extends the Order type with any additional data
interface DetailedOrder extends Order {
    details?: any; // Further specify if you have the structure of the details
}

const OrderOverview = ({ orders }: { orders: Order[] }) => {
    // Initialize state with the correct type
    const [detailedOrders, setDetailedOrders] = useState<DetailedOrder[]>([]);
    console.log('Orders: ', orders);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const details = await Promise.all(
                orders.map((order) =>
                    axios
                        .post('http://localhost:9000/custom/order', {
                            cart_id: order.cart_id, // Using cart_id instead of order_id
                        })
                        .then((response) => ({
                            ...order,
                            details: response.data.order, // Assuming response.data.order is the structure you expect
                        }))
                        .catch((error) => {
                            console.error(
                                'Error fetching order details:',
                                error
                            );
                            return { ...order }; // Return order without details in case of an error
                        })
                )
            );
            setDetailedOrders(details);
        };

        if (orders.length > 0) {
            fetchOrderDetails();
        }
    }, [orders]);

    if (detailedOrders?.length) {
        console.log('Detailed Orders: ', detailedOrders);
        return (
            <div className="flex flex-col gap-y-8 w-full bg-black text-white p-8">
                {detailedOrders.map((order) => (
                    <div
                        key={order.id}
                        className="border-b border-gray-200 pb-6 last:pb-0 last:border-none bg-black text-white"
                    >
                        <OrderCard order={order} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center gap-y-4 bg-black text-white p-8">
            <h2 className="text-large-semi">Nothing to see here</h2>
            <p className="text-base-regular">
                You don't have any orders yet, let us change that {':)'}
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
