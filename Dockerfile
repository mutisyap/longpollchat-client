FROM nginx:stable

COPY dist/longpollchatclient /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf