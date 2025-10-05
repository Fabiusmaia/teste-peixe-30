# Projeto de Teste – Peixe 30

Este projeto é uma aplicação fullstack desenvolvida como teste para a vaga de desenvolvedor na **Peixe 30**.  
A aplicação gerencia **vagas de emprego** e **candidatos**, utilizando **NestJS** no backend e **Next.js** no frontend, com banco de dados **MongoDB**.  
Toda a aplicação está configurada para rodar via **Docker Compose**.

> Tempo gasto no desenvolvimento: aproximadamente **6 horas**  
> Login de teste: **admin@example.com**  
> Senha de teste: **123456**
> URL do frontend: https://zoological-mindfulness-production.up.railway.app
> URL do backend: https://teste-peixe-30-production.up.railway.app

---

## 🚀 Tecnologias

* **Backend:** NestJS, TypeORM, MongoDB
* **Frontend:** Next.js, React
* **Banco de dados:** MongoDB
* **Containerização:** Docker, Docker Compose
* **Testes:** Jest

---


## ⚙️ Pré-requisitos

* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🐳 Rodando com Docker

Clone o repositório com 
```bash
git clone https://github.com/Fabiusmaia/teste-peixe-30.git
```

No diretório raiz do projeto, execute:

```bash
docker-compose up --build
```

Isso irá:

1. Subir o **MongoDB** na porta `27017`.
2. Subir o **backend NestJS** na porta `3001`.
3. Subir o **frontend Next.js** na porta `3000`.

> Você pode acessar o frontend em [http://localhost:3000](http://localhost:3000).

---

```bash
docker exec -it nest-backend npm run seed
```

---

## 🧪 Testes

O backend utiliza **Jest** para testes unitários. Para rodar os testes localmente:

```bash
# Backend
cd backend
npm install
npm run test
```

---

## ⚡ Comandos úteis

**Backend:**

```bash
npm run start        # Inicia em produção
npm run start:dev    # Inicia em modo desenvolvimento
npm run test         # Executa testes
npm run seed         # Popula dados iniciais no banco
```

**Frontend:**

```bash
npm run dev          # Inicia o Next.js em modo desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia o servidor Next.js
```

---

## 🔑 Variáveis de ambiente

**Backend (.env ou via docker-compose):**

```
MONGO_URL=mongodb://mongodb:27017/meubanco
PORT=3001
```

**Frontend (.env ou via docker-compose):**

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 💻 Desenvolvimento local

Para rodar sem Docker:

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```



