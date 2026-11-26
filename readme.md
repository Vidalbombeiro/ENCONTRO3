# 🎶 5º Encontro de Quartetos - Landing Page

Landing page oficial para o **5º Encontro de Quartetos** da Igreja Adventista do Sétimo Dia em Ibitinga/SP. O site foi desenvolvido para divulgar o evento, fornecer informações de localização, exibir os quartetos participantes e gerenciar inscrições para sorteio de brindes e pedidos de oração.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web modernas e leves, sem a necessidade de frameworks complexos ou etapa de build (compilação):

*   **HTML5**: Estrutura semântica e acessível.
*   **Tailwind CSS (via CDN)**: Estilização rápida, responsiva e customizada (paleta de cores *Navy* e *Gold*).
*   **JavaScript (Vanilla)**: Lógica do contador regressivo, máscara de telefone, menu mobile e envio do formulário.
*   **Google Fonts**: Tipografia utilizando as fontes *Inter* e *Playfair Display*.
*   **FontAwesome (via CDN)**: Ícones vetoriais.
*   **Google Apps Script**: Backend *serverless* para receber os dados do formulário e salvar em uma planilha do Google Sheets.

## 📂 Estrutura de Arquivos

Para que o site funcione corretamente, a pasta do projeto deve conter os seguintes arquivos:

```text
/
├── index.html       # Arquivo principal com todo o código (HTML, CSS e JS)
├── cartaz.png       # Banner principal do evento (formato PNG)
└── README.md        # Este arquivo de documentação
```

## Configurar o envio para o Google Sheets

1. Na planilha de destino, abra **Extensões → Apps Script**.
2. Copie o conteúdo de `app scripit.js` para o editor e salve. O `SPREADSHEET_ID` já aponta para a planilha informada; a conta que implantar o script precisa ter permissão para editá-la. Os registros serão gravados na aba `Inscritos_Brinde`.
3. Clique em **Implantar → Nova implantação** e selecione **Aplicativo da Web** no ícone de engrenagem.
4. Configure **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa** (acesso sem login). Autorize o acesso à planilha com a conta responsável pela implantação. A planilha pode continuar privada.
5. Copie a **URL do aplicativo da Web**, no formato `https://script.google.com/macros/s/ID_DA_IMPLANTACAO/exec`, e cole em `SCRIPT_URL` no `index.html`.
6. Abra essa URL em uma janela anônima. Ela deve mostrar `API 5º Encontro de Quartetos ativa.` sem pedir login. Esse teste confirma o acesso à URL; depois faça uma inscrição pelo site e confira a nova linha na aba `Inscritos_Brinde` para validar a gravação.
7. Publique o `index.html` atualizado na hospedagem do site.

O link de edição da planilha (`docs.google.com/spreadsheets/...`) e o link de biblioteca do Apps Script (`script.google.com/macros/library/...`) não são endpoints de envio. O endereço de biblioteca estava configurado no formulário e precisa ser substituído pela URL `/exec` gerada pelo Google; esse endereço não pode ser deduzido do ID da planilha ou da biblioteca.

Se houver erro **401/403** ou pedido de login, confira a URL, o acesso público da implantação e a autorização da conta que a publicou. Se a opção **Qualquer pessoa** não estiver disponível, verifique as restrições da organização Google Workspace com o administrador.

Ao alterar o código no Apps Script, use **Implantar → Gerenciar implantações → Editar → Nova versão → Implantar** para atualizar o aplicativo publicado. Apenas salvar no editor não atualiza a versão usada pela URL `/exec`.

O formulário só mostra confirmação ao receber `OK` do script. A opção `no-cors` foi removida porque deixa a resposta opaca e impede verificar erros HTTP e os retornos `DUPLICADO`, `INVALIDO` e `ERRO`. Se o navegador bloquear a leitura da resposta, verifique a implantação e as execuções no Apps Script; não trate uma resposta ilegível como inscrição confirmada.

Referência: [Aplicativos da Web no Google Apps Script](https://developers.google.com/apps-script/guides/web).
