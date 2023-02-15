## Inicjalizacja serwera

Zainstalujcie sobie wcześniej serwer MySQL(https://dev.mysql.com/downloads/installer/)
 - wystarczy tylko mysql server, jak chcecie podgląd do bazy to możecie też pobrać workbencha
 - hasło do roota ustawcie na root
 - port 3306


1. Wpisz `yarn` do terminala w folderze serwer.
2. Wpisz `yarn initdb` do terminala w folderze serwer - inicjalizacja bazy danych.
3. Wpisz `yarn start` do terminala w folderze serwer - uruchomienie serwera i wypisanie w konsoli mockowych danych z bazy.


Jak wywali wam -> Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client

to zróbcie query `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`
(https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server)