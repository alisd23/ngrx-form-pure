FROM node

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . ./
RUN yarn run build:demo --prod

EXPOSE 9999

RUN rm node_modules -fr
RUN yarn global add forever
RUN npm install http-server

ENTRYPOINT forever ./node_modules/http-server/bin/http-server demo-dist -p 9999 
