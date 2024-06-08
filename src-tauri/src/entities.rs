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
pub struct ScreenShotResponsePayload {
    pub error: String,
    pub image: String
}

#[derive(Deserialize)]
#[derive(Clone)]
pub struct MoveToAndSetOnTopPayload {
    pub width: i32,
    pub height: i32,
    pub x: i32,
    pub y: i32
}
