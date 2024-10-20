const userForm = document.getElementById('user-form');
const userTable = document.getElementById('user-tabela');
const stateSummary = document.getElementById('estado-distribuicao');
const originSummary = document.getElementById('origem-distribuicao');
let users = [];

// Busca o endereço utilizando a API ViaCEP 
document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, ''); // Remove todas as coisas que não são números
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('address').value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                } else {
                    alert('CEP não encontrado.');
                    document.getElementById('address').value = '';
                }
            })
            .catch(error => console.error('Erro ao buscar o CEP:', error));
    } else {
        alert('CEP inválido. Deve ter 8 dígitos.');
        document.getElementById('address').value = '';
    }
});

// Função para cadastro de novos usuários e ir adicionando eles na tabela
userForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário (recarregar a página)

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const origem = document.getElementById('origem').value;

    const user = { name, email, address, origem };
    users.push(user); // Adiciona o novo usuário ao array de usuários

    updateUserTable(); // Atualiza a tabela de usuários cadastrados
    updateStateSummary(); // Atualiza a distribuição de usuários por estado
    updateOriginSummary(); // Atualiza a distribuição de usuários por origem

    // Limpa todos os campos do formulário após o cadastro ser enviado
    userForm.reset();
    document.getElementById('address').value = '';
});

// Função para atualizar a tabela de usuários cadastrados
function updateUserTable() {
    userTable.innerHTML = ''; // Limpa a tabela antes de atualizá-la
    users.forEach(user => {
        const row = document.createElement('tr'); // Cria uma nova linha na tabela
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.address}</td>
            <td>${user.origem}</td>
        `;
        userTable.appendChild(row); // Adiciona a linha à tabela
    });
}

// Função para atualizar a distribuição de usuários por estado
function updateStateSummary() {
    const stateCounts = users.reduce((counts, user) => {
        const state = user.address.split('-').pop().trim(); // Extrai a UF do endereço
        counts[state] = (counts[state] || 0) + 1;
        return counts;
    }, {});

    stateSummary.innerHTML = ''; // Limpa a lista de distribuição por estado antes de atualizá-la
    Object.entries(stateCounts).forEach(([state, count]) => {
        const li = document.createElement('li');
        li.textContent = `${state}: ${count}`;
        stateSummary.appendChild(li);
    });
}

// Função para atualizar a distribuição de usuários por origem
function updateOriginSummary() {
    const originCounts = users.reduce((counts, user) => {
        counts[user.origem] = (counts[user.origem] || 0) + 1;
        return counts;
    }, {});

    originSummary.innerHTML = ''; // Limpa a lista de distribuição por origem antes de atualizá-la
    Object.entries(originCounts).forEach(([origem, count]) => {
        const li = document.createElement('li');
        li.textContent = `${origem}: ${count}`;
        originSummary.appendChild(li);
    });
}