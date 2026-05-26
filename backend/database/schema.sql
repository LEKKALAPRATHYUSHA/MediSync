DROP TABLE IF EXISTS appointment_logs;
DROP TABLE IF EXISTS patient_records;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS doctor_slots;
DROP TABLE IF EXISTS specializations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient','doctor','receptionist','admin')),
    phone TEXT,
    specialization_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialization_id) REFERENCES specializations(id)
);

CREATE TABLE specializations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE doctor_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER NOT NULL,
    specialization_id INTEGER,
    slot_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    consultation_fee REAL DEFAULT 0,
    max_patients INTEGER DEFAULT 1,
    booked_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE','FULL','CANCELLED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (specialization_id) REFERENCES specializations(id)
);

CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    slot_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_age INTEGER NOT NULL,
    patient_gender TEXT NOT NULL CHECK (patient_gender IN ('Male','Female','Other')),
    symptoms TEXT,
    appointment_status TEXT DEFAULT 'Scheduled' CHECK (
        appointment_status IN ('Scheduled','Completed','Cancelled','Missed')
    ),
    booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (slot_id) REFERENCES doctor_slots(id),
    UNIQUE(patient_email, slot_id)
);

CREATE TABLE patient_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL UNIQUE,
    diagnosis TEXT,
    prescription TEXT,
    consultation_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

CREATE TABLE appointment_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    updated_by INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

INSERT INTO specializations (name) VALUES
    ('Cardiology'),('Dermatology'),('Neurology'),('Orthopedics'),('Pediatrics');

-- Passwords below are bcrypt of "password123"
INSERT INTO users (name, email, password, role, phone, specialization_id) VALUES
    ('Admin User',   'admin@test.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin',        '9999999991', NULL),
    ('Receptionist', 'reception@test.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'receptionist', '9999999992', NULL),
    ('Dr. Sharma',   'doctor@test.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'doctor',       '9999999993', 1),
    ('Patient User', 'patient@test.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'patient',      '9999999994', NULL);

-- Future slot so it doesn't expire
INSERT INTO doctor_slots (doctor_id, specialization_id, slot_date, start_time, end_time, consultation_fee, max_patients)
VALUES (3, 1, '2026-12-15', '10:00', '11:00', 500, 5);

INSERT INTO appointments (patient_id, slot_id, patient_name, patient_email, patient_phone, patient_age, patient_gender, symptoms)
VALUES (4, 1, 'Patient User', 'patient@test.com', '9999999994', 24, 'Female', 'Fever and headache');

INSERT INTO patient_records (appointment_id, diagnosis, prescription, consultation_notes)
VALUES (1, 'Viral Fever', 'Paracetamol 500mg', 'Take rest and drink fluids');

INSERT INTO appointment_logs (appointment_id, old_status, new_status, updated_by)
VALUES (1, 'Scheduled', 'Completed', 3);