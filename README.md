# 1. COMO FAZER O PROJETO FUNCIONAR

## 1.1. Baixar o Projeto

### Linux / Mac:

Instalação do npm:
```bash
sudo apt install npm
```

Instalação do nvm:
```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Instalação da versão do node:
```bash
nvm install 20
```

Utilização da versão do node:
```bash
nvm use 20
```

## 1.2. Rodar o projeto

Entra dentro do back:
```bash
cd backend/
```

Criar um ambiente virtual:
```bash
python3 -m venv venv
```

Ativar o ambiente virtual:
```bash
source venv/bin/activate
```

Instalar as dependências:
```bash
pip install -r requirements.txt
```

Rodar o servidor:
```bash
python3 run.py
```

Em outro bash, entrar dentro do front:
```bash
cd frontend/
```

Instalar as independencias:
```bash
npm install react-router-dom @supabase/supabase-js
```

Rodar o projeto:
```bash
npm run dev
```