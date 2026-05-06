import asyncpg
import os

DATABASE_URL = "postgresql://postgres:123140200@localhost:5432/SIG_123140200"
pool = None
async def get_pool():
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(DATABASE_URL)
    return pool

async def close_pool():
    global pool
    if pool is not None:
        await pool.close()