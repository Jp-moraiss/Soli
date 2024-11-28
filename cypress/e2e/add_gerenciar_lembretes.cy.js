describe("teste 'lembretes'", () => {
     
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
       cy.get('.form_reminder > .reminder').type("irrigar alface");
       cy.get('.reminder-plus').click();
       cy.wait(2000);
   });

   it('cenario2 - adicionar sem nada escrito', () => {
       cy.get('#username').type('cesar.school');
       cy.get('.password-wrapper').type('1234');
       cy.get('.submit-button').click();
       cy.wait(2000);
       cy.get('.reminder-plus').click();
       cy.wait(2000);
   });

   it('cenario3 - adicionar e editar', () => {
       cy.get('#username').type('cesar.school');
       cy.get('.password-wrapper').type('1234');
       cy.get('.submit-button').click();
       cy.wait(2000);
       cy.get('.form_reminder > .reminder').type("irrigar alface");
       cy.get('.reminder-plus').click();
       cy.get('.edit_button > img').first().click();
       cy.get('input[id^="edit-text-"]').type(" e brocolis"); 
       cy.get('button[onclick^="saveEdit"]').click();
       cy.wait(2000);
});

   it('cenario4 - adicionar e excluir', () => {
       cy.get('#username').type('cesar.school');
       cy.get('.password-wrapper').type('1234');
       cy.get('.submit-button').click();
       cy.wait(2000);
       cy.get('.form_reminder > .reminder').type("irrigar alface");
       cy.get('.reminder-plus').click();
       cy.get('.edit_button > img').first().click();
       cy.get('button[onclick^="saveEdit"]').click();
       cy.wait(2000);
});

   it('cenario5 - adicionar e dar ok', () => {
       cy.get('#username').type('cesar.school');
       cy.get('.password-wrapper').type('1234');
       cy.get('.submit-button').click();
       cy.wait(2000);
       cy.get('.form_reminder > .reminder').type("irrigar alface");
       cy.get('.reminder-plus').click();
        cy.get('[id^="reminder-checkbox-"]').first().click(); 
       cy.wait(2000);
});




});
