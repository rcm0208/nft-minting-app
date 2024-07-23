# Node 20系を使用
FROM node:20

# Bunの設定
RUN curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# 作業ディレクトリを設定
WORKDIR /app

# パッケージと依存関係をコピー
COPY ./frontend/package.json ./frontend/bun.lockb ./frontend/
COPY ./contract/package.json ./contract/yarn.lock ./contract/

# フロントエンドの依存関係をインストール
RUN cd /app/frontend && bun install

# コントラクトの依存関係をインストール
RUN cd /app/contract && yarn install

# ほかのファイルをコピー
COPY ./frontend ./frontend
COPY ./contract ./contract

# ポートは3000を設定
EXPOSE 3000

# 環境変数を設定
ENV NODE_ENV=development

# アプリを起動
WORKDIR /app/frontend
CMD ["bun", "run", "dev"]
