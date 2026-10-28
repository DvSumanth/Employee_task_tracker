

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.task import Task
from app.routers.task_router import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Task Tracker")

# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register task API routes
app.include_router(router)


@app.get("/")
def home():
    return {"message": "Employee Task Tracker is running"}
