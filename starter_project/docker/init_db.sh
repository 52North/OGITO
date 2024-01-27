#!/bin/bash -x
set -e

pg_restore -U postgres -d ogito_data -1 /tmp/ogito_starter_db.sql
