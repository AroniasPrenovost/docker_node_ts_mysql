import { RegistrationMeta } from './registrationMeta.interface';

export interface Registration {
  id: number;                           // generated  
  registration_state: string;           // 'unconfirmed'
  registration_meta: RegistrationMeta;
  user_id: number;                      // foreign key used in 'users' table, users may have mmultiple registrations 
  event_id: number;                     // registration-specific  
  created_at: string,                   // generated 
  updated_at: string,                   // generated 
  anonymized_at: string                 // generated 
}

/**
 * Example Use-Case: 
 * Form POST
 * 
 * creating a new registration will also create a record 
 * in the 'users' table if one does not already exist
 
  {
    "registration_state": "unconfirmed",
    "event_id": 1,
    "registration_meta": {
      "first_name": "Tommy",
      "last_name": "Ethan",
      "phone_number": "",
      "email_address": "aron@easci.com",
      "contact_me": true
    }
  }

*/
