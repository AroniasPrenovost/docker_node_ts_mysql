"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
