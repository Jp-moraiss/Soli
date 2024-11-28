describe("teste 'meu histórico'", () => {
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

    // Captura exceções não tratadas
    Cypress.on('uncaught:exception', (err, runnable) => {
        console.error('Erro não tratado detectado:', err);
        return false; // Evita falhas automáticas nos testes
    });

    beforeEach(() => {
        cleanupAndSetupData(); // Limpa e prepara o banco de dados antes de cada teste
    });

    it('cenario1 - buscar histórico', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/add/"]').click();
        cy.get('.input_cultura').select('Tomate');
        cy.get('[name="area"]').select('C');
        cy.get('[name="linha"]').select('3');
        cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
        cy.get('#data_plantio').type('2024-09-23');
        cy.get('#duracao').type('4');
        cy.get('#unidade_duracao').select('semanas');
        cy.get(':nth-child(2) > .atv > .input_number').type('10');
        cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
        cy.get(':nth-child(3) > .atv > .input_number').type('1');
        cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
        cy.get('.registrar_cultura').click();
        cy.wait(2000);
        cy.get('.user-icon > svg').click();
        cy.get('[href="/meuhistorico/"]').click();
        cy.get('#searchInput').type("tomate");
        cy.wait(2000);
    });

    it('cenario2 - buscar histórico e não encontrar', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/add/"]').click();
        cy.get('.input_cultura').select('Tomate');
        cy.get('[name="area"]').select('C');
        cy.get('[name="linha"]').select('3');
        cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
        cy.get('#data_plantio').type('2024-09-23');
        cy.get('#duracao').type('4');
        cy.get('#unidade_duracao').select('semanas');
        cy.get(':nth-child(2) > .atv > .input_number').type('10');
        cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
        cy.get(':nth-child(3) > .atv > .input_number').type('1');
        cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
        cy.get('.registrar_cultura').click();
        cy.wait(2000);
        cy.get('.user-icon > svg').click();
        cy.get('[href="/meuhistorico/"]').click();
        cy.get('#searchInput').type("alface");
        cy.wait(2000);
    });

    it('cenario3 - dar logout', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('.user-icon > svg').click();
        cy.wait(2000);
        cy.get('[href="/"]').click();
        cy.wait(2000);
    });
});
