use std::{fs::File, io::Read};

use base64::{engine::general_purpose, Engine};

#[tauri::command]
pub fn get_image(path: String) -> Result<String, String> {
    // read the file and encode it to base64
    let file = File::open(path);
    if let Err(e) = file {
        return Err(e.to_string());
    }

    let mut file = file.unwrap();
    let mut buffer = Vec::new();
    let result = file.read_to_end(buffer.as_mut());
    if !result.is_ok() {
        return Err(result.err().unwrap().to_string());
    }

    let base64 = general_purpose::STANDARD.encode(buffer.as_slice());
    Ok(base64)
}