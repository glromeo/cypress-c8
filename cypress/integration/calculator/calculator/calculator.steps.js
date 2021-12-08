/// <reference types="cypress" />

import { Given, And, When, Then } from "cypress-cucumber-preprocessor/steps";

Given("I opened the calculator app", function () {
    cy.visit("/index.html");
});

And("the calculator is ready", function () {
    cy.get("#left").should("have.value", "");
    cy.get("#right").should("have.value", "");
    cy.get("#result").should("have.value", "");
});

When("I do {int} + {int}", function (left, right) {
    cy.get("#left").type(String(left));
    cy.get("#right").type(String(right));
    cy.wait(250);
    cy.get("#left").should("have.value", "1");
    cy.get("#right").should("have.value", "1");
    cy.get("button:contains('Calculate')").click();
});

Then("the result is {int}", function (result) {
    cy.get("#result").should("have.value", String(result));
});
