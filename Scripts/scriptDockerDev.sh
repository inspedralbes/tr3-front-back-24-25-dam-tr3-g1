cd ..

cd vue

cd vuetify-project

npm i

npm run build

cd ..

cd ..

echo "Starting services..."
docker compose -f prod.docker-compose.yml up -d
