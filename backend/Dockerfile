# FROM python:3.9-slim
#
# WORKDIR /app
#
# COPY backend/requirements.txt /app/requirements.txt
# RUN pip install -r requirements.txt
#
# COPY backend /app
#
# EXPOSE 5000
#
# ENV FLASK_APP=app.py
# ENV FLASK_ENV=production
#
# CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]

FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt /app/requirements.txt
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y --auto-remove gcc && \
    rm -rf /var/lib/apt/lists/*

COPY backend /app

EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_ENV=production

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
