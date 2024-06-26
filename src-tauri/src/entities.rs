use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
#[derive(Clone)]
pub struct ScenarioItem {
    pub id: String,
    pub label: String,
    pub active: bool
}

#[derive(Serialize)]
#[derive(Clone)]
pub struct ScenarioClickPayload {
    pub id: String
}


#[derive(Deserialize)]
#[derive(Clone)]
pub struct ScreenShotRequestPayload {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
    pub monitor: i32
}

#[derive(Serialize)]
#[derive(Clone)]
pub struct ReplaceContextWithSelectionResponse {
    pub selection: String
}

#[derive(Serialize)]
#[derive(Clone)]
pub struct ScreenShotResponsePayload {
    pub error: String,
    pub path: String
}

#[derive(Serialize)]
#[derive(Clone)]
pub struct MouseCircleEventPayload {
    pub round: f64,
    pub position: (i32, i32)
}