Cypress.Commands.add('deleteAllUsers', () => {
    cy.exec('python delete_users.py', { failOnNonZeroExit: false });
});

Cypress.Commands.add('createUser', (username, password, email) => {
    cy.visit('/');
    cy.get('#toggle-link').click();
    cy.get('#register-form > [type="text"]').type(username);
    cy.get('[type="email"]').type(email);
    cy.get('#register-form > [placeholder="Senha"]').type(password);
    cy.get('#register-form > [placeholder="Confirmar Senha"]').type(password);
    cy.get('#register-form > .login-button').click();
})

Cypress.Commands.add('login', (username, password) => {
    cy.visit('/');
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('#login-form > .login-button').click();
    ;
});

describe('Lembretes na Página Inicial', () => {

    beforeEach(() => {
        // Acessa a página inicial e faz login, se necessário
        cy.createUser('teste', 'teste123', 'H0C4o@example.com');
        cy.login('teste', 'teste123');
    });

    it('Adiciona um novo lembrete manual', () => {
        // Clica no campo para adicionar lembrete
        cy.get('.form_reminder > .reminder').type('Regar as plantas ao amanhecer');
        cy.get('.botao_adicionar').click();

        // Verifica se a mensagem de sucesso é exibida
        cy.contains('Lembrete adicionado com sucesso').should('be.visible');

        // Verifica se o lembrete aparece na lista de lembretes
        cy.get('.reminders').contains('Regar as plantas ao amanhecer').should('be.visible');
    });

    it('Não permite adicionar lembrete duplicado', () => {
        // Adiciona um lembrete pela primeira vez
        cy.get('.form_reminder input[name="text"]').type('Colher tomates');
        cy.get('.form_reminder button[type="submit"]').click();

        // Tenta adicionar o mesmo lembrete novamente
        cy.get('.form_reminder input[name="text"]').type('Colher tomates');
        cy.get('.form_reminder button[type="submit"]').click();

        // Verifica a mensagem de erro
        cy.contains('Este lembrete já foi adicionado.').should('be.visible');
    });

    it('Exibe lembretes persistentes após recarregar a página', () => {
        // Adiciona um lembrete
        cy.get('.form_reminder input[name="text"]').type('Adubar as plantas');
        cy.get('.form_reminder button[type="submit"]').click();

        // Recarrega a página
        cy.reload();

        // Verifica se o lembrete persiste
        cy.get('.reminders').contains('Adubar as plantas').should('be.visible');
    });

    it('Exclui um lembrete', () => {
        // Adiciona um lembrete para teste
        cy.get('.form_reminder input[name="text"]').type('Podar as roseiras');
        cy.get('.form_reminder button[type="submit"]').click();

        // Exclui o lembrete recém-adicionado
        cy.get('.reminders').contains('Podar as roseiras').parent().find('button[title="Excluir"]').click();

        // Verifica se o lembrete foi removido
        cy.contains('Podar as roseiras').should('not.exist');
    });

    it('Exibe atividades automáticas quando disponíveis', () => {
        // Verifica se as atividades automáticas estão listadas
        cy.get('.reminders').contains('Atividades Automáticas').should('be.visible');

        // Verifica se ao menos uma atividade está presente (se esperado)
        cy.get('.automatic-reminder').should('exist');
    });
});
