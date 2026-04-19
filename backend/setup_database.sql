-- ==========================================
-- ESTRUTURA DO BANCO DE DADOS BYTEDONTO
-- ==========================================
-- Instruções: Copie todo este arquivo e cole na aba 'SQL Editor' do seu Supabase,
-- então clique em 'Run' para construir as tabelas do zero ou atualizá-las.

-- 1. Tabela de Clínicas (Tenants)
CREATE TABLE IF NOT EXISTS clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_fantasia TEXT NOT NULL,
    razao_social TEXT,
    cnpj TEXT UNIQUE,
    dono_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Perfis de Usuários (Dono, Especialista, Recepção)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id), -- Conectado à Autenticação
    clinica_id UUID REFERENCES clinicas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    papel TEXT CHECK (papel IN ('Dono', 'Especialista', 'Recepção')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela Principal de Pacientes (Atualizada com JSONB)
CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cpf TEXT,
    rg TEXT,
    data_nascimento DATE,
    genero TEXT,
    telefone_whatsapp TEXT,
    email TEXT,
    endereco JSONB DEFAULT '{}'::jsonb,  -- Guarda CEP, Rua, Bairro, etc. em uma tacada só
    anamnese JSONB DEFAULT '{}'::jsonb,  -- Formulário médico completo (Alergias, Hipertensão, etc)
    status TEXT DEFAULT 'Ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Atendimentos / Consultas (Especialista e Agenda)
CREATE TABLE IF NOT EXISTS atendimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
    dentista_id UUID REFERENCES usuarios(id), -- Quem está atendendo
    data_agendada TIMESTAMP WITH TIME ZONE NOT NULL,
    procedimentos_descritos TEXT, -- Ex: Limpeza, Extração
    evolucao_clinica TEXT,        -- Anotações Médicas realizadas
    status TEXT CHECK (status IN ('Agendado', 'Cancelado', 'Finalizado', 'Faltou')) DEFAULT 'Agendado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Lançamentos Financeiros (Recepção processa, Especialista enxerga)
CREATE TABLE IF NOT EXISTS faturamento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES pacientes(id),
    atendimento_id UUID REFERENCES atendimentos(id), -- Vincula ao procedimento
    dentista_responsavel UUID REFERENCES usuarios(id),
    valor DECIMAL(10,2) NOT NULL,
    forma_pagamento TEXT,
    status_pagamento TEXT CHECK (status_pagamento IN ('Pago', 'Pendente', 'Cancelado')) DEFAULT 'Pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HABILITAR RLS (Segurança para cada clínica ver só os seus dados)
ALTER TABLE clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturamento ENABLE ROW LEVEL SECURITY;
