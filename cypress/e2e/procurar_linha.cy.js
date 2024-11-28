describe("teste 'achar por linha'", () => {
    const cleanupAndSetupData = () => {
        cy.request('GET', 'http://127.0.0.1:8000/cleanup_db/').then(() => {
            cy.clearCookies(); // Limpa cookies
            cy.clearLocalStorage(); // Limpa o localStorage
            cy.visit('http://127.0.0.1:8000/'); // Visitar a URL inicial
        });
    };

    const registerUser = () => {
        cy.get('.register-link').click();
        cy.get('#username').type('cesar.school');
        cy.get('#email').type("bas@cesar.school");
        cy.get('#password').type("1234");
        cy.get('#confirm-password').type("1234");
        cy.get('.submit-button').click();
    };

    beforeEach(() => {
        cleanupAndSetupData(); // Limpa e prepara o banco de dados antes de cada teste
    });

    it('cenario1 - busca encontrada', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/verculturas/"] ').click();
        cy.get('.parte-direita').click();
        cy.get('#searchInput').type("2");
        cy.get('.btn').click();
        cy.wait(2000);
    });

    it('cenario2 - busca não encontrada', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/verculturas/"] ').click();
        cy.get('.parte-direita').click();
        cy.get('#searchInput').type("tomate");
        cy.get('.btn').click();
        cy.wait(2000);
    });


});
