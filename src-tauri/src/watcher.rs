use tauri::{AppHandle, Manager};
use enigo::{Enigo, Mouse, Settings};
use std::sync::Arc;

use crate::{entities, event};

pub fn create_watcher(app_handle: &AppHandle) {
    // create a new thread and keep watch mouse events
    
    let app_handle = Arc::new(app_handle.clone());
    std::thread::spawn(move || {
        let mut last_position = (0, 0);
        let mut current_angle = 0.0;
        let mut circle_range = 0.0;

        let enigo = Enigo::new(&Settings::default()).unwrap();
        loop {
            std::thread::sleep(std::time::Duration::from_millis(20));

            let position = enigo.location();

            if position.is_ok() {
                let position = position.unwrap();

                let delta_x = position.0 - last_position.0;
                let delta_y = position.1 - last_position.1;

                if delta_x == 0 && delta_y == 0 {
                    check_and_emit(&app_handle, circle_range, position);
                    circle_range = 0.0;
                    continue;
                }
                
                // calculate the cosine of the angle between the last position and the current position
                let cosine = (delta_x as f64) / ((delta_x.pow(2) + delta_y.pow(2)) as f64).sqrt();
                // get arccosine of the cosine
                let mut angle = cosine.acos();

                if angle.is_nan() {
                    circle_range = 0.0;
                    continue;
                }

                if delta_y < 0 {
                    angle = 2.0 * std::f64::consts::PI - angle;
                }

                last_position = position;

                let mut angle_delta = angle - current_angle;
                if angle_delta < -std::f64::consts::PI * 0.5 && angle_delta > -std::f64::consts::PI * 2.0 {
                    angle_delta += std::f64::consts::PI * 2.0;
                }

                if angle_delta > std::f64::consts::PI * 0.5 {
                    check_and_emit(&app_handle, circle_range, position);
                    circle_range = 0.0;
                    continue;
                }

                circle_range += angle_delta;
                current_angle = angle;
            }
        }
    });

}

fn check_and_emit(app_handle: &AppHandle, circle_range: f64, current_position: (i32, i32)) {
    if circle_range > std::f64::consts::PI * 3.0 {
        let _ = app_handle.emit_all(event::EVENT_MOUSE_CIRCLE, entities::MouseCircleEventPayload{
            position: current_position,
            round: circle_range / (std::f64::consts::PI * 2.0)
        });
    }
}