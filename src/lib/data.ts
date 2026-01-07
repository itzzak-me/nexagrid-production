// src/lib/data.ts

import {
    Atom, Dna, Calculator, Book,
    Trophy, Monitor, User, Shield,
    GraduationCap, Briefcase
} from "lucide-react";

// --- HELPER: DETERMINISTIC RANDOM ---
const deterministicRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// --- 1. TEACHER DIRECTORY ---
export const TEACHER_DIRECTORY = [
    { id: "T-001", name: "Vikram Singh", subject: "Physics", classes: ["10-A", "11-A"] },
    { id: "T-002", name: "Anjali Gupta", subject: "Mathematics", classes: ["10-A", "10-B"] },
    { id: "T-003", name: "Suresh Kapoor", subject: "Chemistry", classes: ["11-A", "11-B"] },
    { id: "T-004", name: "Rahul Verma", subject: "Physics", classes: ["10-B", "11-B"] },
    { id: "T-005", name: "Priya Sharma", subject: "English", classes: ["10-A", "10-B"] },
    { id: "T-006", name: "Amit Das", subject: "Mathematics", classes: ["11-A", "11-B"] },
    { id: "T-007", name: "Linda George", subject: "English", classes: ["11-A", "11-B"] },
    { id: "T-008", name: "Dr. R. Iyer", subject: "Chemistry", classes: ["10-A", "10-B"] },
    { id: "T-009", name: "Kamal Nair", subject: "Physics", classes: ["12-A"] },
    { id: "T-010", name: "S. K. Rao", subject: "Mathematics", classes: ["12-B"] },
];

// --- 2. TEACHER SCHEDULE (NEW) ---
export const TEACHER_SCHEDULE = [
    { id: 1, time: "09:00 AM - 10:00 AM", class: "10-A", subject: "Physics", topic: "Laws of Motion", room: "Lab 3", status: "completed" },
    { id: 2, time: "10:15 AM - 11:15 AM", class: "11-B", subject: "Physics", topic: "Thermodynamics", room: "Room 204", status: "live" },
    { id: 3, time: "12:00 PM - 01:00 PM", class: "10-B", subject: "Physics", topic: "Force & Friction", room: "Room 205", status: "upcoming" },
    { id: 4, time: "02:00 PM - 03:00 PM", class: "12-A", subject: "Physics", topic: "Quantum Mechanics", room: "Smart Class A", status: "upcoming" },
];

// --- 3. STUDENT GENERATOR ---
const FIRST_NAMES = ["Aarav", "Vihaan", "Aditya", "Sai", "Reyansh", "Arjun", "Vivaan", "Rohan", "Kabir", "Ananya", "Diya", "Saanvi", "Anya", "Zara", "Ishita", "Meera", "Riya", "Kavya", "Aditi", "Nisha"];
const LAST_NAMES = ["Sharma", "Verma", "Gupta", "Patel", "Singh", "Kumar", "Das", "Rao", "Mehta", "Nair", "Iyer", "Reddy", "Chopra", "Malhotra", "Saxena"];
const COLORS = ["blue", "indigo", "emerald", "purple", "orange"];
const BLOOD_TYPES = ["O+", "A+", "B+", "AB+"];

const generateMockStudents = () => {
    const batches = ["10-A", "10-B", "11-A", "11-B"];
    const students = [];
    let globalIndex = 0;

    for (const batch of batches) {
        for (let i = 1; i <= 50; i++) {
            globalIndex++;

            const rand1 = deterministicRandom(globalIndex * 1.1);
            const rand2 = deterministicRandom(globalIndex * 2.2);
            const rand3 = deterministicRandom(globalIndex * 3.3);
            const rand4 = deterministicRandom(globalIndex * 4.4);
            const rand5 = deterministicRandom(globalIndex * 5.5);

            const fName = FIRST_NAMES[Math.floor(rand1 * FIRST_NAMES.length)];
            const lName = LAST_NAMES[Math.floor(rand2 * LAST_NAMES.length)];

            const status = rand3 > 0.9 ? "Absent" : rand3 > 0.85 ? "Late" : "Present";
            const physicsMark = Math.floor(rand4 * (99 - 60 + 1)) + 60;

            students.push({
                id: `${batch}-${i.toString().padStart(3, '0')}`,
                name: `${fName} ${lName}`,
                roll: i,
                class: batch,
                photo: `bg-${COLORS[Math.floor(rand5 * COLORS.length)]}-500`,
                blood: BLOOD_TYPES[Math.floor(rand1 * BLOOD_TYPES.length)],
                father: `Mr. ${lName}`,
                status: status,
                physics: physicsMark
            });
        }
    }
    return students;
};

