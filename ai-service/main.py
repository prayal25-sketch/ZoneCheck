from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np

# In a real scenario, this would load a trained model (e.g., joblib.load('model.pkl'))
# We are mocking the prediction logic based on the requested features.

app = FastAPI(title="ZoneCheck AI Safety Prediction API")

class SafetyPredictionRequest(BaseModel):
    crime_reports_last_7d: int
    crime_reports_last_30d: int
    incident_severity_avg: float
    time_of_day: str # 'day' or 'night'
    day_of_week: str
    crowd_density_estimate: float # 0.0 to 1.0
    proximity_to_police: float # distance in meters
    proximity_to_hospital: float # distance in meters
    historical_safety_score: float # 0 to 100

class SafetyPredictionResponse(BaseModel):
    safetyScore: int
    riskLevel: str
    prediction_confidence: float
    top_risk_factors: List[str]

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AI Service running"}

@app.post("/api/predict-safety", response_model=SafetyPredictionResponse)
def predict_safety(req: SafetyPredictionRequest):
    try:
        # 1. Base score derived from historical data
        score = req.historical_safety_score
        
        risk_factors = []

        # 2. Adjust for recent crimes (Penalty)
        if req.crime_reports_last_7d > 5:
            score -= (req.crime_reports_last_7d * 1.5)
            risk_factors.append("recent-crime-surge")
            
        if req.incident_severity_avg > 3.0: # Assuming 1-4 scale
            score -= 10
            risk_factors.append("high-severity-incidents")

        # 3. Time of day adjustment
        if req.time_of_day.lower() == 'night':
            score -= 15
            risk_factors.append("night-time")
            
        # 4. Crowd density (Too low at night is bad, too high might mean pickpockets)
        if req.crowd_density_estimate < 0.2 and req.time_of_day.lower() == 'night':
            score -= 10
            risk_factors.append("isolated-area")
            
        # 5. Infrastructure boosts
        if req.proximity_to_police < 1000:
            score += 5
            
        # Normalize score between 0 and 100
        final_score = max(0, min(100, int(score)))
        
        # Determine risk level
        if final_score >= 80:
            risk_level = "safe"
        elif final_score >= 60:
            risk_level = "moderate"
        elif final_score >= 40:
            risk_level = "high"
        else:
            risk_level = "critical"

        return SafetyPredictionResponse(
            safetyScore=final_score,
            riskLevel=risk_level,
            prediction_confidence=0.88,
            top_risk_factors=risk_factors[:3] # Return top 3
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
