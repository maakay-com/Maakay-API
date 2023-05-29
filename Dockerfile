FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:16-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package*.json ./
RUN npm install --production
ENV PORT=3000
EXPOSE 3000
CMD [ "npm", "start" ]
