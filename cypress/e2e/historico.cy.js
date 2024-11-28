describe("teste 'meu histórico'", () => {
    const cleanupAndSetupData = () => {
        cy.request('GET', 'http://127.0.0.1:8000/cleanup_db/').then(() => {
            cy.clearCookies(); // Limpa cookies
            cy.clearLocalStorage(); // Limpa o localStorage
            cy.visit('http://127.0.0.1:8000/'); // Visitar a URL inicial
        });
    };

    beforeEach(() => {
        cleanupAndSetupData(); // Limpa e prepara o banco de dados antes de cada teste
    });

    it('cenario1 - busca encontrada', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.get('.menu > a > svg').should('be.visible').click();
        cy.get('#searchInput').type("tomate");
        cy.get('.result-item').should('contain', 'tomate'); // Aguarda o resultado
    });

    it('cenario2 - busca não encontrada', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.get('.menu > a > svg').should('be.visible').click();
        cy.get('#searchInput').type("brocolis");
        cy.get('.no-results').should('be.visible'); // Aguarda o resultado
    });
});
