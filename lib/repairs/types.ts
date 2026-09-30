export type CreateRepairTicketInput = {
  full_name: string;
  phone: string;
  email: string;
  category: string;
  brand: string;
  model: string;
  serial_number: string | null;
  issue_description: string;
  additional_information: string | null;
  preferred_service_option: string;
  preferred_at: Date | null;
};

export type CreatedRepairTicket = {
  ticketNumber: string;
};

export type AdminRepairTicket = {
  id: string;
  ticketNumber: string;
  status: RepairStatus;
  statusLabel: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  equipment: {
    category: string;
    brand: string;
    model: string;
    serialNumber: string | null;
  };
  issueDescription: string;
  preferredServiceOption: string | null;
  preferredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const repairStatusOrder = [
  "REQUEST_RECEIVED",
  "APPOINTMENT_SCHEDULED",
  "DEVICE_RECEIVED",
  "DIAGNOSIS_AND_QUOTE",
  "AWAITING_CUSTOMER_APPROVAL",
  "AWAITING_PARTS",
  "REPAIR_IN_PROGRESS",
  "TESTING_QC",
  "READY_FOR_COLLECTION",
  "COMPLETED",
  "CANCELLED",
] as const;

export type RepairStatus = (typeof repairStatusOrder)[number];

export const repairStatusLabels: Record<RepairStatus, string> = {
  REQUEST_RECEIVED: "Request Received",
  APPOINTMENT_SCHEDULED: "Appointment Scheduled",
  DEVICE_RECEIVED: "Device Received",
  DIAGNOSIS_AND_QUOTE: "Diagnosis + Quote",
  AWAITING_CUSTOMER_APPROVAL: "Awaiting Customer Approval",
  AWAITING_PARTS: "Awaiting Parts",
  REPAIR_IN_PROGRESS: "Repair In Progress",
  TESTING_QC: "Testing / Quality Check",
  READY_FOR_COLLECTION: "Ready for Collection",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export type RepairTrackingTimelineEntry = {
  eventType: string;
  status: RepairStatus | null;
  statusLabel: string | null;
  customerUpdate: string;
  createdAt: string;
};

export type RepairTrackingTicket = {
  ticketNumber: string;
  status: RepairStatus;
  statusLabel: string;
  equipment: {
    category: string;
    brand: string;
    model: string;
  };
  issueDescription: string;
  createdAt: string;
  statusUpdatedAt: string;
  timeline: RepairTrackingTimelineEntry[];
};