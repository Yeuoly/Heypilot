use std::time::SystemTime;
use tauri::api::path::data_dir;

use screenshots::Screen;
use tauri::{AppHandle, Event, Manager};

use crate::{entities, event};

pub fn screenshot(app_handle: &AppHandle, event: Event) {
    let payload_str = event.payload().unwrap();
    let payload = serde_json::from_str::<entities::ScreenShotRequestPayload>(payload_str);
    if !payload.is_ok() {
        let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
            error: "Invalid payload".to_string(),
            path: "".to_string()
        });
    }

    let screens = Screen::all();
    if let Ok(screens) = screens {
        let monitor = payload.as_ref().unwrap().monitor.try_into().unwrap();
        if screens.len() <= monitor {
            let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
                error: format!("Monitor {} not found", payload.unwrap().monitor),
                path: "".to_string()
            });
            return;
        }

        println!("Capturing screen: {:?}", monitor);
        
        let screen = screens[monitor];
        let screen = screen.capture();

        if !screen.is_ok() {
            let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
                error: screen.as_ref().err().unwrap().to_string(),
                path: "".to_string()
            });
            eprintln!("Error capturing screen: {:?}", screen.as_ref().err().unwrap());
            return;
        }

        println!("Captured screen: {:?}", screen.as_ref().unwrap().dimensions());
        
        let screen = screen.unwrap();

        let path = &format!(
            "{}/screenshot-{}.png", 
            data_dir().unwrap().to_str().unwrap(), 
            SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_secs()
        );

        if let Err(e) = screen.save_with_format(path, image::ImageFormat::Png) {
            let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
                error: e.to_string(),
                path: "".to_string()
            });
            eprintln!("Error saving screen: {:?}", e);
            return;
        }

        println!("Saved screen: {:?}", path);

        if let Err(e) = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
            error: "".to_string(),
            path: path.to_string()
        }) {
            let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
                error: e.to_string(),
                path: "".to_string()
            });
            eprintln!("Error emitting screenshot response event: {}", e);
        }
    }
}