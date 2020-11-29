export interface RequestLog {
  request_timestamp: number, 
  request_count : number
}

export interface VisitorRecord extends Array<RequestLog> {}