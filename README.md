## Localhostilla suoritus

Avaa sijainti /server

Suorita: `npm install`

Lisää env. tiedosto sijaintiin /server/src ja täydennä muuttujiin käyttämäsi arvot:

```
salaisuus = "vapaavalintainenSalaus"
uri = "mongodb+srv://kayttajanimi:xxxxx@xxxxxxxx.xxxxx.mongodb.net/databaseName?retryWrites=true&w=majority"
clientUrl = ""
clientUrlTest = "http://localhost:3000/"
PORT = ExpressPort
GQL_PORT = qraphqlPort
URL = "https://aanestajaehdota.com" ***kayttajalle esitettava url***
```

Kaynnista backend:

`npm start`

Avaa sijainti `/client` ja Suorita: `npm install`

Lisää `config.ts` sijaintiin client/src/config

Kirjoita `config.ts` sisään:

```
export const url = "http://localhost:ExpressPort/api"
export const gqlUri = "http://localhost:qraphqlPort/graphql"
export const naytettavaUrl = "http://localhost:KäytettäväPortti.com"
```

käynnistä sovellus:

`npm start`

# Virtuaaliserveri Ubuntu Linux (esim Digitalocean)

## Nginx asennus ja palomuurin konfigurointi

`sudo apt update`

`sudo apt install nginx`

`sudo systemctl start nginx`

`systemctl status nginx`

`sudo ufw allow 'Nginx HTTP'`

`sudo mkdir -p /var/www/sinun_domain/html`

`ln -s /etc/nginx/sites-available/sinun_domain /etc/nginx/sites-enabled/`

`nano /etc/nginx/nginx.conf`

Muokkaa ngingx config server_names_hash_bucket_size kohta seuraavaksi:

```
 /etc/nginx/nginx.conf

...
  http {
    ...
      server_names_hash_bucket_size 64;
    ...
  }
...
```

## PM2 asennus

`npm install pm2 -g`

`pm2 startup systemd`

## Front toimintakuntoon

Lisää `config.ts` sijaintiin `client/src/config`

Kirjoita `config.ts` sisään:

```
export const url = "https://sinunUrl:expressPort/api"
export const gqlUri = "https://sinunUrl:graphqlPort/graphql"
export const naytettavaUrl = "https://sinunUrl.com"
```

Avaa sijainti `/client`

Suorita seuraavat komennot:

`npm install`

`npm build`

## Siirto ja käynnistys serverillä

Siirrä /build sisällä olevat tiedostot ubuntu serverille sijaintiin:

`var/www/sinun_domain/html`

Siirrä /server ubuntu serverille sijaintiin, esimerkissä kansion nimi on vaihdettu todoApp:

`ubuntu_kayttajanimi/todoApp`

Lisää tiedosto env. /server/src ja täydennä muuttujiin käyttämäsi arvot:

```
salaisuus = "vapaavalintainenSalaus"
uri = "mongodb+srv://kayttajanimi:xxxxx@xxxxxxxx.xxxxx.mongodb.net/databaseName?retryWrites=true&w=majority"
clientUrl = ""
clientUrlTest = "http://localhost:3000/"
PORT = ExpressPort
GQL_PORT = GraphqlPort
URL = "https://sinunUrl.com"
```

Luo sinun_domain:

`cd /etc/nginx/sites-available`

`sudo nano sinun_domain`

kirjoita seuraava tiedostoon:

```
server {

  root /var/www/sinun_domain
  index index.html index.htm index.nginx-debian.html

  listen       80;
  server_name  localhost;

  location /api {
    proxy_pass http://localhost:sinun_port;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location /graphql {
    proxy_pass http://localhost:4000; #whatever port your app runs >
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

lisää sites-available tiedosto sites-enabled listaan:

`sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/`

tarkista että kaikki toimii:

`sudo nano /etc/nginx/nginx.conf`

uudelleenkäynnistä Nginx:

`sudo systemctl restart nginx`

Käynnistä sovelluksen back end PM2:lla:

`cd /ubuntu_kayttajanimi/todoApp`

`sudo pm2 start index.js`

Voit vierailla sivulla www.sinun_domain!

## SSL sertifikaatin asetus

`sudo apt install certbot python3-certbot-nginx`

`sudo certbot --nginx -d sinun-url.com -d www.sinun-url.com`

Valitse mieleisesi vaihtoehto esitetyistä vaihtoehdoista.

Voit ottaa automaattisen uusimisen käyttöön:

`sudo systemctl status certbot.timer`

Suoritetaan vielä testaus:

`sudo certbot renew --dry-run`

Valmis!
