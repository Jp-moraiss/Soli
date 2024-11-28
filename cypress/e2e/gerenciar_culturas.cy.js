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

    // editando cultura
    cy.get('#cultura-20 > .editar-btn > .fas').click();
    cy.wait(5000);
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-area').clear();
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-area').type('Área: c');
    cy.wait(5000);
    cy.get('#cultura-20 > .confirmar-edicao > .fas').click();
    cy.wait(5000);
  };

  it('cenario1 - mudando area; 100%', () => {
      cleanupAndSetupData();
  });


  it('cenario2 - mudando linha; 100%', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(1000);

    // editando cultura
    cy.get('#cultura-20 > .editar-btn > .fas').click();
    cy.wait(5000);
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-area').clear();
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-area').type('Área: c');
    cy.wait(5000);
    cy.get('#cultura-20 > .confirmar-edicao > .fas').click();
    cy.wait(5000);
  });

  it('cenario3 - mudando data plantio; erro', () => { // contagem dos dias nao vai alterar
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(1000);

    // editando cultura
    cy.get('#cultura-20 > .editar-btn > .fas').click();
    cy.wait(5000);
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-data-plantio > .data-plantio').click();
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-data-plantio > .data-plantio').clear();
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-data-plantio > .data-plantio').type('2024-10-23');
    cy.wait(5000);
    cy.get('#cultura-20 > .confirmar-edicao > .fas').click();
    cy.wait(5000);
  });

  it('cenario4 - mudando nome da cultura; erro', () => { //  nao vai alterar foto
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(1000);

    // editando cultura
    cy.get('#cultura-20 > .editar-btn > .fas').click();
    cy.get('#cultura-20 > .cultura-nome').clear();
    cy.get('#cultura-20 > .cultura-nome').type('Alface'); 
    cy.get('#cultura-20 > .confirmar-edicao > .fas').click();
    cy.wait(5000);
  });

  it('cenario5 - mudando data colheita - 100%', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(1000);

    // editando cultura
    cy.get('#cultura-20 > .editar-btn > .fas').click();
    cy.wait(5000);
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-data-colheita > .data-colheita').click();
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-data-colheita > .data-colheita').clear();
    cy.get('#cultura-20 > .hold_culturas-dados > .culturas-dados > .cultura-data-colheita > .data-colheita').type('2024-10-23');
    cy.wait(5000);
    cy.get('#cultura-20 > .confirmar-edicao > .fas').click();
    cy.wait(5000);
  });

});
