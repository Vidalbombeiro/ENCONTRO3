function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = "Inscritos_Brinde";
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        "Data/Hora",
        "Nome Completo",
        "Telefone (Formatado)",
        "Telefone (Somente Números)",
        "Apoio Espiritual",
        "Pedido / Observação"
      ]);
    }

    const params = e && e.parameter ? e.parameter : {};
    const nome = String(params.nome || "").trim();
    const telefoneFormatado = String(params.telefone || "").trim();
    const telefoneNumeros = telefoneFormatado.replace(/\D/g, "");
    const interesse = String(params.interesse || "").trim();
    const mensagem = String(params.mensagem || "").trim();

    if (!nome || telefoneNumeros.length < 10) {
      return ContentService.createTextOutput("INVALIDO");
    }

    // Evita duplicar exatamente o mesmo telefone já cadastrado
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existingPhones = sheet.getRange(2, 4, lastRow - 1, 1).getValues().flat().map(String);
      if (existingPhones.includes(telefoneNumeros)) {
        return ContentService.createTextOutput("DUPLICADO");
      }
    }

    sheet.appendRow([
      new Date(),
      nome,
      telefoneFormatado,
      "'" + telefoneNumeros, // Mantém zeros/dígitos como texto sem perder formatação
      interesse,
      mensagem
    ]);

    return ContentService.createTextOutput("OK");
  } catch (err) {
    return ContentService.createTextOutput("ERRO: " + err.message);
  } finally {
    lock.releaseLock();
  }
}