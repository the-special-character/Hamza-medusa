import { defineConfig } from 'cypress';

export default defineConfig({
    userAgent: 'synpress',
    retries: {
        runMode: 0,
        openMode: 0,
    },
    chromeWebSecurity: true,
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 30000,
    requestTimeout: 30000,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    viewportWidth: 1366,
    viewportHeight: 850,
    env: {
        coverage: false, // Synpress coverage setting
        codeCoverage: {
            url: '/api/__coverage__', // original Cypress env setting
        },
    },
    e2e: {
        supportFile: 'cypress/support/index.js',
        baseUrl: 'http://localhost:8000', // using the Cypress base URL as it might be the primary
        specPattern: 'cypress/e2e/*.cy.{js,jsx,ts,tsx}', // updated to include TS and JSX files
        setupNodeEvents(on, config) {
            // Include plugins or other setup code here
        },
    },
});
