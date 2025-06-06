from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database (in real app, use SQLAlchemy with PostgreSQL)
users_db = {}
courses_db = []
reviews_db = []

# Models
class User(BaseModel):
    username: str
    email: str
    full_name: str
    disabled: bool = False
    is_admin: bool = False

class Course(BaseModel):
    id: str
    title: str
    description: str
    instructor: str
    price: float
    thumbnail_url: Optional[str] = None
    is_published: bool = False

class Review(BaseModel):
    id: str
    course_id: str
    user_id: str
    rating: int
    comment: str

# Auth setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helper functions
def get_current_user(token: str = Depends(oauth2_scheme)):
    # In real app, verify JWT token
    user = users_db.get(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

# Routes
@app.post("/register")
async def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    users_db[user.username] = user
    return {"message": "User created successfully"}

@app.post("/courses")
async def create_course(
    course: Course, 
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can create courses")
    courses_db.append(course)
    return course

@app.get("/courses", response_model=List[Course])
async def get_courses():
    return [course for course in courses_db if course.is_published]

@app.post("/upload-thumbnail")
async def upload_thumbnail(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can upload thumbnails")
    
    # Save file (in real app, use cloud storage like S3)
    file_location = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    return {"filename": file.filename, "url": f"/{file_location}"} 