export const MOCK_CLASS_LIST = generateMockStudents();

// --- 4. ROLES & AUTH ---
export const ROLES = [
    { id: '1', name: 'Rohan Das', role: 'Student' },
    ...TEACHER_DIRECTORY.map(t => ({ id: t.id, name: t.name, role: 'Teacher' })),
];

// --- 5. MOCK STUDENTS (Single View) ---
export const MOCK_STUDENTS = [
    MOCK_CLASS_LIST[0]
];

// --- 6. LEAVES & REQUESTS ---
export const PENDING_LEAVES = [
    { id: 101, student: "Vikram Singh (10-A)", date: "Jan 12-14", type: "Medical", reason: "Viral Fever" },
    { id: 102, student: "Kabir Mehta (10-B)", date: "Jan 20", type: "Family", reason: "Sister's Wedding" },
    { id: 103, student: "Saanvi Rao (11-A)", date: "Jan 22", type: "Sports", reason: "District Tournament" },
    { id: 104, student: "Aditya Verma (11-B)", date: "Jan 25", type: "Medical", reason: "Dental Surgery" },
];

// --- 7. ACADEMIC DATA ---
export const AI_KNOWLEDGE_BASE = {
    Physics: [
        { id: 'p1', query: "Derive the formula for Projectile Motion range.", response: "The range R is given by R = (v² sin 2θ) / g. This is derived by analyzing horizontal velocity (v cos θ) multiplied by total time of flight.", date: "2 days ago" },
    ],
    Chemistry: [
        { id: 'c1', query: "Difference between Molarity and Molality?", response: "Molarity (M) is moles per Liter of solution. Molality (m) is moles per Kg of solvent.", date: "Yesterday" }
    ],
    Mathematics: [
        { id: 'm1', query: "Intuition behind Integration?", response: "Integration is essentially 'adding up' infinitely small slices to find a whole. It calculates the area under a curve.", date: "3 days ago" }
    ],
    English: [
        { id: 'e1', query: "Summary of 'The Road Not Taken'.", response: "Frost explores the theme of choices. The traveler chooses the less worn path, symbolizing individualism.", date: "Yesterday" }
    ]
};

export const SUGGESTED_QUESTIONS: Record<string, { q: string, a: string }[]> = {
    Physics: [{ q: "What is Quantum Entanglement?", a: "Particles sharing states across distances." }],
    Chemistry: [{ q: "Explain Covalent Bonding.", a: "Sharing of electron pairs between atoms." }],
};

export const SUBJECT_ICONS: Record<string, any> = {
    Physics: Atom, Chemistry: Dna, Mathematics: Calculator, English: Book
};

export const SUBJECT_COLORS: Record<string, string> = {
    Physics: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    Chemistry: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    Mathematics: "text-red-500 bg-red-500/10 border-red-500/20",
    English: "text-amber-500 bg-amber-500/10 border-amber-500/20",
};

export const EXAM_DATA: Record<string, { subject: string; A: number; fullMark: number }[]> = {
    "Unit Test 1": [
        { subject: "Physics", A: 65, fullMark: 100 }, { subject: "Chemistry", A: 70, fullMark: 100 },
        { subject: "Mathematics", A: 85, fullMark: 100 }, { subject: "English", A: 75, fullMark: 100 },
    ],
    "Predicted Final": [
        { subject: "Physics", A: 92, fullMark: 100 }, { subject: "Chemistry", A: 85, fullMark: 100 },
        { subject: "Mathematics", A: 95, fullMark: 100 }, { subject: "English", A: 90, fullMark: 100 },
    ]
};

