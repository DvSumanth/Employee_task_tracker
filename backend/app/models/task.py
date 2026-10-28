



from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    employee_name = Column(String, nullable=False)
    status = Column(String, default="pending")
