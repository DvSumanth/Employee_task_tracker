


from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    employee_name: str
    status: str = "pending"


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    employee_name: str | None = None
    status: str | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    employee_name: str
    status: str

    class Config:
        from_attributes = True
