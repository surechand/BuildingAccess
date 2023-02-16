## Serwer Node.js dla projektu

Technologie:

- Node 18.12
- Socket.io v4
- Yarn classic v1.22.19
- MySQL 8.0

Instrukcja uruchomienia:

- przejście do folderu projektu "cd server"
- w konsoli:
  1. `yarn` - aktualizacja paczek projektu
  2. `yarn initdb` - inicjalizacja bazy danych
  3. `yarn start` - uruchomienie serwera

W przypadku błędu: "Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client"

należy w MySQL Command Line Client wpisać query `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`
a następnie `flush privileges`.
(https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server)

Dostęp do danych poprzez http://localhost:4000
