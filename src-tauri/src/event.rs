// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{App, AppHandle, Event, Manager};

use crate::system_tray::create_system_tray;
use crate::screenshot::screenshot;
use crate::window::{move_to_and_set_on_top, set_not_on_top};

pub const EVENT_REFRESH_SCENARIOS: &str = "refresh-scenarios";
pub const EVENT_SCREENSHOT: &str = "screenshot";
pub const EVENT_SCREENSHOT_RESPONSE: &str = "screenshot-response";
pub const EVENT_CLICK_SCENARIO: &str = "click-scenario";
pub const EVENT_MOVE_TO_AND_SET_ON_TOP: &str = "move-to-and-set-on-top";
pub const EVENT_SET_NOT_ON_TOP: &str = "set-not-on-top";
pub const EVENT_SLIDE_FOCUS_INPUT: &str = "slide-focus-input";
pub const EVENT_QUIT: &str = "quit";

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
        app.listen_global(EVENT_MOVE_TO_AND_SET_ON_TOP, move |event| {
            move_to_and_set_on_top(&app_handle, event);
        });
    }

    {
        let app_handle = app.app_handle();
        app.listen_global(EVENT_SET_NOT_ON_TOP, move |event| {
            set_not_on_top(&app_handle, event);
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