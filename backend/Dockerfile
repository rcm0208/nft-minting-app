FROM node:20

RUN curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 8080

ENV NODE_ENV=production

RUN bun run build

CMD ["bun", "run", "start"]
