from pydantic import BaseModel

class Description(BaseModel):
    hash: str
    content: str

    class Config:
        orm_mode = True

class DescriptionRequest(BaseModel):
    content: str