describe('Teste da historia 6', () => {
   
  const cleanupAndSetupData = () => {

    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(1000);

    // buscando cultura
    cy.get('#searchInput').type('alface');
    cy.wait(5000);

  };

  it('cenario1 - pesquisa correta', () => {
      cleanupAndSetupData();
  });


  it('cenario2 - pesquisa incompleta', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(1000);

    // buscando cultura
    cy.get('#searchInput').type('alf');
    cy.wait(5000);
  });

  it('cenario2 - pesquisa com typo', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(1000);

    // buscando cultura
    cy.get('#searchInput').type('alfwcr');
    cy.wait(5000);
  });

  it('cenario2 - pesquisa por data', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(1000);

    // buscando cultura
    cy.get('#searchInput').type('26/11');
    cy.wait(5000);
  });

});
