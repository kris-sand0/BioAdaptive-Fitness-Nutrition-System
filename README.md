# BioAdaptive Fitness & Nutrition System

Este é um aplicativo web que atua como um personal trainer e nutricionista com inteligência artificial. Ele foi projetado para fornecer aos usuários feedback e sugestões personalizadas para ajudá-los a alcançar suas metas de saúde e fitness. O sistema se adapta com base nos dados do usuário e no progresso em tempo real para fornecer recomendações relevantes.

## ✨ Funcionalidades

*   **Onboarding de Segurança:** Um questionário PAR-Q (Physical Activity Readiness Questionnaire) garante que o usuário esteja apto para iniciar as atividades físicas.
*   **Criação de Perfil:** Os usuários podem definir suas metas, características físicas e nível de atividade.
*   **Dashboard Interativo:** Uma tela principal que exibe o progresso diário de passos, calorias, proteínas e treinos.
*   **Coach com IA (Gemini):** Utiliza a API do Google Gemini para gerar sugestões diárias e personalizadas de alimentação e exercícios.
*   **Monitoramento em Tempo Real:** Simula o monitoramento da frequência cardíaca e alerta o usuário caso ela ultrapasse um limite seguro.
*   **Registro de Atividades:** Permite que o usuário registre manualmente refeições, passos e a conclusão de treinos.

## 🚀 Tecnologias Utilizadas

*   **Framework:** Next.js
*   **Linguagem:** TypeScript
*   **UI:** React
*   **Estilização:** Tailwind CSS
*   **Inteligência Artificial:** Google Gemini API
*   **Gerenciamento de Estado:** Zustand (implícito pelo `useAppStore`)
*   **Formulários:** React Hook Form & Zod

## 🏁 Como Começar

Siga as instruções abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 20 ou superior)
*   Um gerenciador de pacotes como `npm` ou `yarn`.

### Instalação

1.  **Clone o repositório (opcional):**
    ```bash
    git clone https://github.com/kris-sand0/BioAdaptive-Fitness-Nutrition-System.git
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    *   Crie uma cópia do arquivo `.env.example` e renomeie para `.env.local`.
    *   Dentro do `.env.local`, adicione sua chave da API do Google Gemini:

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

    Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver o aplicativo em execução.

## 🕹️ Como Usar o Aplicativo

1.  **Onboarding:** Ao iniciar o aplicativo pela primeira vez, você será guiado por um processo de duas etapas:
    *   **Avaliação PAR-Q:** Responda às perguntas de segurança. Se você responder "Sim" a qualquer uma delas, um aviso será exibido, mas você ainda poderá optar por continuar.
    *   **Perfil do Usuário:** Preencha seus dados, como objetivo, idade, peso e nível de atividade. Essas informações são cruciais para que a IA gere recomendações precisas.

2.  **Dashboard:** Após o onboarding, você será direcionado para o dashboard principal. Aqui você pode:
    *   Visualizar seu progresso diário em relação às metas de passos, calorias e proteínas.
