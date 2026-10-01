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
  timeline: AdminRepairTimelineEntry[];
  diagnosis: {
    findings: string;
    recommendedAction: string | null;
  } | null;
  paymentSummary: AdminRepairPaymentSummary | null;
  payments: AdminRepairPayment[];
  pendingPaymentSubmissions: AdminRepairPaymentSubmission[];
};

export const repairPaymentMethods = ["CASH", "MPESA", "BANK_TRANSFER", "CARD", "OTHER"] as const;
export type RepairPaymentMethod = (typeof repairPaymentMethods)[number];

export type AdminRepairPaymentSummary = {
  approvedAmount: string;
  currency: string;
  amountPaid: string;
  outstandingBalance: string;
  collectionStatus: RepairCollectionStatus;
};

export type AdminRepairPayment = {
  amount: string;
  paymentMethod: RepairPaymentMethod;
  referenceNumber: string | null;
  paymentDate: string;
  recordedByEmail: string | null;
};

export type AdminRepairPaymentSubmission = {
  submissionId: string;
  amount: string;
  paymentMethod: RepairPaymentMethod;
  referenceNumber: string | null;
  customerMessage: string | null;
  submittedAt: string;
};

export type AdminRepairTimelineEntry = {
  fromStatus: RepairStatus | null;
  status: RepairStatus | null;
  statusLabel: string | null;
  customerUpdate: string;
  createdAt: string;
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

export const repairQuoteCurrencies = ["KES", "GBP", "USD", "EUR"] as const;
export type RepairQuoteCurrency = (typeof repairQuoteCurrencies)[number];

export const repairQuoteItemTypes = ["PART", "LABOUR", "OTHER"] as const;
export type RepairQuoteItemType = (typeof repairQuoteItemTypes)[number];

export const repairPaymentRequirements = [
  "FULL_PAYMENT",
  "DEPOSIT",
  "PAYMENT_ARRANGEMENT",
  "PAY_ON_COLLECTION",
] as const;
export type RepairPaymentRequirement = (typeof repairPaymentRequirements)[number];

export const customerRepairPaymentCommitments = ["FULL_PAYMENT", "DEPOSIT"] as const;
export type CustomerRepairPaymentCommitment = (typeof customerRepairPaymentCommitments)[number];

export const repairPaymentRequirementStatuses = ["ACCEPTED", "PENDING_ADMIN_REVIEW", "REJECTED"] as const;
export type RepairPaymentRequirementStatus = (typeof repairPaymentRequirementStatuses)[number];

export const repairPaymentArrangementStatuses = [
  "NOT_REQUESTED",
  "PENDING_ADMIN_REVIEW",
  "APPROVED",
  "REJECTED",
] as const;
export type RepairPaymentArrangementStatus = (typeof repairPaymentArrangementStatuses)[number];

export const repairCollectionStatuses = ["NOT_READY", "READY", "COLLECTED", "OVERDUE"] as const;
export type RepairCollectionStatus = (typeof repairCollectionStatuses)[number];

const repairStatusTransitions: Record<RepairStatus, readonly RepairStatus[]> = {
  REQUEST_RECEIVED: ["APPOINTMENT_SCHEDULED", "CANCELLED"],
  APPOINTMENT_SCHEDULED: ["DEVICE_RECEIVED", "CANCELLED"],
  DEVICE_RECEIVED: ["DIAGNOSIS_AND_QUOTE", "CANCELLED"],
  DIAGNOSIS_AND_QUOTE: ["AWAITING_CUSTOMER_APPROVAL", "CANCELLED"],
  AWAITING_CUSTOMER_APPROVAL: ["AWAITING_PARTS", "CANCELLED"],
  AWAITING_PARTS: ["REPAIR_IN_PROGRESS", "CANCELLED"],
  REPAIR_IN_PROGRESS: ["TESTING_QC", "CANCELLED"],
  TESTING_QC: ["READY_FOR_COLLECTION", "CANCELLED"],
  READY_FOR_COLLECTION: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function getAllowedRepairStatusTransitions(status: RepairStatus): readonly RepairStatus[] {
  return repairStatusTransitions[status];
}

export function isRepairStatus(value: unknown): value is RepairStatus {
  return typeof value === "string" && repairStatusOrder.some((status) => status === value);
}

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
  quoteReview: RepairQuoteReview | null;
  paymentPlan: RepairTrackingPaymentPlan | null;
};

export type RepairTrackingPaymentPlan = {
  approvedAmount: string;
  currency: string;
  paymentRequirement: RepairPaymentRequirement;
  paymentRequirementStatus: RepairPaymentRequirementStatus;
  requiredDepositAmount: string;
  amountRequiredForCurrentPayment: string;
  amountPaid: string;
  outstandingBalance: string;
  arrangementStatus: RepairPaymentArrangementStatus;
  proposedPaymentAmount: string | null;
  proposedPaymentAt: string | null;
  collectionStatus: RepairCollectionStatus;
  collectionDeadline: string | null;
  paymentHistory: RepairTrackingPaymentHistoryEntry[];
};

export type RepairTrackingPaymentHistoryEntry = {
  amount: string;
  paymentMethod: RepairPaymentMethod;
  referenceNumber: string | null;
  status: "CONFIRMED" | "PENDING_ADMIN_CONFIRMATION" | "REJECTED";
  paymentDate: string;
  customerMessage: string | null;
};

export type RepairQuoteReview = {
  diagnosis: {
    findings: string;
    recommendedAction: string;
  };
  quote: {
    version: number;
    status: "ISSUED";
    currency: string;
    subtotal: string;
    additionalCharges: string;
    total: string;
    issuedAt: string;
    items: Array<{
      itemType: RepairQuoteItemType;
      description: string;
      quantity: string;
      unitAmount: string;
    }>;
  };
};