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

    it('cenario1 - adicionar diário de texto e visualizar', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('nav > :nth-child(2) > a').click();
        cy.wait(2000);
        cy.get('#datepicker').click();
        cy.get('.today').click();
        cy.wait(1000);
        cy.get('.diario-textarea').type("colher tomate");
        cy.wait(1000);
        cy.get('button').click();
        cy.get('#datepicker').click();
        cy.get('.today').click();
        cy.wait(2000);
    });

    it('cenario2 - adicionar diário com imagem e visualizar', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('nav > :nth-child(2) > a').click();
        cy.wait(2000);
        cy.get('#datepicker').click();
        cy.get('.today').click();
        cy.wait(1000);
        cy.get('.file-input-label').click();
        cy.wait(1000);
        cy.get('button').click();
        cy.get('#datepicker').click();
        cy.get('.today').click();
        cy.wait(2000);
    });

});