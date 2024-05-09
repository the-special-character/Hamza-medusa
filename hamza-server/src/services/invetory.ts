import {
    CreateInventoryItemInput,
    CreateInventoryLevelInput,
    CreateReservationItemInput,
    FilterableInventoryItemProps,
    FilterableInventoryLevelProps,
    FilterableReservationItemProps,
    FindConfig,
    IInventoryService,
    InventoryItemDTO,
    InventoryLevelDTO,
    ReservationItemDTO,
    SharedContext,
    UpdateInventoryLevelInput,
    UpdateReservationItemInput,
} from '@medusajs/types';
import { InjectEntityManager, MedusaContext } from '@medusajs/utils';

class InventoryService implements IInventoryService {
    async listInventoryItems(
        selector: FilterableInventoryItemProps,
        config?: FindConfig<InventoryItemDTO>,
        context?: SharedContext
    ): Promise<[InventoryItemDTO[], number]> {
        throw new Error('Method not implemented.');
    }
    async listReservationItems(
        selector: FilterableReservationItemProps,
        config?: FindConfig<ReservationItemDTO>,
        context?: SharedContext
    ): Promise<[ReservationItemDTO[], number]> {
        throw new Error('Method not implemented.');
    }
    async listInventoryLevels(
        selector: FilterableInventoryLevelProps,
        config?: FindConfig<InventoryLevelDTO>,
        context?: SharedContext
    ): Promise<[InventoryLevelDTO[], number]> {
        throw new Error('Method not implemented.');
    }
    async retrieveInventoryItem(
        inventoryItemId: string,
        config?: FindConfig<InventoryItemDTO>,
        context?: SharedContext
    ): Promise<InventoryItemDTO> {
        throw new Error('Method not implemented.');
    }
    async retrieveInventoryLevel(
        inventoryItemId: string,
        locationId: string,
        context?: SharedContext
    ): Promise<InventoryLevelDTO> {
        throw new Error('Method not implemented.');
    }
    async retrieveReservationItem(
        reservationId: string,
        context?: SharedContext
    ): Promise<ReservationItemDTO> {
        throw new Error('Method not implemented.');
    }
    async createReservationItem(
        input: CreateReservationItemInput,
        context?: SharedContext
    ): Promise<ReservationItemDTO> {
        throw new Error('Method not implemented.');
    }
    async createInventoryItem(
        input: CreateInventoryItemInput,
        context?: SharedContext
    ): Promise<InventoryItemDTO> {
        throw new Error('Method not implemented.');
    }
    async createInventoryLevel(
        data: CreateInventoryLevelInput,
        context?: SharedContext
    ): Promise<InventoryLevelDTO> {
        throw new Error('Method not implemented.');
    }
    async updateInventoryLevel(
        inventoryItemId: string,
        locationId: string,
        update: UpdateInventoryLevelInput,
        context?: SharedContext
    ): Promise<InventoryLevelDTO> {
        throw new Error('Method not implemented.');
    }
    async updateInventoryItem(
        inventoryItemId: string,
        input: CreateInventoryItemInput,
        context?: SharedContext
    ): Promise<InventoryItemDTO> {
        throw new Error('Method not implemented.');
    }
    async updateReservationItem(
        reservationItemId: string,
        input: UpdateReservationItemInput,
        context?: SharedContext
    ): Promise<ReservationItemDTO> {
        throw new Error('Method not implemented.');
    }
    async deleteReservationItemsByLineItem(
        lineItemId: string,
        context?: SharedContext
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async deleteReservationItem(
        reservationItemId: string | string[],
        context?: SharedContext
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async deleteInventoryItem(
        inventoryItemId: string,
        context?: SharedContext
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async deleteInventoryItemLevelByLocationId(
        locationId: string,
        context?: SharedContext
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async deleteReservationItemByLocationId(
        locationId: string,
        context?: SharedContext
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async deleteInventoryLevel(
        inventoryItemId: string,
        locationId: string,
        context?: SharedContext
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async adjustInventory(
        inventoryItemId: string,
        locationId: string,
        adjustment: number,
        context?: SharedContext
    ): Promise<InventoryLevelDTO> {
        throw new Error('Method not implemented.');
    }
    async confirmInventory(
        inventoryItemId: string,
        locationIds: string[],
        quantity: number,
        context?: SharedContext
    ): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async retrieveAvailableQuantity(
        inventoryItemId: string,
        locationIds: string[],
        context?: SharedContext
    ): Promise<number> {
        throw new Error('Method not implemented.');
    }
    async retrieveStockedQuantity(
        inventoryItemId: string,
        locationIds: string[],
        context?: SharedContext
    ): Promise<number> {
        throw new Error('Method not implemented.');
    }
    async retrieveReservedQuantity(
        inventoryItemId: string,
        locationIds: string[],
        context?: SharedContext
    ): Promise<number> {
        throw new Error('Method not implemented.');
    }
}

export default InventoryService;
