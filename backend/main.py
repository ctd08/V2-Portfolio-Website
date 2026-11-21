import html
import os

import resend
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
YOUR_EMAIL = os.getenv("YOUR_EMAIL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://v2-portfolio-website-three.vercel.app",
    ],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


@app.post("/api/contact")
def contact(form: ContactForm):
    name = html.escape(form.name)
    subject = html.escape(form.subject)
    message = html.escape(form.message).replace("\n", "<br>")

    params = {
        "from": "Portfolio Contact <onboarding@resend.dev>",
        "to": [CRISTINA.TUTUNARIU@YAHOO.COM],
        "reply_to": form.email,
        "subject": f"[{form.subject}] from {form.name}",
        "html": f"""
            <h2>New message from your portfolio</h2>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {html.escape(form.email)}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>{message}</p>
        """,
    }

    try:
        resend.Emails.send(params)
    except Exception as e:
        print("Resend error:", e)
        raise HTTPException(status_code=500, detail=f"Email could not be sent: {e}")

    return {"status": "sent"}