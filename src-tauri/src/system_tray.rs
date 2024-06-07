use tauri::{AppHandle, CustomMenuItem, Manager, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, SystemTraySubmenu};

use crate::event::EVENT_CLICK_SCENARIO;
use crate::entities::ScenarioClickPayload;

pub fn handle_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => {
            if id == crate::event::EVENT_QUIT {
                std::process::exit(0);
            } else if id.starts_with("scenario-") {
                let scenario_id = id.replace("scenario-", "");
                if !scenario_id.is_empty() {
                    let result = app.emit_all(EVENT_CLICK_SCENARIO, ScenarioClickPayload {
                        id: scenario_id
                    });

                    if let Err(e) = result {
                        eprintln!("Error emitting click scenario event: {}", e);
                    }
                }
            }
        }
        _ => {}
    }
}

pub fn create_system_tray(
    scenarios: Vec<crate::entities::ScenarioItem>
) -> SystemTrayMenu {
    let quit = CustomMenuItem::new(crate::event::EVENT_QUIT.to_string(), "Quit");
    
    // get active scenario
    let active_scenario = scenarios.iter().find(|scenario| scenario.active);
    let mut root_scenario_label: String = "Scenario".to_string();
    if let Some(scenario) = active_scenario {
        root_scenario_label = scenario.label.clone();
    }
    
    // add submenus
    let mut sub_tray_menu = SystemTrayMenu::new();

    for scenario in scenarios {
        let scenario_item = CustomMenuItem::new(
            format!("scenario-{}", scenario.id.to_string()),
            scenario.label.to_string()
        );
        sub_tray_menu = sub_tray_menu.add_item(scenario_item);
    }

    let root_scenario = SystemTraySubmenu::new(root_scenario_label, sub_tray_menu);

    let system_tray_menu = SystemTrayMenu::new()
        .add_submenu(root_scenario)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    system_tray_menu
}
