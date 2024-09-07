FROM node:20

# Bunのインストール
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

WORKDIR /app

# アプリケーションファイルのコピー
COPY . .

# 依存関係のインストール
RUN bun install

# ポートの公開
EXPOSE 8080

# 環境変数の設定
ENV NODE_ENV=production

# シェルスクリプトの作成
RUN echo '#!/bin/sh\n\
bun run src/index.ts &\n\
MAINPID=$!\n\
trap "kill $MAINPID" SIGTERM\n\
wait $MAINPID\n\
trap - SIGTERM\n\
wait $MAINPID' > /app/start.sh && chmod +x /app/start.sh

# シェルスクリプトの実行
CMD ["/app/start.sh"]
