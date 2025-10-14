FROM postgres:17

COPY init.sql /docker-entrypoint-initdb.d/
RUN chmod 755 /docker-entrypoint-initdb.d/init.sql
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U ${POSTGRES_USER} || exit 1
EXPOSE 5432
VOLUME ["/var/lib/postgresql/data"]