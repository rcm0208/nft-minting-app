FROM node:20

WORKDIR /app/backend

COPY backend/ /app/backend/

COPY contract/ignition/deployments /app/contract/ignition/deployments

WORKDIR /app/backend

RUN npm install --legacy-peer-deps

RUN npm run build

EXPOSE 8080

ENV NODE_ENV=production

CMD ["npm", "start"]
