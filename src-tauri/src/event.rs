// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{App, AppHandle, Event, Manager};

use crate::selection::replace_context_with_selection;
use crate::system_tray::create_system_tray;
use crate::screenshot::screenshot;

pub const EVENT_REFRESH_SCENARIOS: &str = "refresh-scenarios";
pub const EVENT_SCREENSHOT: &str = "screenshot";
pub const EVENT_SCREENSHOT_RESPONSE: &str = "screenshot-response";
pub const EVENT_CLICK_SCENARIO: &str = "click-scenario";
pub const EVENT_QUIT: &str = "quit";
pub const EVENT_REPLACE_CONTEXT_WITH_SELECTION: &str = "replace-context-with-selection";
pub const EVENT_REPLACE_CONTEXT_WITH_SELECTION_RESPONSE: &str = "replace-context-with-selection-response";

pub fn mount_event_listener(app: &mut App) {
    {
        let app_handle = app.app_handle();
        app.listen_global(EVENT_REFRESH_SCENARIOS, move |event| {
            set_system_tray(&app_handle, event);
        });
    }

    {
        let app_handle = app.app_handle();
        app.listen_global(EVENT_SCREENSHOT, move |event| {
            screenshot(&app_handle, event);
        });
    }

    {
        let app_handle = app.app_handle();
        app.listen_global(EVENT_REPLACE_CONTEXT_WITH_SELECTION, move |event| {
            replace_context_with_selection(&app_handle, event);
        });
    }
}

fn set_system_tray(app_handle: &AppHandle, event: Event) {
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
}