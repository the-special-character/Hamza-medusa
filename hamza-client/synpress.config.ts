import { defineConfig } from 'cypress';

export default defineConfig({
    userAgent: 'synpress',

    retries: {
        runMode: 0,
        openMode: 0,
    },

    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    chromeWebSecurity: true,

    viewportWidth: 1366,
    viewportHeight: 850,

    env: {
        coverage: false,
    },

    defaultCommandTimeout: 30000,
    pageLoadTimeout: 30000,
    requestTimeout: 30000,

    e2e: {
        baseUrl: 'http://localhost:8000',
        supportFile: 'cypress/support/commands.ts',
        specPattern: '**/*.cy.{js,jsx,ts,tsx}', // Changed to match typical Cypress pattern, adjust if needed
        setupNodeEvents(on, config) {
            // Define node event listeners or tasks here if needed
            // Example: on('task', { setupMetamask() { return null } });
        },
    },
});
