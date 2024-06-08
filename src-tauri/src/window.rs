use tauri::{AppHandle, Event, Manager, PhysicalPosition, PhysicalSize};
use crate::entities::MoveToAndSetOnTopPayload;
use crate::event::EVENT_SLIDE_FOCUS_INPUT;

pub fn move_to_and_set_on_top(app_handle: &AppHandle, event: Event) {
    let payload_str = event.payload().unwrap();
    let payload = serde_json::from_str::<MoveToAndSetOnTopPayload>(payload_str);
    
    if let Ok(payload) = payload {
        // resize window
        let (width, height) = (payload.width, payload.height);
        let (x, y) = (payload.x, payload.y);

        let window = app_handle.get_window("main").unwrap();

        window.set_size(PhysicalSize{
            width: width,
            height: height
        }).unwrap();

        // Move the window
        window.set_position(PhysicalPosition {
            x: payload.x,
            y: payload.y,
        }).unwrap();

        // Set the window always on top
        window.set_always_on_top(true).unwrap();

        // hide status bar
        window.set_decorations(false).unwrap();

        // focus the window
        window.set_focus().unwrap();

        // bring the window to front
        window.show().unwrap();

        // send focus to the window
        app_handle.emit_all(EVENT_SLIDE_FOCUS_INPUT, 1).unwrap();
    }
}

pub fn set_not_on_top(app_handle: &AppHandle, event: Event) {
    let window = app_handle.get_window("main").unwrap();
    window.set_always_on_top(false).unwrap();
    window.set_decorations(true).unwrap();
}