/// <reference types="cypress" />

describe("example mui calc app", () => {

    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit("/index.html");
    });

    it("displays empty fields by default", () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        cy.get("#left").should("have.value", "");
        cy.get("#right").should("have.value", "");
        cy.get("#result").should("have.value", "");
    });

    it("can add 1 + 1", () => {

        cy.get("#left").type("1");
        cy.get("#right").type("1");

        cy.get("button:contains('Calculate')").click();

        cy.wait(250);

        cy.get("#left").should("have.value", "1");
        cy.get("#right").should("have.value", "1");
        cy.get("#result").should("have.value", "2");
    });
});
