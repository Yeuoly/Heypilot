// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{App, Manager};

use crate::system_tray::create_system_tray;

pub const EVENT_REFRESH_SCENARIOS: &str = "refresh-scenarios";
pub const EVENT_CLICK_SCENARIO: &str = "click-scenario";
pub const EVENT_QUIT: &str = "quit";

pub fn mount_event_listener(app: &mut App) {
    let app_handle = app.app_handle();
    app.listen_global(EVENT_REFRESH_SCENARIOS, move |event| {
        let payload_str = event.payload().unwrap();
        let payload = serde_json::from_str::<Vec<crate::entities::ScenarioItem>>(payload_str);
        
        if let Ok(scenarios) = payload {
            let result = app_handle.tray_handle().set_menu(
                create_system_tray(scenarios)
            );

            if let Err(e) = result {
                eprintln!("Error setting system tray menu: {}", e);
            }
        }
    });
}