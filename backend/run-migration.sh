#!/bin/bash

# Run the migration to add logo column to maquinetas table
echo "Running migration to add logo column to maquinetas table..."

cd backend
npx sequelize-cli db:migrate

echo "Migration completed!" 