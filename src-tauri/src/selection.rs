#[tauri::command]
pub fn get_selection_text() -> Result<String, String> {
    let text = selection::get_text();

    Ok(text)
}