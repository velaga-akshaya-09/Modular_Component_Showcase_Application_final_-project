import os
from dotenv import load_dotenv

load_dotenv()

SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8000")
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DATABASE = os.getenv("MONGO_DATABASE", "component_showcase")