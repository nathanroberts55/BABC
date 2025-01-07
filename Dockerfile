# Dockerfile

# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.11

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy the post.sh script into the container
COPY ./scripts/post.sh /scripts/post.sh

# Convert Windows line endings to Unix line endings
RUN sed -i 's/\r$//' /scripts/post.sh

# Make the script executable
RUN chmod +x /scripts/post.sh

EXPOSE 8000

