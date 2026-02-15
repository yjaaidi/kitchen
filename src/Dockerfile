FROM node:25-alpine
ENV NODE_ENV=production

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy yarn berry's files just to make sure that we are
# using the same version of yarn. 
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies.
RUN pnpm install --frozen-lockfile

# Copy local code to the container image.
COPY dist ./

# Run the web service on container startup.
CMD [ "pnpm", "node", "main.js" ]
