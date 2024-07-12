FROM python:3.12.4-bullseye

WORKDIR /main/

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy poetry.lock* in case it doesn't exist in the repo
COPY ./pyproject.toml ./poetry.lock*  ./alembic.ini /main/

RUN poetry install

COPY ./migrations /main/migrations

COPY ./app /main/app

CMD ["fastapi", "run", "app/main.py", "--port", "$PORT"]