export interface RegistrationMeta {
    first_name: string,     // will override existing User first_name column
    last_name: string,      // will override existing User last_name column     
    phone_number: number;
    email_address: string;  // will be used to find existing User 
    contact_me: boolean;
}
