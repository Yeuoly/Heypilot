use tauri::{AppHandle, Event, Manager};

use crate::{entities::ReplaceContextWithSelectionResponse, event::EVENT_REPLACE_CONTEXT_WITH_SELECTION_RESPONSE};


pub fn replace_context_with_selection(app_handle: &AppHandle, event: Event) {
    let selection = selection::get_text();

    let _ = app_handle.emit_all(EVENT_REPLACE_CONTEXT_WITH_SELECTION_RESPONSE, ReplaceContextWithSelectionResponse{
        selection
    });
}