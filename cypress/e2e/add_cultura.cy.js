describe('Teste da historia 5', () => {
   
  const cleanupAndSetupData = () => {

    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/home/');
    cy.wait(1000);
    cy.get('[href="/add/"]').click();
    cy.wait(1000);
    cy.get('.input_cultura').select('Tomate');
    cy.wait(1000);
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
    cy.wait(3000);

    // adicionando nova atividade
    cy.get('.botao_adicionar').click();
    cy.get(':nth-child(4) > [type="text"]').type('Adubar');
    cy.get(':nth-child(4) > [type="number"]').type('1');
    cy.get(':nth-child(4) > select').select('meses');
    cy.wait(1000);
    cy.get('.registrar_cultura').click();
    cy.wait(3000);

    //checando cult nova
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(5000);
    cy.get('.parte-direita').click();
    cy.wait(5000);

  };


  it('cenario1 - add cultura 100% completa', () => {
      cleanupAndSetupData();
  });


  it('cenario2 - add sem irrigação/poda; vai completo', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
    
    cy.visit('http://127.0.0.1:8000/home/');
    cy.wait(1000);
    cy.get('[href="/add/"]').click();
    cy.wait(1000);
    cy.get('.input_cultura').select('Tomate');
    cy.wait(1000);
    cy.get('[name="area"]').select('C');
    cy.get('[name="linha"]').select('3');
    cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
    cy.get('#data_plantio').type('2024-11-23');
    cy.get('#duracao').type('4');
    cy.get('#unidade_duracao').select('meses');
    cy.wait(3000);
    cy.get('.registrar_cultura').click();
    cy.wait(3000);
    
    //checando cult nova
    cy.visit('http://127.0.0.1:8000/verculturas/');
    cy.wait(5000);
    cy.get('.parte-direita').click();
    cy.wait(5000);
  });

  it('cenario3 - add sem seleção de cultura', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/home/');
    cy.wait(1000);
    cy.get('[href="/add/"]').click();
    cy.wait(1000);
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
    cy.wait(3000);
    cy.get('.registrar_cultura').click();
    cy.wait(3000);

  });

  it('cenario4 - add sem area', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/home/');
    cy.wait(1000);
    cy.get('[href="/add/"]').click();
    cy.wait(1000);
    cy.get('.input_cultura').select('Alface');
    cy.wait(1000);
    cy.get('[name="linha"]').select('3');
    cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
    cy.get('#data_plantio').type('2024-11-23');
    cy.get('#duracao').type('4');
    cy.get('#unidade_duracao').select('meses');
    cy.get(':nth-child(2) > .atv > .input_number').type('10');
    cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
    cy.get(':nth-child(3) > .atv > .input_number').type('1');
    cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
    cy.wait(3000);
    cy.get('.registrar_cultura').click();
    cy.wait(3000);

  });

  
  it('cenario5 - add sem linha', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/home/');
    cy.wait(1000);
    cy.get('[href="/add/"]').click();
    cy.wait(1000);
    cy.get('.input_cultura').select('Alface');
    cy.wait(1000);
    cy.get('[name="area"]').select('C');
    cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
    cy.get('#data_plantio').type('2024-11-23');
    cy.get('#duracao').type('4');
    cy.get('#unidade_duracao').select('meses');
    cy.get(':nth-child(2) > .atv > .input_number').type('10');
    cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
    cy.get(':nth-child(3) > .atv > .input_number').type('1');
    cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
    cy.wait(3000);
    cy.get('.registrar_cultura').click();
    cy.wait(3000);

  });

  it('cenario6 - add sem data de plantio', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/home/');
    cy.wait(1000);
    cy.get('[href="/add/"]').click();
    cy.wait(1000);
    cy.get('.input_cultura').select('Alface');
    cy.wait(1000);
    cy.get('[name="area"]').select('C');
    cy.get('[name="linha"]').select('3');
    cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
    cy.get('#duracao').type('4');
    cy.get('#unidade_duracao').select('meses');
    cy.get(':nth-child(2) > .atv > .input_number').type('10');
    cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
    cy.get(':nth-child(3) > .atv > .input_number').type('1');
    cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
    cy.wait(3000);
    cy.get('.registrar_cultura').click();
    cy.wait(3000);

  });

  it('cenario7 - add sem duração', () => {
    //login
    cy.visit('http://127.0.0.1:8000/');
    cy.get('#username').type('laviniaxs');
    cy.get('#password').type('1234');
    cy.get('.submit-button').click();
    cy.wait(3000);
   
    cy.visit('http://127.0.0.1:8000/home/');
    cy.wait(1000);
    cy.get('[href="/add/"]').click();
    cy.wait(1000);
    cy.get('.input_cultura').select('Alface');
    cy.wait(1000);
    cy.get('[name="area"]').select('C');
    cy.get('[name="linha"]').select('3');
    cy.get('.container_loc-desc > .span > input').type('Sementes de Daniel');
    cy.get('#data_plantio').type('2024-11-23');
    cy.get('#duracao').type('4');
    cy.get(':nth-child(2) > .atv > .input_number').type('10');
    cy.get(':nth-child(2) > .atv > .select_atv').select('dias');
    cy.get(':nth-child(3) > .atv > .input_number').type('1');
    cy.get(':nth-child(3) > .atv > .select_atv').select('semanas');
    cy.wait(3000);
    cy.get('.registrar_cultura').click();
    cy.wait(3000);

  });

});
