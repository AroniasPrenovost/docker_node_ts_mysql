export interface RateLimitConfig {
  window_size_in_hours: number;
  window_max_request_count: number;
  window_log_interval_in_hours: number;
}