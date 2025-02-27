from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def test_mongodb_connection():
    try:
        # Get MongoDB connection string from environment variable
        mongodb_uri = os.getenv('MONGODB_URI')
        
        if not mongodb_uri:
            raise ValueError("MongoDB URI not found in environment variables")

        # Create MongoDB client
        client = MongoClient(mongodb_uri)
        
        # Access your database (replace 'MediScript' with your database name)
        db = client.MediScript
        
        # Test connection by listing collections
        collections = db.list_collection_names()
        print("Successfully connected to MongoDB!")
        print("Available collections:", collections)
        
        # Test query to Users collection
        users_collection = db.Users
        sample_user = users_collection.find_one()
        print("\nSample user from database:", sample_user)
        
        return True
        
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

if __name__ == "__main__":
    test_mongodb_connection() 