from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.views import description, photo, stash_campaign, submission

origins = [
    '*'
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(description.router, prefix="/api", tags=["description"])
app.include_router(photo.router, prefix="/api", tags=["photo"])
app.include_router(stash_campaign.router, prefix="/api", tags=["Stash campaign"])
app.include_router(submission.router, prefix="/api", tags=["Submission"])


@app.get("/")
async def root():
    return {"message": "Hello World"}
