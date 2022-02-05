export interface User {
  id: number;             // generated, foreign key referenced in 'users' table 
  email_address: string,  
  account_password: string,       // (temporarily) generated
  first_name: string,     // taken from registration
  last_name: string,      // taken from registration
  created_at: string,     // generated 
  updated_at: string,     // generated 
  anonymized_at: string   // generated 
}