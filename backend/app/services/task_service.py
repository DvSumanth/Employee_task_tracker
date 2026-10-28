



from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import task_repository


def create_task(db: Session, data):
    return task_repository.create_task(db, data)


def get_all_tasks(db: Session):
    return task_repository.get_all_tasks(db)


def get_task(db: Session, task_id: int):
    task = task_repository.get_task(db, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


def update_task(db: Session, task_id: int, data):
    task = get_task(db, task_id)
    return task_repository.update_task(db, task, data)


def delete_task(db: Session, task_id: int):
    task = get_task(db, task_id)
    task_repository.delete_task(db, task)

    return {"message": "Task deleted successfully"}
