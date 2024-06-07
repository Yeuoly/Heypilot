use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
#[derive(Clone)]
pub struct ScenarioItem {
    pub id: String,
    pub label: String,
    pub active: bool
}

#[derive(Deserialize)]
#[derive(Serialize)]
#[derive(Clone)]
pub struct ScenarioClickPayload {
    pub id: String
}

