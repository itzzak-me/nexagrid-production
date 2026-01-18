import {
    Users, FileText, CheckCircle2, AlertTriangle, Clock,
    Shield, AlertOctagon, Database, Activity
} from "lucide-react";

// --- 1. SHARED CONFIG ---
export const SCHOOL_CONFIG = {
    name: "Scholars Coaching Point",
    location: "Sector 14, Gurgaon",
    id: "SCP-GGN-01",
    term: "Winter Term 2026",
};

// --- 2. TEACHER DATA (4 Faculty Members with Salaries) ---
export const TEACHER_DIRECTORY = [
    {
        id: "TR-PHY-01",
        name: "Ravi Sir",
        subject: "Physics",
        classes: ["Batch A (10th)", "Batch C (JEE)"],
        email: "ravi.physics@scholars.in",
        qualifications: "B.Tech (IIT Delhi), 8 Yrs Exp",
        salary: 55000,
        status: "Full-time",
        joinDate: "Apr 2022"
    },
    {
        id: "TR-MTH-02",
        name: "Amit Sir",
        subject: "Mathematics",
        classes: ["Batch A (10th)", "Batch B (11th)"],
        email: "amit.maths@scholars.in",
        qualifications: "M.Sc Maths, Gold Medalist",
        salary: 48000,
        status: "Full-time",
        joinDate: "Jun 2023"
    },
    {
        id: "TR-CHM-03",
        name: "Suresh Sir",
        subject: "Chemistry",
        classes: ["Batch B (11th)", "Batch C (JEE)"],
        email: "suresh.chem@scholars.in",
        qualifications: "Ph.D. Organic Chem",
        salary: 52000,
        status: "Part-time",
        joinDate: "Aug 2024"
    },
    {
        id: "TR-BIO-04",
        name: "Megha Ma'am",
        subject: "Biology",
        classes: ["Batch D (NEET)"],
        email: "megha.bio@scholars.in",
        qualifications: "M.Sc Zoology (DU)",
        salary: 45000,
        status: "Visiting",
        joinDate: "Jan 2025"
    }
];

export const TEACHER_SCHEDULE = [
    { id: 1, time: "04:00 PM - 05:30 PM", subject: "Physics", topic: "Rotational Motion", class: "Batch C (JEE)", room: "Hall 1", status: "completed" },
    { id: 2, time: "05:45 PM - 07:15 PM", subject: "Physics", topic: "Electricity & Circuits", class: "Batch A (10th)", room: "Hall 2", status: "live" },
    { id: 3, time: "07:30 PM - 09:00 PM", subject: "Doubt Session", topic: "Open Floor", class: "All Batches", room: "Library", status: "upcoming" }
];

export const MOCK_CLASS_LIST = [
    { id: "ST-001", roll: 1, name: "Arjun Singh", class: "Batch A (10th)", status: "Present", physics: 82 },
    { id: "ST-002", roll: 2, name: "Sneha Gupta", class: "Batch A (10th)", status: "Present", physics: 94 },
    { id: "ST-003", roll: 3, name: "Rohan Das", class: "Batch A (10th)", status: "Absent", physics: 76 },
    { id: "ST-004", roll: 4, name: "Priya Sharma", class: "Batch A (10th)", status: "Late", physics: 88 },
    { id: "ST-005", roll: 5, name: "Kabir Khan", class: "Batch B (11th)", status: "Present", physics: 65 },
    { id: "ST-006", roll: 6, name: "Ananya Roy", class: "Batch C (JEE)", status: "Present", physics: 91 },
    { id: "ST-007", roll: 7, name: "Dev Patel", class: "Batch D (NEET)", status: "Absent", physics: 70 },
    { id: "ST-008", roll: 8, name: "Meera Nair", class: "Batch A (10th)", status: "Present", physics: 85 },
];

export const PENDING_LEAVES = [
    { id: 101, student: "Rohan Das", type: "Sick Leave", date: "Today", reason: "Viral Fever", status: "pending" },
    { id: 102, student: "Dev Patel", type: "Exam Prep", date: "Tomorrow", reason: "School Pre-Boards", status: "pending" }
];

// --- 3. STUDENT DATA ---
export const MOCK_STUDENTS = [
    { id: "ST-003", name: "Rohan Das", class: "Batch A (10th)", stream: "Foundation" }
];

export const STUDENT_PROFILE = {
    name: "Rohan Das",
    id: "ST-003",
    class: "Batch A (10th)",
    streak: 5,
    xp: 450,
    level: 2,
    nextLevelXp: 500,
    badges: ["Regular Attendee", "Quiz Solver"]
};

