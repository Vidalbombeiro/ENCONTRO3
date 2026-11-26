/**
 * Recebe os dados do formulário HTML (via FormData) e grava na aba "Inscritos_Brinde"
 * Colunas da aba:
 * A: Data/Hora
 * B: Nome Completo
 * C: Telefone (Formatado)
 * D: Telefone (Somente Números)
 * E: Apoio Espiritual
 * F: Pedido / Observação
 * G: Status Sorteio ("Pendente")
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // Aguarda até 10s para evitar conflito em envios simultâneos

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = "Inscritos_Brinde";
    let sheet = ss.getSheetByName(sheetName);

    // Cria a aba caso tenha sido renomeada ou excluída acidentalmente
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        "Data/Hora",
        "Nome Completo",
        "Telefone (Formatado)",
        "Telefone (Somente Números)",
        "Apoio Espiritual",
        "Pedido / Observação",
        "Status Sorteio"
      ]);
    }

    const params = e && e.parameter ? e.parameter : {};
    const nome = String(params.nome || "").trim();
    const telefoneFormatado = String(params.telefone || "").trim();
    const telefoneNumeros = telefoneFormatado.replace(/\D/g, "");
    const interesse = String(params.interesse || "Apenas participar do brinde").trim();
    const mensagem = String(params.mensagem || "").trim();

    // Validação mínima no servidor
    if (!nome || telefoneNumeros.length < 10) {
      return ContentService.createTextOutput("INVALIDO");
    }

    // Verifica duplicidade pelo telefone (Coluna D = índice 4)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existingPhones = sheet
        .getRange(2, 4, lastRow - 1, 1)
        .getValues()
        .flat()
        .map(val => String(val).replace(/\D/g, ""));

      if (existingPhones.includes(telefoneNumeros)) {
        return ContentService.createTextOutput("DUPLICADO");
      }
    }

    // Grava a nova linha com as 7 colunas
    sheet.appendRow([
      new Date(),                // Coluna A: Data/Hora
      nome,                      // Coluna B: Nome Completo
      telefoneFormatado,         // Coluna C: Telefone (Formatado)
      "'" + telefoneNumeros,     // Coluna D: Telefone (Somente Números) como texto
      interesse,                 // Coluna E: Apoio Espiritual
      mensagem,                  // Coluna F: Pedido / Observação
      "Pendente"                 // Coluna G: Status Sorteio
    ]);

    // Aplica a regra de validação (menu suspenso) da linha 2 na nova linha gravada
    const newRow = sheet.getLastRow();
    if (newRow > 2) {
      const rule = sheet.getRange("G2").getDataValidation();
      if (rule) {
        sheet.getRange(newRow, 7).setDataValidation(rule);
      }
    }

    return ContentService.createTextOutput("OK");
  } catch (err) {
    return ContentService.createTextOutput("ERRO: " + err.message);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Opcional: permite testar se a URL do Web App está ativa ao abrir no navegador
 */
function doGet() {
  return ContentService.createTextOutput("API 5º Encontro de Quartetos ativa.");
}