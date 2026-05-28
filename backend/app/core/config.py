from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = 'College Discovery API'
    database_url: str = 'postgresql+psycopg://postgres:postgres@localhost:5432/college_discovery'
    cors_origins: list[str] = ['http://localhost:5173']
    auto_create_tables: bool = False

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')


settings = Settings()