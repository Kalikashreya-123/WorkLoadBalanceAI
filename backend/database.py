import mysql.connector

def get_database_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Kalika@123",
        database="WorkBalanceAI"
    )

    return connection