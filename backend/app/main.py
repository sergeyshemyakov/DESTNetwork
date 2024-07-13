from fastapi import FastAPI


from app.views import description, photo, stash_campaign

app = FastAPI()

app.include_router(description.router, prefix="/api", tags=["description"])
app.include_router(photo.router, prefix="/api", tags=["photo"])
app.include_router(stash_campaign.router, prefix="/api", tags=["Stash campaign"])

@app.get("/")
async def root():
    return {"message": "Hello World"}
