cd backend:
docker-compose up -d
run: nvm use 16
run: yarn
run: npx nestjs-command seeder
run: npm run start:dev


cd admin-board:
run: yarn
run: npm run start

admin/12345
operator/12345