export const MYSTERIES = [
    { id: 1, author: "Anjali K.", question: "Physics: Why does time dilate at light speed?", votes: 12, answers: [] },
];

export const ATTENDANCE_HISTORY = {
    "2026-01": [
        { date: "2026-01-01", status: "holiday", label: "New Year" },
        { date: "2026-01-14", status: "holiday", label: "Pongal" },
        { date: "2026-01-26", status: "holiday", label: "Republic Day" },
        { date: "2026-01-05", status: "present" },
        { date: "2026-01-06", status: "present" },
        { date: "2026-01-07", status: "leave", label: "Sick Leave" },
        { date: "2026-01-08", status: "absent" },
    ],
};

// --- 8. FINANCIAL & ADMIN DATA ---
export const FINANCIAL_DATA = {
    totalFee: 120000,
    paidAmount: 95000,
    balance: 25000,
    transactions: [
        { id: "TXN-9921", date: "Dec 15, 2025", amount: 45000, method: "UPI", status: "success" },
        { id: "TXN-8842", date: "Oct 10, 2025", amount: 50000, method: "Card", status: "success" },
        { id: "TXN-7731", date: "Aug 01, 2025", amount: 25000, method: "Net Banking", status: "pending" },
    ]
};

export const ADMIN_STATS = {
    totalRevenue: "₹45.2 Lakh",
    pendingFees: "₹4.5 Lakh",
    activeStudents: 450,
    serverLoad: "12%"
};

export const REVENUE_DATA = [
    { month: "Jan", revenue: 400000 }, { month: "Feb", revenue: 300000 },
    { month: "Mar", revenue: 550000 }, { month: "Apr", revenue: 450000 },
];

export const CRM_LEADS = [
    { id: 101, name: "Aarav Patel", status: "Inquiry", value: "₹1.2L", time: "2h ago" },
    { id: 102, name: "Zara Khan", status: "Negotiation", value: "₹1.5L", time: "5h ago" },
    { id: 103, name: "Vihaan Sharma", status: "Closed", value: "₹1.2L", time: "1d ago" },
];

export const SYSTEM_LOGS = [
    { id: 1, type: "success", msg: "Backup completed successfully", time: "10:00 AM" },
    { id: 2, type: "warning", msg: "High latency detected in US-East", time: "09:15 AM" },
    { id: 3, type: "error", msg: "Failed login attempt: Admin Portal", time: "08:30 AM" },
];// --- 9. STUDENT SPECIFIC DATA (NEW) ---
export const STUDENT_PROFILE = {
    name: "Rohan Das",
    id: "ST-2026-001",
    class: "10-A",
    streak: 14, // Days in a row
    xp: 1240,
    level: 5,
    nextLevelXp: 1500,
    badges: ["Physics Whiz", "Early Bird", "Homework Hero"]
};

export const STUDENT_SCHEDULE = [
    { id: 1, time: "09:00 AM", subject: "Physics", topic: "Laws of Motion", type: "Lecture", status: "completed" },
    { id: 2, time: "10:15 AM", subject: "Mathematics", topic: "Quadratic Eq", type: "Tutorial", status: "live" },
    { id: 3, time: "11:30 AM", subject: "Chemistry", topic: "Periodic Table", type: "Lab", status: "upcoming" },
    { id: 4, time: "01:00 PM", subject: "English", topic: "Poetry Analysis", type: "Lecture", status: "upcoming" }
];

export const PERFORMANCE_DATA = [
    { subject: 'Physics', A: 120, fullMark: 150 },
    { subject: 'Math', A: 98, fullMark: 150 },
    { subject: 'Chem', A: 86, fullMark: 150 },
    { subject: 'Eng', A: 99, fullMark: 150 },
    { subject: 'Bio', A: 85, fullMark: 150 },
    { subject: 'CS', A: 65, fullMark: 150 },
];