export const EXAM_DATA: Record<string, { subject: string; A: number; fullMark: number }[]> = {
    "Weekly Test 4": [
        { subject: "Physics", A: 22, fullMark: 30 },
        { subject: "Chemistry", A: 18, fullMark: 30 },
        { subject: "Maths", A: 25, fullMark: 30 }
    ],
    "Mock Board 1": [
        { subject: "Physics", A: 65, fullMark: 80 },
        { subject: "Chemistry", A: 58, fullMark: 80 },
        { subject: "Maths", A: 72, fullMark: 80 }
    ]
};

// CLEANED AI KNOWLEDGE BASE (No pre-filled questions)
export const AI_KNOWLEDGE_BASE = {
    "Physics": [],
    "Mathematics": [],
    "Chemistry": []
};

// --- 4. ATTENDANCE HISTORY ---
export const ATTENDANCE_HISTORY: Record<string, { date: string; status: 'present' | 'absent' | 'leave' | 'holiday' }[]> = {
    "2026-01": [
        { date: "2026-01-01", status: "present" },
        { date: "2026-01-02", status: "present" },
        { date: "2026-01-03", status: "absent" },
        { date: "2026-01-04", status: "holiday" },
        { date: "2026-01-05", status: "present" },
        { date: "2026-01-06", status: "present" },
    ]
};

// --- 5. FINANCIAL DATA (Cash heavy) ---
export const FINANCIAL_DATA = {
    balance: 2500,
    transactions: [
        { id: "RCPT-1022", date: "Jan 05, 2026", amount: 2500, method: "Cash (Office)", status: "success" },
        { id: "UPI-9921", date: "Dec 05, 2025", amount: 2500, method: "Google Pay", status: "success" },
        { id: "RCPT-0988", date: "Nov 02, 2025", amount: 2500, method: "Cash (Office)", status: "success" },
    ]
};

// --- 6. ADMIN DASHBOARD DATA (Accurate 1 Year Scale) ---
export const ADMIN_STATS = {
    totalRevenue: "₹63.8 L",  // Sum of last 12 months roughly
    activeStudents: "194",    // 6 Dropouts/Inactive
    pendingFees: "₹52.5 K",   // ~21 Students overdue for Jan
    serverLoad: "8%"          // Very low load
};

// REVENUE CURVE (Lakhs) - 1 Year Cycle
export const REVENUE_DATA = [
    { month: 'Apr', revenue: 6.8 }, // Session Start (Admissions)
    { month: 'May', revenue: 5.2 }, // Regular Installments
    { month: 'Jun', revenue: 4.2 }, // Summer Break Dip
    { month: 'Jul', revenue: 4.9 }, // Post-break Returns
    { month: 'Aug', revenue: 5.1 }, // Steady
    { month: 'Sep', revenue: 4.8 }, // Pre-Mid Term
    { month: 'Oct', revenue: 3.5 }, // Festive Dip (Diwali/Dussehra)
    { month: 'Nov', revenue: 5.8 }, // Crash Course Early Birds
    { month: 'Dec', revenue: 7.5 }, // Crash Course Peak
    { month: 'Jan', revenue: 6.2 }, // Current (High)
    { month: 'Feb', revenue: 4.0 }, // Exam Month (Low collection)
    { month: 'Mar', revenue: 8.5 }, // Next Session Advance Booking
];

export const CRM_LEADS = [
    { id: 1, name: "Parent of Vihaan", value: "10th", status: "Trial Class", time: "10m ago" },
    { id: 2, name: "Sneha's Mom", value: "JEE", status: "Fee Negotiation", time: "2h ago" },
    { id: 3, name: "Rahul (Student)", value: "Crash", status: "Interested", time: "4h ago" },
];

export const SYSTEM_LOGS = [
    { id: 101, type: "success", msg: "Attendance SMS Sent (Batch A)", time: "06:00 PM" },
    { id: 102, type: "warning", msg: "Fee Reminder: 15 Pending", time: "02:00 PM" },
    { id: 103, type: "success", msg: "Ravi Sir marked Present", time: "03:55 PM" },
];

// --- 7. PEER DOUBTS ---
export const PEER_DOUBTS = [
    {
        id: 101,
        student: "Arjun (Batch A)",
        class: "10th",
        query: "Sir said test is on Monday, is it Optics or Electricity?",
        status: "resolved",
        votes: 8,
        responses: 4,
        time: "30m ago"
    },
    {
        id: 102,
        student: "Dev (NEET)",
        class: "12th",
        query: "Can anyone share notes for Biology chapter 4? I missed yesterday's class.",
        status: "peer_review",
        votes: 5,
        responses: 1,
        time: "2h ago"
    }
];

export const SUBJECT_COLORS = {
    "Physics": "bg-indigo-500",
    "Chemistry": "bg-emerald-500",
    "Mathematics": "bg-rose-500",
    "Biology": "bg-amber-500"
};

export const MYSTERIES = {};