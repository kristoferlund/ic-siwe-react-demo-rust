use std::{cell::RefCell, collections::HashMap};

use candid::{CandidType, Principal};

static MAX_AGE: u64 = 60 * 60 * 24 * 7 * 1_000_000_000; // 1 week
                                                        // static MAX_AGE: u64 = 60 * 1_000_000_000; // 1 minute

thread_local! {
  pub static SESSIONS: RefCell<HashMap<Vec<u8>, Session>> = RefCell::new(HashMap::new());
}

#[derive(Clone, Debug, CandidType)]
pub struct Session {
    pub address: String,
    pub created_at: u64,
    pub max_age: u64,
}

impl Session {
    pub fn is_valid(&self) -> bool {
        let now = ic_cdk::api::time();
        self.created_at + self.max_age > now
    }
}

pub fn start(principal: Principal, address: String) -> Result<Session, String> {
    // Remove any expired sessions, this call could be moved to a timer
    clean();

    let session = Session {
        address,
        created_at: ic_cdk::api::time(),
        max_age: MAX_AGE,
    };
    SESSIONS.with_borrow_mut(|map| {
        map.insert(principal.as_slice().to_vec(), session.clone());
    });

    Ok(session)
}

pub fn get(principal: Principal) -> Result<Session, String> {
    SESSIONS.with_borrow(|map| {
        map.get(principal.as_slice())
            .cloned()
            .ok_or_else(|| String::from("No session found for the given principal"))
    })
}

pub fn refresh(principal: Principal) -> Result<Session, String> {
    SESSIONS.with_borrow_mut(|map| {
        let session = map
            .get_mut(principal.as_slice())
            .ok_or_else(|| String::from("No session found for the given principal"))?;
        session.created_at = ic_cdk::api::time();
        Ok(session.clone())
    })
}

pub fn delete(principal: Principal) -> Result<String, String> {
    SESSIONS.with_borrow_mut(|map| {
        map.remove(principal.as_slice())
            .ok_or_else(|| String::from("No session found for the given principal"))?;
        Ok("Session deleted".to_string())
    })
}

pub fn clear() {
    SESSIONS.with_borrow_mut(|map| {
        map.clear();
    });
}

pub fn list() -> Vec<Session> {
    SESSIONS.with_borrow(|map| map.values().cloned().collect())
}

pub fn length() -> usize {
    SESSIONS.with_borrow(|map| map.len())
}

// Remove expired sessions. This is called on the start of every new session but can also
// be called using a timer.
pub fn clean() {
    SESSIONS.with_borrow_mut(|map| {
        let expired_sessions: Vec<Vec<u8>> = map
            .iter()
            .filter(|(_, session)| !session.is_valid())
            .map(|(key, _)| key.clone())
            .collect();

        for key in expired_sessions {
            map.remove(&key);
        }
    });
}

#[macro_export]
/// This macro is used to check if the session for the current caller is valid.
macro_rules! with_valid_session {
    () => {{
        match session::get(ic_cdk::caller()) {
            Ok(session) => {
                if session.is_valid() {
                    // Sessions are valid for 1 week, but we refresh them on every authenticated request
                    session::refresh(ic_cdk::caller()).unwrap();
                    Ok(session)
                } else {
                    // If the session is invalid, we delete it
                    session::delete(ic_cdk::caller()).unwrap();
                    Err(Error::new("Session has expired".to_string(), ErrorStatus::Unauthorized))
                }
            }
            Err(e) => {
                Err(Error::new(e, ErrorStatus::Unauthorized))
            }
        }
    }};
}
