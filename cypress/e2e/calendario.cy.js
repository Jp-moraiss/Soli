describe("teste 'calendário'", () => {
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

    Cypress.on('uncaught:exception', (err, runnable) => {
        console.error('Erro não tratado detectado:', err);
        return false; // Evita falhas automáticas nos testes
    });

    beforeEach(() => {
        cleanupAndSetupData(); // Limpa e prepara o banco de dados antes de cada teste
    });

    it('cenario1 - adicionar', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/agenda/"]').click();
        cy.get('[type="submit"]').click();
        cy.get('#description').type("colher plantação");
        cy.get('button').click();
        cy.get('[aria-label="Novembro 27, 2024"]')
        cy.get('.today').click()
        cy.wait(2000);
    });

    it('cenario2 - editar', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/agenda/"]').click();
        cy.get('.today').click();
        cy.get('.edit-button').click();
        cy.get('#description').type(" tomate");
        cy.get('button').click();
        cy.get('.today').click();
        cy.wait(2000);
    });

    it('cenario3 - excluir', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/agenda/"]').click();
        cy.get('.today').click();
        cy.get('.delete-button').click();
        cy.wait(2000);
    });


});
