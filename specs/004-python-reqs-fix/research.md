# Research: Python 3.14 Compatibility

## Decision: Upgrade Django to >=5.1
**Rationale:** Django 4.2 officially supports up to Python 3.12 (and partially 3.13). To support Python 3.14 while maintaining backward compatibility with Python 3.10, we need to upgrade to Django 5.1 or 5.2.
**Alternatives considered:** Keeping Django 4.2.11 and applying patches, but this is unsustainable and error-prone.

## Decision: Upgrade `psycopg2-binary` or migrate to `psycopg[binary]` (version 3)
**Rationale:** `psycopg2-binary` version `2.9.10` likely lacks pre-compiled wheels for Python 3.14, causing the installation to attempt a source build which fails without C compilers. We can either bump it to the latest version that has 3.14 wheels or migrate to `psycopg[binary]` (psycopg3). For simplicity of the fix, we will bump versions of dependencies like `psycopg2-binary` to their latest releases.
**Alternatives considered:** Forcing developers to install C compilers. Rejected as it degrades the developer experience.

## Decision: Remove `backports.zoneinfo`
**Rationale:** The `backports.zoneinfo` package is only required for Python versions older than 3.9. Since our new requirement specifies support for Python 3.10 through 3.14, we can safely remove this dependency to avoid any packaging confusion.
**Alternatives considered:** Keeping it with the environment marker `; python_version < "3.9"`. Removing it is cleaner.
