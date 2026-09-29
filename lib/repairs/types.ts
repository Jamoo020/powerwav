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