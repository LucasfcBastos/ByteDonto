-- ==========================================
-- SCRIPT DE RESET TOTAL (FORÇAR ATUALIZAÇÃO)
-- ==========================================
-- ATENÇÃO: RODE ESTE SCRIPT NO SUPABASE
-- Ele vai dropar (apagar) as tabelas velhas se existirem,
-- para que os novos campos ("dono_id", "jsonb") sejam criados!

DROP TABLE IF EXISTS faturamento CASCADE;
DROP TABLE IF EXISTS atendimentos CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS clinicas CASCADE;

-- 1. Tabela de Clínicas (Tenants)
CREATE TABLE clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_fantasia TEXT NOT NULL,
    razao_social TEXT,
    cnpj TEXT UNIQUE,
    dono_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Perfis de Usuários (Dono, Especialista, Recepção)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    papel TEXT CHECK (papel IN ('Dono', 'Especialista', 'Recepção')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela Principal de Pacientes (Atualizada com JSONB)
CREATE TABLE pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cpf TEXT,
    rg TEXT,
    data_nascimento DATE,
    genero TEXT,
    telefone_whatsapp TEXT,
    email TEXT,
    endereco JSONB DEFAULT '{}'::jsonb,
    anamnese JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'Ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Atendimentos / Consultas (Especialista e Agenda)
CREATE TABLE atendimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
    dentista_id UUID REFERENCES usuarios(id),
    data_agendada TIMESTAMP WITH TIME ZONE NOT NULL,
    procedimentos_descritos TEXT,
    evolucao_clinica TEXT,
    status TEXT CHECK (status IN ('Agendado', 'Cancelado', 'Finalizado', 'Faltou')) DEFAULT 'Agendado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Lançamentos Financeiros
CREATE TABLE faturamento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES pacientes(id),
    atendimento_id UUID REFERENCES atendimentos(id),
    dentista_responsavel UUID REFERENCES usuarios(id),
    valor DECIMAL(10,2) NOT NULL,
    forma_pagamento TEXT,
    status_pagamento TEXT CHECK (status_pagamento IN ('Pago', 'Pendente', 'Cancelado')) DEFAULT 'Pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTIFY O SUPABASE PARA LER A MUDANÇA IMEDIATAMENTE (Limpa o Cache):
NOTIFY pgrst, 'reload schema';
