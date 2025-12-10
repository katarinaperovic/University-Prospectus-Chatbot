FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
COPY app.py .
COPY RAG.py .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python", "app.py"]