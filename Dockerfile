# syntax=docker/dockerfile:1
FROM node:16-alpine
COPY . .
RUN npm install --production
CMD ["npm", "run","cca","get-contact"]
EXPOSE 3000