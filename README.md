# Getting Started

## Start client
  1. Step 1: Change info project directory

  ```bash
  cd client
  ```
  2. Step 2: Install npm

  ```bash
  Npm install
  ```
  3. Step 1: Start interface

  ```bash
  npm run dev
  ```

## Start server
  ### Step 1
  ![Giao diện đăng nhập](./desc/add_database_chat_app.png)
  1. Install Xampp
  2. Create a database with the name "chat_app"

  ### Step 2
  #### With Window
  1. Install WSL2
  2. Open WSL on Window
  3. Install redis-server

      1. Step 1:

      ```bash
      sudo apt-add-repository ppa:redislabs/redis
      ```
      2. Step 2:

      ```bash
      sudo apt-get update
      ```
      3. Step 1:

      ```bash
      sudo apt-get upgrade
      ```
      4. Step 2:

      ```bash
      sudo apt-get install redis-server
      ```

  4. Run redis-server

    ```bash
    sudo service redis-server restart
    ```


  ### Step 3
  1. Change into the project directory:

    ```bash
    cd server
    ```

  2. Install pipenv:

    ```bash
    pip install pipenv
    ```

  3. Activate vitural the environment
    ```bash
    pipenv shell
    ```

  4. Update database
    ```bash
    python manage.py migrate
    ```
  5. Start server
    ```bash
    python manage.py runserver
    ```