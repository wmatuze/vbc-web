FROM ghcr.io/puppeteer/puppeteer:24.43.0

ENV NODE_ENV=production \
    PORT=8000 \
    PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /home/pptruser/app

COPY --chown=pptruser:pptruser package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=pptruser:pptruser . .

EXPOSE 8000

CMD ["npm", "start"]
