from fastapi import FastAPI


from app.views import description

app = FastAPI()

app.include_router(description.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Hello World"}
