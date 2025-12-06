

1、先 cd 到 nginx_log_reg_mysql 所在的目录下
2、执行 docker-compose up -d --build

(如果出现错误，需要执行 docker-compose down 删除容器和镜像，重新执行 docker-compose up -d --build构建镜像和容器)


下面是注册
    zfx@zfxpc:~$ curl -X 'POST' \
    'http://localhost/register' \
    -H 'Content-Type: application/json' \
    -d '{
    "email": "testuser@example.com",
    "password": "testpassword123",
    "invite_code": "ABC123"
    }'
    {"detail":"Email already exists"}zfx@zfxpc:~$ 
下面是登陆
    zfx@zfxpc:~$ curl -X POST http://localhost/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "testuser@example.com",
        "password": "testpassword123"
    }' \
    -c cookies.txt \
    -v
    Note: Unnecessary use of -X or --request, POST is already inferred.
    * Uses proxy env variable no_proxy == 'localhost,127.0.0.0/8,::1'
    *   Trying 127.0.0.1:80...
    * Connected to localhost (127.0.0.1) port 80 (#0)
    > POST /login HTTP/1.1
    > Host: localhost
    > User-Agent: curl/7.81.0
    > Accept: */*
    > Content-Type: application/json
    > Content-Length: 76
    > 
    * Mark bundle as not supporting multiuse
    < HTTP/1.1 200 OK
    < Server: nginx/1.23.4
    < Date: Wed, 19 Nov 2025 11:14:18 GMT
    < Content-Type: application/json
    < Content-Length: 70
    < Connection: keep-alive
    * Added cookie session_id="c7f48a01-0e04-4dd3-ad03-16c0eb5fe58c" for domain localhost, path /, expire 1764155658
    < set-cookie: session_id=c7f48a01-0e04-4dd3-ad03-16c0eb5fe58c; HttpOnly; Max-Age=604800; Path=/; SameSite=lax
    < 
    * Connection #0 to host localhost left intact
    {"message":"Login success","user_id":1,"email":"testuser@example.com"}zfx@zfxpc:~$ 

下面是cookie存储到redis
    zfx@zfxpc:~/programfiles/APP/nginx_log_reg_mysql$ docker exec -it redis redis-cli
    127.0.0.1:6379> KEYS session:*
    1) "session:c7f48a01-0e04-4dd3-ad03-16c0eb5fe58c"
    127.0.0.1:6379> exit
    zfx@zfxpc:~/programfiles/APP/nginx_log_reg_mysql$ 