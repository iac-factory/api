FROM node:lts-alpine

EXPOSE 3000

COPY distribution /Application
COPY .env /Application

WORKDIR /Application

RUN npm run production

CMD [ "node", "." ]
