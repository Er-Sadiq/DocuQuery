from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import fitz  

app = FastAPI()

# Allow CORS for specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # Log the file's content type for debugging
    print(f"Received file with content type: {file.content_type}")

    # Check if the file is a PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Define file path for saving the PDF
    file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)

   
    try:
        with open(file_location, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        print(f"Failed to save file: {e}")
        raise HTTPException(status_code=500, detail="Failed to save the file")

    # Extract text from the PDF
    try:
        pdf_text = ""
        with fitz.open(file_location) as pdf_document:
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                page_text = page.get_text()
                pdf_text += page_text

        # Print the extracted text to the backend console
        print("Extracted PDF Text:")
        print(pdf_text)  # This prints the entire text extracted from the PDF

        # Optional: Return the text in the response
        return JSONResponse(page_text)
    except Exception as e:
        print("Error while reading PDF:", e)
        raise HTTPException(status_code=500, detail="Failed to read PDF file")
