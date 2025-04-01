cd ..

cd vue

cd vuetify-project

cp .env.PROD .env

npm i

npm run build

cd ..

cd ..

echo "Starting services..."
docker compose -f prod.docker-compose.yml up -d
