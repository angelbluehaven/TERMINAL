// Importa as funções select, input, checkbox do pacote "@inquirer/prompts"
const { select, input, checkbox } = require("@inquirer/prompts");

// Variável que armazena a mensagem atual a ser exibida para o usuário
let mensagem = "Bem vindo ao app de metas";

// Objeto que representa uma meta com um valor e um estado de checado (checked)
let meta = {
    value: "Tomar 3L de água todos os dias", // Descrição da meta
    checked: false, // Estado da meta (false significa não concluída)
};

// Array que armazena todas as metas
let metas = [ meta ];

// Função assíncrona para cadastrar uma nova meta
const cadastrarMeta = async () => {
    // Solicita ao usuário para digitar a nova meta
    const meta = await input({ message: "Digite a meta:" });

    // Verifica se a meta está vazia
    if (meta.length == 0) {
        mensagem = "A meta não pode ser vazia"; // Atualiza a mensagem de erro
        return; // Sai da função sem adicionar a meta
    }

    // Adiciona a nova meta ao array de metas com o estado 'checked' como false
    metas.push({ value: meta, checked: false });

    // Atualiza a mensagem de sucesso
    mensagem = "Meta cadastrada com sucesso!";
};

// Função assíncrona para listar e marcar metas como concluídas
const listarMetas = async () => {
    // Exibe um checklist das metas para o usuário marcar/desmarcar
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar/desmarcar e o enter para finalizar essa etapa",
        choices: [...metas], // Lista as metas atuais
        instructions: false, // Remove instruções adicionais
    });

    // Desmarca todas as metas antes de processar as respostas do usuário
    metas.forEach((m) => {
        m.checked = false;
    });

    // Verifica se nenhuma meta foi selecionada
    if (respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada"; // Atualiza a mensagem de erro
        return; // Sai da função
    }

    // Marca as metas selecionadas pelo usuário como concluídas
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta; // Encontra a meta correspondente
        });

        meta.checked = true; // Marca a meta como concluída
    });

    // Atualiza a mensagem de sucesso
    mensagem = "Meta(s) marcada(s) como concluida(s)";
};

// Função assíncrona para exibir metas realizadas
const metasRealizadas = async () => {
    // Filtra as metas que foram marcadas como concluídas
    const realizadas = metas.filter((meta) => {
        return meta.checked;
    });

    // Verifica se não há metas concluídas
    if (realizadas.length == 0) {
        mensagem = "Não existem metas realizadas! :( "; // Atualiza a mensagem de erro
        return; // Sai da função
    }

    // Exibe as metas realizadas em um menu de seleção
    await select({
        message: "Metas Realizadas:  " + metas.length,
        choices: [...realizadas], // Lista as metas concluídas
    });
};

// Função assíncrona para exibir metas abertas (não concluídas)
const metasAbertas = async () => {
    // Filtra as metas que não foram concluídas
    const abertas = metas.filter((meta) => {
        return meta.checked != true;
    });

    // Verifica se não há metas abertas
    if (abertas.length == 0) {
        mensagem = "Não existem metas abertas! :) "; // Atualiza a mensagem de sucesso
        return; // Sai da função
    }

    // Exibe as metas abertas em um menu de seleção
    await select({
        message: "Metas Abertas:  " + abertas.length,
        choices: [...abertas], // Lista as metas não concluídas
    });
};

// Função assíncrona para deletar metas
const deletarMetas = async () => {
    // Cria uma cópia das metas com estado 'checked' false para o checklist
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false };
    });

    // Exibe um checklist para o usuário selecionar metas a serem deletadas
    const itemsADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas], // Lista as metas disponíveis para deleção
        instructions: false, // Remove instruções adicionais
    });

    // Verifica se nenhum item foi selecionado para deletar
    if (itemsADeletar.length == 0) {
        mensagem = "Nenhum item pra deletar"; // Atualiza a mensagem de erro
        return; // Sai da função
    }

    // Remove as metas selecionadas pelo usuário
    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item; // Filtra para remover as metas correspondentes
        });
    });

    // Atualiza a mensagem de sucesso
    mensagem = "Meta(s) deleta(s) com sucesso!";
};

// Função para exibir a mensagem atual no console
const mostrarMensagem = () => {
    console.clear(); // Limpa o console

    // Verifica se há uma mensagem para exibir
    if (mensagem != "") {
        console.log(mensagem); // Exibe a mensagem
        console.log(""); // Adiciona uma linha em branco
        mensagem = ""; // Reseta a mensagem para não ser exibida novamente
    }
};

// Função principal que controla o fluxo do aplicativo
const start = async () => {
    // Loop infinito para o menu principal
    while (true) {
        mostrarMensagem(); // Mostra a mensagem atual

        // Exibe o menu principal e espera a escolha do usuário
        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar",
                },
                {
                    name: "Listar metas",
                    value: "listar",
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas",
                },
                {
                    name: "Metas abertas",
                    value: "abertas",
                },
                {
                    name: "Deletar Metas",
                    value: "deletar",
                },
                {
                    name: "Sair",
                    value: "sair",
                },
            ],
        });

        // Executa a função correspondente à opção selecionada pelo usuário
        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta();
                break;
            case "listar":
                await listarMetas();
                break;
            case "realizadas":
                await metasRealizadas();
                break;
            case "abertas":
                await metasAbertas();
                break;
            case "deletar":
                await deletarMetas();
                break;
            case "sair":
                console.log("Até a próxima"); // Exibe mensagem de despedida
                return; // Encerra o loop e a aplicação
        }
    }
};

// Inicia o aplicativo
start();
