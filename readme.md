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

