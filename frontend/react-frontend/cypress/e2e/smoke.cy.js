describe("Smoke", () => {
  it("can open pages", () => {
    cy.visit("/");
    cy.visit("/login");
    cy.location("pathname").should("eq", "/login");

    cy.visit("/register");
    cy.location("pathname").should("eq", "/register");
  });
});
