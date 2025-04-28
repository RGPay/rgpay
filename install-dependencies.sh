#!/bin/bash

# Navigate to frontend directory
cd frontend

# Install required dependencies for UI
npm install --save @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install --save @mui/x-date-pickers date-fns
npm install --save formik yup
npm install --save echarts
npm install --save axios

# Install TypeScript type definitions
npm install --save-dev @types/react @types/react-dom
npm install --save-dev @types/echarts @types/date-fns

# Navigate to backend directory
cd ../backend

# Install required dependencies for backend
npm install --save @nestjs/common @nestjs/core @nestjs/platform-express
npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
npm install --save @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
npm install --save class-validator class-transformer
npm install --save bcrypt

# Install TypeScript type definitions
npm install --save-dev @types/express @types/sequelize @types/passport-jwt @types/passport-local
npm install --save-dev @types/bcrypt

# Return to root directory
cd ..

echo "All dependencies installed successfully!" 