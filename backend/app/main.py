from fastapi import FastAPI


from app.views import description, photo

app = FastAPI()

app.include_router(description.router, prefix="/api", tags=["description"])
app.include_router(photo.router, prefix="/api", tags=["photo"])

@app.get("/")
async def root():
    return {"message": "Hello World"}
