# Rupiah Reader CC

## Tech Stack:
- Express js
- Google Cloud Run
- Google Cloud Storage
- Firestore
- Docker
- Postman

## General Architecture
![cloud-architecture](https://github.com/Rupiah-Reader-C241-PS460/CC-Progress/assets/156647404/5d48d6c2-db64-414a-bacf-70fd83fcdac5)

1. Users interact with the mobile app.
2. The mobile app communicates with the backend API to request predictions to the Web Server / API (Backend) which deployed on Google Cloud Run.
3. The backend receives the requests from the mobile app and accesses Machine Learning Model that stored in Google Cloud Storage
4. The image is processed and generate prediction and store the results in firestore

## Endpoints
- Route: **POST** /predict

### Making Request
- HTTP Method : POST
- Request Body:
  image (file): The image file to upload. Supported formats: JPEG, PNG.
- JSON Response:
```
{
    "status": "success",
    "message": "Model is predicted successfully",
    "data": {
        "id": "85d750ac-818f-44cf-8dba-1d9e75a79388",
        "result": "5 Ribu",
        "suggestion": "Prediksi uang: 5 Ribu",
        "createdAt": "2024-06-12T21:36:12.326Z"
    }
}
```


