use std::{fs::File, io::Read};
use std::time::SystemTime;
use tauri::api::path::data_dir;

use base64::{engine::general_purpose, Engine};
use screenshots::Screen;
use tauri::{AppHandle, Event, Manager};

use crate::{entities, event};

pub fn screenshot(app_handle: &AppHandle, event: Event) {
    let payload_str = event.payload().unwrap();
    let payload = serde_json::from_str::<entities::ScreenShotRequestPayload>(payload_str);
    if !payload.is_ok() {
        let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
            error: "Invalid payload".to_string(),
            image: "".to_string()
        });
    }

    let screens = Screen::all();
    if let Ok(screens) = screens {
        let monitor = payload.as_ref().unwrap().monitor.try_into().unwrap();
        if screens.len() <= monitor {
            let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
                error: format!("Monitor {} not found", payload.unwrap().monitor),
                image: "".to_string()
            });
            return;
        }

        println!("Capturing screen: {:?}", monitor);
        
        let screen = screens[monitor];
        let screen = screen.capture();

        if !screen.is_ok() {
            let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
                error: screen.as_ref().err().unwrap().to_string(),
                image: "".to_string()
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
                image: "".to_string()
            });
            eprintln!("Error saving screen: {:?}", e);
            return;
        }

        println!("Saved screen: {:?}", path);

        // read the file and encode it to base64
        let mut file = File::open(path).unwrap();
        let mut buffer = Vec::new();
        file.read_to_end(buffer.as_mut()).unwrap();
        let base64 = general_purpose::STANDARD.encode(buffer.as_slice());
        let _ = app_handle.emit_all(event::EVENT_SCREENSHOT_RESPONSE, entities::ScreenShotResponsePayload {
            error: "".to_string(),
            image: base64
        });

        println!("Emitted screen: {:?}", path);
    }
}