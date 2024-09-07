# backend本番デプロイ用

FROM node:20

RUN curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

WORKDIR /app

COPY ./backend /app/backend

COPY ./contract/ignition/deployments /app/contract/ignition/deployments

WORKDIR /app/backend

RUN bun install

EXPOSE 8080

ENV NODE_ENV=production

CMD ["bun", "run", "start"]