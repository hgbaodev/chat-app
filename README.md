# Getting Started

## Download Project
1. Change into the project directory

   ```bash
   git clone https://github.com/hgbaodev/chat-app.git
   ```
   
2. Navigate to the project directory

   ```bash
   cd chat-app
   ```

## Start Client
### Requirement: Use Node.js v20.11.0
1. Change into the client directory

   ```bash
   cd client
   ```

2. Install npm dependencies

   ```bash
   npm install
   ```

3. Start the client interface

   ```bash
   npm run dev
   ```

## Start Server
### Django Setup - Use python version 3.12
1. Change into the project directory:
   ```bash
   cd server
   ```
2. Install pipenv:
   ```bash
   pip install pipenv
   ```
3. Activate the virtual environment:
   ```bash
   pipenv shell
   ```
4. Update the database:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   danphe config.asgi:application
   ```
