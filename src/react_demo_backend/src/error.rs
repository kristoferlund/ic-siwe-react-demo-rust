use candid::{CandidType, Deserialize};
use serde::Serialize;

pub enum ErrorStatus {
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    InternalServerError,
}

impl ErrorStatus {
    pub fn status_code(&self) -> u16 {
        match self {
            ErrorStatus::BadRequest => 400,
            ErrorStatus::Unauthorized => 401,
            ErrorStatus::Forbidden => 403,
            ErrorStatus::NotFound => 404,
            ErrorStatus::InternalServerError => 500,
        }
    }

    pub fn status_text(&self) -> &'static str {
        match self {
            ErrorStatus::BadRequest => "Bad Request",
            ErrorStatus::Unauthorized => "Unauthorized",
            ErrorStatus::Forbidden => "Forbidden",
            ErrorStatus::NotFound => "Not Found",
            ErrorStatus::InternalServerError => "Internal Server Error",
        }
    }
}

#[derive(CandidType, Deserialize, Serialize, Debug)]
pub struct Error {
    pub message: String,
    status: u16,
    status_text: String,
}

impl Error {
    pub fn new(message: String, status: ErrorStatus) -> Self {
        Self {
            message,
            status: status.status_code(),
            status_text: status.status_text().to_string(),
        }
    }
}
