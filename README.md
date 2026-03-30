# Mobility Feed API

[![Build & Test](https://github.com/MobilityData/mobility-feed-api/actions/workflows/build-test.yml/badge.svg)](https://github.com/MobilityData/mobility-feed-api/actions/workflows/build-test.yml)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Docker Image](https://ghcr.io/MobilityData/mobility-feed-api)](https://github.com/MobilityData/mobility-feed-api/pkgs/container/mobility-feed-api)

The Mobility Feed API serves a list of open mobility data sources from around the world. It is the API layer for the [Mobility Database](https://mobilitydatabase.org/).

The full database contents are available in CSV format [here](https://files.mobilitydatabase.org/feeds_v2.csv).
The CSV schema is documented [here](docs/SpreadsheetSchemaV2.md).

---

## Getting Started (Local Development)

Any contributor can build and run the API locally using Docker and Python — no cloud account required.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- Python 3.10+
- Java 11+ (required by the OpenAPI code generator)

### 1. Set up the OpenAPI generator

```bash
scripts/setup-openapi-generator.sh
```

### 2. Start the local database

This starts a PostgreSQL + PostGIS database and runs the Liquibase migrations automatically.

```bash
docker compose --env-file ./config/.env.local up -d
```

### 3. Install Python dependencies

```bash
cd api
pip install -r requirements.txt
pip install -r requirements_dev.txt
```

### 4. Generate code stubs

```bash
scripts/db-gen.sh    # generates SQLAlchemy models from the DB schema
scripts/api-gen.sh   # generates FastAPI stubs from the OpenAPI spec
```

### 5. Start the API

```bash
scripts/api-start.sh
```

The API is now running at **http://localhost:8080/docs** (Swagger UI).

---

## Running Tests

```bash
scripts/api-tests.sh                        # all API unit tests
scripts/api-tests.sh <filename>.py          # single test file
scripts/api-tests.sh --folder api --html_report  # with HTML coverage report
```

Tests run against a local PostgreSQL container — no cloud credentials needed.

---

## Bring Your Own Database

By default, the API connects to the local Docker Compose database. To use your own PostgreSQL instance, set the `FEEDS_DATABASE_URL` environment variable before starting the API:

```bash
export FEEDS_DATABASE_URL=postgresql://user:password@host:5432/MobilityDatabase
scripts/api-start.sh
```

Your database must have the PostGIS extension and the schema applied via Liquibase (see the `liquibase/` directory).

---

## Project Structure

| Directory | Description |
|-----------|-------------|
| `api/` | Python FastAPI application |
| `liquibase/` | Database schema and migrations |
| `functions/` | Firebase token generation functions |
| `functions-python/` | Python batch processing functions |
| `config/` | Local environment configuration |
| `docker-compose.yaml` | Local PostgreSQL + PostGIS + Liquibase stack |
| `scripts/` | Local development scripts |
| `docs/` | Documentation and schema visualization |

---

## Docker Image

The API is published as a Docker image to GitHub Container Registry on every merge to `main` and on each release tag:

```
ghcr.io/mobilitydata/mobility-feed-api:latest
ghcr.io/mobilitydata/mobility-feed-api:v1.2.3
```

---

## API Authentication

The public production API at [mobilitydatabase.org](https://mobilitydatabase.org) requires authentication.
For local development, authentication is disabled by default.

---

## Contributing

1. Fork this repository
2. Follow the local setup steps above to verify everything builds and tests pass
3. Make your changes
4. Run `scripts/lint-tests.sh` and `scripts/api-tests.sh`
5. Open a pull request

### Code Style

```bash
scripts/lint-write.sh   # auto-format with Black
scripts/lint-tests.sh   # check formatting and linting
```

### Database Schema Changes

If your change requires a schema migration, add a new SQL file to `liquibase/changes/` and register it in `liquibase/changelog.xml`. Run `scripts/db-gen.sh` to regenerate the SQLAlchemy models.

---

## Related Projects

- [mobility-database-catalogs](https://github.com/MobilityData/mobility-database-catalogs) — source CSV catalog
- [mobilitydatabase-web](https://github.com/MobilityData/mobilitydatabase-web) — the web frontend
