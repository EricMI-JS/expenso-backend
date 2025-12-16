# Expenso Backend

Servidor minimal para desarrollar la app Expenso. Persiste en `data.json`.


Instalación y ejecución (NestJS):

```bash
cd expenso-backend
npm install
npm run start:dev
```

Build y producción:

```bash
npm run build
npm start
```

El servidor corre por defecto en `http://localhost:8080` y expone la API en `/api`.

Base de datos PostgreSQL:

La aplicación puede usar la URL proporcionada en la variable de entorno `DATABASE_URL`.
Por defecto se usa la URL incluida en el proyecto (Neon):

```
postgresql://neondb_owner:npg_hECLwug61iXJ@ep-sparkling-wave-adbahr0g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Ejemplo de ejecución con la URL y puerto personalizados:

```bash
cd expenso-backend
DATABASE_URL="<tu_url>" PORT=8080 npx ts-node-dev --respawn --transpile-only src/main.ts
```

Endpoints principales:
- `GET /api/expenses` - lista gastos (filtros: `month`, `year`, `type`, `category`, `limit`, `offset`)
- `POST /api/expenses` - crear gasto
- `PUT /api/expenses/:id` - actualizar gasto
- `DELETE /api/expenses/:id` - eliminar gasto
- `GET /api/goals` - lista metas
- `POST /api/goals` - crear meta
- `PUT /api/goals/:id` - actualizar meta
- `DELETE /api/goals/:id` - eliminar meta
- `POST /api/goals/:goalId/deposits` - agregar depósito a meta
- `DELETE /api/goals/:goalId/deposits/:transactionId` - eliminar depósito

Nota: Este backend es para desarrollo local y usa archivo JSON como almacenamiento. Para producción usar una base de datos.
# expenso-backend
