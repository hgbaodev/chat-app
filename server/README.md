## Started Server

### Step 1: Setup Docker (Required: Install Docker)
1. Open a terminal in the project directory.
2. Change into the project directory:
   ```bash
   cd server/mysql
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

### Step 2: Setup Redis on Windows
1. Install WSL2.
2. Open WSL on Windows.
3. Install redis-server:
   - Step 1:
     ```bash
     sudo apt-add-repository ppa:redislabs/redis
     ```
   - Step 2:
     ```bash
     sudo apt-get update
     ```
   - Step 3:
     ```bash
     sudo apt-get upgrade
     ```
   - Step 4:
     ```bash
     sudo apt-get install redis-server
     ```

4. Run redis-server:
   ```bash
   sudo service redis-server restart
   ```

### Step 3: Django Setup
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