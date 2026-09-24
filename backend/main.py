from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import resend
import os
from typing import Any, cast
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
YOUR_EMAIL = os.getenv("YOUR_EMAIL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://v2-portfolio-website-three.vercel.app"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

@app.post("/api/contact")
async def contact(form: ContactForm):
    params = {
        "from": "Portfolio Contact <onboarding@resend.dev>",
        "to": [YOUR_EMAIL],
        "reply_to": form.email,
        "subject": f"[{form.subject}] from {form.name}",
        "html": f"""
            <h2>New message from your portfolio</h2>
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Email:</strong> {form.email}</p>
            <p><strong>Subject:</strong> {form.subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>{form.message}</p>
        """
    }
    resend.Emails.send(cast(Any, params))
    return {"status": "sent"}