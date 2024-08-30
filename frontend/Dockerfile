FROM node:20

RUN curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

WORKDIR /app/frontend

COPY package.json bun.lockb ./

RUN bun install

COPY . .

EXPOSE 8000

ENV NODE_ENV=development

CMD ["bun", "run", "dev"]
