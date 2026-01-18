export type UserRole = "admin" | "buyer" | "inventory_manager" | "quality_control" | "finance" | "supplier"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  department: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  status: "draft" | "pending_approval" | "approved" | "in_progress" | "completed" | "cancelled"
  created_by: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  sku: string
  category: string | null
  unit_price: number
  quantity_in_stock: number
  reorder_level: number
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  status: "pending_validation" | "validated" | "rejected" | "suspended"
  validation_notes: string | null
  created_at: string
  updated_at: string
}

export interface PurchaseOrder {
  id: string
  order_number: string
  project_id: string | null
  supplier_id: string | null
  status:
    | "draft"
    | "submitted"
    | "approved"
    | "rejected"
    | "sent_to_supplier"
    | "confirmed"
    | "in_transit"
    | "delivered"
    | "cancelled"
  total_amount: number
  notes: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id: string
  purchase_order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface Reception {
  id: string
  purchase_order_id: string
  reception_number: string
  reception_date: string
  received_by: string
  status: "pending" | "partial" | "complete" | "with_issues"
  notes: string | null
  created_at: string
}

export interface QualityCheck {
  id: string
  reception_id: string
  product_id: string | null
  check_type: string
  result: "passed" | "failed" | "conditional"
  inspector_id: string
  notes: string | null
  checked_at: string
  created_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  purchase_order_id: string | null
  supplier_id: string | null
  status: "draft" | "pending_validation" | "validated" | "paid" | "disputed" | "cancelled"
  invoice_date: string
  due_date: string | null
  total_amount: number
  paid_amount: number
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Approval {
  id: string
  entity_type: "project" | "purchase_order" | "invoice" | "supplier"
  entity_id: string
  approver_id: string
  status: "pending" | "approved" | "rejected"
  comments: string | null
  approved_at: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  entity_type: string | null
  entity_id: string | null
  read: boolean
  created_at: string
}
