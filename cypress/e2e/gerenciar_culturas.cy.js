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

    // Captura exceções não tratadas
    Cypress.on('uncaught:exception', (err, runnable) => {
        console.error('Erro não tratado detectado:', err);
        return false; // Evita falhas automáticas nos testes
    });

    beforeEach(() => {
        cleanupAndSetupData(); // Limpa e prepara o banco de dados antes de cada teste
    });

    it('cenario1 - alterar a área', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/add/"]').click();
        cy.get('.input_cultura').select('Tomate');
        cy.get('[name="area"]').select('C');
        cy.get('[name="linha"]').select('3');
        cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
        cy.get('#data_plantio').type('2024-11-23');
        cy.get('#duracao').type('4');
        cy.get('#unidade_duracao').select('meses');
        cy.get(':nth-child(2) > .atv > .input_number').type('10');
        cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
        cy.get(':nth-child(3) > .atv > .input_number').type('1');
        cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
        cy.get('.registrar_cultura').click();
        cy.wait(2000);
        cy.get('[href="/verculturas/"]').click();  
        cy.get('.editar-btn > .fas').first().click(); 
        cy.wait(2000);
        cy.get('.cultura-area').contains('Área: C').clear().type('Área: B');
        cy.wait(2000);       
        cy.get('.confirmar-edicao > .fas').first().click();
        cy.wait(2000);
    });

    it('cenario2 - alterar as linhas', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/add/"]').click();
        cy.get('.input_cultura').select('Tomate');
        cy.get('[name="area"]').select('C');
        cy.get('[name="linha"]').select('3');
        cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
        cy.get('#data_plantio').type('2024-11-23');
        cy.get('#duracao').type('4');
        cy.get('#unidade_duracao').select('meses');
        cy.get(':nth-child(2) > .atv > .input_number').type('10');
        cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
        cy.get(':nth-child(3) > .atv > .input_number').type('1');
        cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
        cy.get('.registrar_cultura').click();
        cy.wait(2000);
        cy.get('[href="/verculturas/"]').click();  
        cy.get('.editar-btn > .fas').first().click(); 
        cy.wait(2000);
        cy.get('.cultura-linha').contains('Linhas: 3').clear().type('Linhas: 2');
        cy.wait(2000);       
        cy.get('.confirmar-edicao > .fas').first().click();
        cy.wait(2000);
    });

    it('cenario3 - alterar data de plantio', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/add/"]').click();
        cy.get('.input_cultura').select('Tomate');
        cy.get('[name="area"]').select('C');
        cy.get('[name="linha"]').select('3');
        cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
        cy.get('#data_plantio').type('2024-11-23');
        cy.get('#duracao').type('4');
        cy.get('#unidade_duracao').select('meses');
        cy.get(':nth-child(2) > .atv > .input_number').type('10');
        cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
        cy.get(':nth-child(3) > .atv > .input_number').type('1');
        cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
        cy.get('.registrar_cultura').click();
        cy.wait(2000);
        cy.get('[href="/verculturas/"]').click();  
        cy.get('.editar-btn > .fas').first().click(); 
        cy.wait(2000);
        cy.get('.data-plantio')
        .clear()
        .type('2024-11-28')
        .trigger('change');
        cy.wait(2000);       
        cy.get('.confirmar-edicao > .fas').first().click();
        cy.wait(2000);
    });

    it('cenario4 - alterar data de colheita', () => {
        cy.get('#username').type('cesar.school');
        cy.get('.password-wrapper').type('1234');
        cy.get('.submit-button').click();
        cy.wait(2000);
        cy.get('[href="/add/"]').click();
        cy.get('.input_cultura').select('Tomate');
        cy.get('[name="area"]').select('C');
        cy.get('[name="linha"]').select('3');
        cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
        cy.get('#data_plantio').type('2024-11-23');
        cy.get('#duracao').type('4');
        cy.get('#unidade_duracao').select('meses');
        cy.get(':nth-child(2) > .atv > .input_number').type('10');
        cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
        cy.get(':nth-child(3) > .atv > .input_number').type('1');
        cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
        cy.get('.registrar_cultura').click();
        cy.wait(2000);
        cy.get('[href="/verculturas/"]').click();  
        cy.get('.editar-btn > .fas').first().click(); 
        cy.wait(2000);
        cy.get('.data-colheita')
        .clear()
        .type('2024-12-15')
        .trigger('change');
        cy.wait(2000);       
        cy.get('.confirmar-edicao > .fas').first().click();
        cy.wait(2000);
    });

    

    
});
