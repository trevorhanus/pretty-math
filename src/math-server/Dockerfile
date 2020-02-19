FROM python:3.6-alpine

WORKDIR /home/

COPY requirements.txt .

RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn

COPY boot.sh wsgi.py ./
COPY symserver symserver

RUN chmod +x boot.sh

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]
