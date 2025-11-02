// Common types used across the application

export interface FormErrors {
  [key: string]: string;
}

export interface BaseEntity {
  id: string;
}

export interface TimestampedEntity extends BaseEntity {
  timestamp: string;
}
