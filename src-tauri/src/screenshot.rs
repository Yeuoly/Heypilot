use std::time::SystemTime;
use tauri::api::path::data_dir;

use tauri::{AppHandle, Event, Manager};
use xcap::image::{DynamicImage, GenericImageView};
use xcap::Monitor;

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

    let screens = Monitor::all();

    if let Ok(screens) = screens {
        let payload = payload.unwrap();
        let monitor = payload.monitor.try_into().unwrap();

        println!("found screens: {:?}", screens.len());

        if screens.len() <= monitor {
            let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
                error: format!("Monitor {} not found", payload.monitor),
                path: "".to_string()
            });
            return;
        }

        println!("Capturing screen: monitor: {}, x: {}, y: {}, width: {}, height: {}", monitor, payload.x, payload.y, payload.width, payload.height);
        
        let screen = &screens[monitor];
        let screen = screen.capture_image();

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

        // resize to at most 1920x1080 but keep the aspect ratio
        let screen = DynamicImage::ImageRgba8(screen);
        let screen = screen.resize(1920, 1080, xcap::image::imageops::FilterType::Lanczos3);

        println!("Resized screen: {:?}", screen.dimensions());

        let data_dir = &format!(
            "{}/hey-pilot",
            data_dir().unwrap().to_str().unwrap()
        );

        // make sure the data directory exists
        if let Err(e) = std::fs::create_dir_all(data_dir) {
            let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
                error: e.to_string(),
                path: "".to_string()
            });
            eprintln!("Error creating data directory: {:?}", e);
            return;
        }

        let path = &format!(
            "{}/screenshot-{}.png", 
            data_dir, 
            SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_secs()
        );

        if let Err(e) = screen.save_with_format(path, xcap::image::ImageFormat::Png) {
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