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
### Step 1: Setup Mysql and Redis using docker (Required: Install Docker)
1. Open a terminal in the project directory.
2. Change into the project directory:
   ```bash
   cd server/database
   ```
3. Build the Docker image:
   ```bash
   docker-compose build
   ```
4. Run the Docker containers:
   ```bash
   docker-compose up
   ```

#### Note for accessing MySQL in Docker
1. Open a new terminal.
2. Command to list all containers:
   ```bash
   docker container ls
   ```
3. Copy the `container_id` of the running MySQL container.
4. Access the MySQL container's command line:
   ```bash
   docker exec -it container_id /bin/bash
   ```
5. Access MySQL prompt:
   ```bash
   mysql -ppass -uroot
   ```
   Replace `pass` with the actual MySQL root password.
6. List all databases in MySQL:
   ```bash
   show databases;
   ```

### Step 2: Django Setup - Use python version 3.12
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
   python manage.py runserver
   ```