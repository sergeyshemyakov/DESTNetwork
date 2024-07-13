import hashlib
import io

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from app import models

router = APIRouter()

from app.dependencies import get_db

@router.get("/photos/{photo_hash}", )
def get_photo(photo_hash: str, session=Depends(get_db)):
    photo = session.query(models.Photo).get(photo_hash)
    img = io.BytesIO(photo.image)
    img.seek(0)
    return StreamingResponse(
        img, media_type="image/jpeg",
        headers={
            'Content-Disposition': 'inline; filename="%s.jpg"' %(photo_hash,)
        }
    )


@router.post("/photos/upload")
def save_photo(image: UploadFile, session=Depends(get_db)):
    image_content = image.file.read()
    image_hash = hashlib.sha256(image_content).hexdigest()
    instance = session.query(models.Photo).get(image_hash)
    if instance:
        return {"success": True, "photo_hash": image_hash, "details": "photo_already_exists"}
    
    photo = models.Photo(
        image=image_content,
        hash=image_hash
    )
    session.add(photo)
    session.commit()
    return {"success": True, "photo_hash": image_hash}
