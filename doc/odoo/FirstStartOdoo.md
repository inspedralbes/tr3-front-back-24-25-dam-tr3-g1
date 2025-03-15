# Documentació ODOO
## Iniciant ODOO per primera vegada

Quan s'inicia ODOO per primera vegada, s'ha de crear la base de dades amb la següent comanda:

```bash
odoo -d odoo -i base --without-demo=all --stop-after-init
```

Aquesta comanda es pot executar des de Docker Desktop.

A continuació, reiniciem el docker:

docker-compose restart

## Credencials d'accés

Les credencials per defecte són:

- Usuari: `admin`
- Contrasenya: `admin`