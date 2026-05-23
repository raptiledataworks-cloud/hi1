"""MongoDB database connection and collections."""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# MongoDB client and database
client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None

# Collections
users_collection = None
transactions_collection = None
accounts_collection = None
goals_collection = None
habits_collection = None
budget_settings_collection = None
password_resets_collection = None


async def connect_to_mongo():
    """Connect to MongoDB and initialize collections."""
    
    global client, db
    global users_collection, transactions_collection, accounts_collection
    global goals_collection, habits_collection, budget_settings_collection
    global password_resets_collection

    try:
        logger.info(f"🔌 Connecting to MongoDB: {settings.MONGODB_URL[:50]}...")
        
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.MONGODB_DB_NAME]

        # Initialize collections
        users_collection = db["users"]
        transactions_collection = db["transactions"]
        accounts_collection = db["accounts"]
        goals_collection = db["goals"]
        habits_collection = db["habits"]
        budget_settings_collection = db["budget_settings"]
        password_resets_collection = db["password_resets"]

        # Test connection
        await client.admin.command("ping")
        logger.info("✅ Connected to MongoDB successfully!")
        
        return True

    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {str(e)}")
        logger.error(f"Connection string format: mongodb+srv://user:pass@cluster.mongodb.net/dbname")
        raise


async def close_mongo_connection():
    """Close MongoDB connection."""

    global client

    if client:
        client.close()
        logger.info("✅ Closed MongoDB connection")