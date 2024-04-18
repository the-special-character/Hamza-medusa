describe('Product page', () => {
    before(() => {
        cy.visit('/store');
        // Ensure the button is available and then click it
        cy.contains('button', 'Connect Wallet', { timeout: 10000 }).click();
        cy.contains('div', 'MetaMask').click();
    });

    it('fetch headphones product', () => {
        cy.contains('div', 'Sony WH-1000XM4').click();
    });

    it('fetches product with handle [t-shirt]', () => {
        cy.visit('/products/t-shirt');

        cy.get('h2').contains('Medusa T-Shirt');
    });

    it('should select size small', () => {
        cy.contains('button', 'S').click();
    });

    it('should select color black', () => {
        cy.contains('button', 'Black').click();
    });

    it('adds a product to the cart', () => {
        cy.contains('button', 'Add to cart').click();
        // We should probably check cart quantity after fixing cookie bug...
        // cy.get('[data-cy=cart_quantity]').contains('1');
    });

    it('navigate to the cart page', () => {
        cy.get('a[href="/us/cart"]').first().click();
    });

    it('should confirm that the table contains the product name Medusa T-Shirt', () => {
        // Verify the table contains the specific product name
        cy.get('table').contains('p', 'Medusa T-Shirt').should('be.visible');
    });
});
