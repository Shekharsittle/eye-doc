
#!/bin/bash

# Exit on error
set -e

echo "========================================================"
echo "   Dr. Mrityunjay Singh AI - Cloud Run Deployer"
echo "========================================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed. Please install Google Cloud SDK."
    exit 1
fi

# Prompt for Project ID
read -p "Enter your Google Cloud Project ID: " PROJECT_ID
if [ -z "$PROJECT_ID" ]; then
    echo "Error: Project ID is required."
    exit 1
fi

# Prompt for API Key (hidden input)
read -s -p "Enter your Gemini API Key: " API_KEY
echo ""
if [ -z "$API_KEY" ]; then
    echo "Error: API Key is required."
    exit 1
fi

# Set the project
echo "Setting Google Cloud project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable necessary services
echo "Enabling Cloud Build and Cloud Run services..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com

# Build the container image using Cloud Build
IMAGE_NAME="gcr.io/$PROJECT_ID/dr-singh-ai"
echo "Building container image: $IMAGE_NAME..."
echo "This may take a few minutes..."

gcloud builds submit --tag $IMAGE_NAME --build-arg API_KEY=$API_KEY .

# Deploy to Cloud Run
SERVICE_NAME="dr-singh-ai"
REGION="us-central1"

echo "Deploying to Cloud Run service: $SERVICE_NAME..."

gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi

echo "========================================================"
echo "Deployment Complete!"
echo "Your app is live at the URL listed above."
echo "========================================================"
