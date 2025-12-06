（默认你安装好了docker和docker-compose，并且配置好了镜像源）

1. 进入项目目录下，然后docker-compose up -d --build

2. 前面的步骤都正确执行的话，容器就已经起好了
    zfx@LAPTOP-O0M0DVI1:~/yuhonglinchuang/hanyuAPP/hanyuAPP/Kanatara/public/VEDIO$ docker ps
    CONTAINER ID   IMAGE                   COMMAND                  CREATED       STATUS                   PORTS                                         NAMES
    55ba18317006   nginx:1.23              "/docker-entrypoint.…"   2 hours ago   Up 2 hours (unhealthy)   0.0.0.0:80->80/tcp, [::]:80->80/tcp           nginx
    1536c1994a6f   hanyuapp_app_login      "uvicorn login:app -…"   2 hours ago   Up 2 hours (healthy)                                                   login_server_1
    360bb9e8d550   hanyuapp_app_register   "uvicorn register:ap…"   2 hours ago   Up 2 hours (healthy)                                                   register_server_1
    17cdd37e4010   redis:7-alpine          "docker-entrypoint.s…"   2 hours ago   Up 2 hours               0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp   redis
    5113a3a302f0   mysql:8.0               "docker-entrypoint.s…"   2 hours ago   Up 2 hours               127.0.0.0:3306->3306/tcp, 33060/tcp           mysql
    edc7c60df099   hanyuapp_kanatara       "sh -c 'npm install …"   2 hours ago   Up 2 hours               0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp   Kanatara
    zfx@LAPTOP-O0M0DVI1:~/yuhonglinchuang/hanyuAPP/hanyuAPP/Kanatara/public/VEDIO$ 

3. video播放的时候没有画面：
    1、sudo apt  install ffmpeg
    2、ffmpeg -i 1.mp4 -vcodec libx264 -acodec aac 1.mp4

4. 遇到问题好像是目前的这个（ERROR:login:Health check failed: (pymysql.err.OperationalError) (1045, "Access denied for user 'appuser'@'172.20.0.6' (using password: YES)")）：
    下面是解决方法：
        1. 进入mysql容器：docker exec -it mysql mysql -u root -proot
        2. mysql中输入：
            CREATE USER 'appuser'@'%' IDENTIFIED WITH mysql_native_password BY 'app_pass_123';
            GRANT ALL PRIVILEGES ON users.* TO 'appuser'@'%';
            FLUSH PRIVILEGES;
            ALTER USER 'appuser'@'%' IDENTIFIED WITH mysql_native_password BY 'app_pass_123';
            FLUSH PRIVILEGES;
        3. 退出mysql容器，进入到login_server_1：
            docker exec -it login_server_1 bash
            apt update && apt install -y mysql-client
            mysql -h mysql -u appuser -papp_pass_123 users  #测试login_server_1能否登录到mysql
        4. 重启login_server_1：
            docker compose up -d --build app_login
        5. 重启nginx：
            docker compose up -d --build nginx






