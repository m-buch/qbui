export const settingsSchema = [
  // -------------------- Downloads --------------------
  {
    id: "downloads",
    label: "Downloads",
    settings: [
      { key: "save_path",                         label: "Default save path",                                  type: "string" },
      { key: "create_subfolder_enabled",          label: "Create subfolder when adding a torrent",             type: "bool" },
      { key: "start_paused_enabled",              label: "Add torrents paused",                                type: "bool" },
      { key: "auto_delete_mode",                  label: "Auto delete mode",                                   type: "number" },
      { key: "preallocate_all",                   label: "Pre-allocate disk space for all files",              type: "bool" },
      { key: "incomplete_files_ext",              label: "Append .!qB to incomplete files",                    type: "bool" },
      { key: "auto_tmm_enabled",                  label: "Enable Automatic Torrent Management (default)",      type: "bool" },
      { key: "torrent_changed_tmm_enabled",       label: "Relocate when Category changes",                     type: "bool" },
      { key: "save_path_changed_tmm_enabled",     label: "Relocate when default save path changes",            type: "bool" },
      { key: "category_changed_tmm_enabled",      label: "Relocate when Category save path changes",           type: "bool" },
      { key: "temp_path_enabled",                 label: "Enable temp path for incomplete torrents",           type: "bool" },
      { key: "temp_path",                         label: "Temp path",                                          type: "string" },
      { key: "scan_dirs",                         label: "Watched folders (scan_dirs)",                        type: "object" },
      { key: "export_dir",                        label: "Copy .torrent files to",                             type: "string" },
      { key: "export_dir_fin",                    label: "Copy completed .torrent files to",                   type: "string" },
      { key: "queueing_enabled",                  label: "Enable torrent queueing",                            type: "bool" },
      { key: "max_active_downloads",              label: "Max active downloads",                               type: "number" },
      { key: "max_active_torrents",               label: "Max active torrents",                                type: "number" },
      { key: "max_active_uploads",                label: "Max active uploads",                                 type: "number" },
      { key: "dont_count_slow_torrents",          label: "Don't count slow torrents toward limits",            type: "bool" },
      { key: "slow_torrent_dl_rate_threshold",    label: "Slow DL threshold (KiB/s)",                          type: "number" },
      { key: "slow_torrent_ul_rate_threshold",    label: "Slow UL threshold (KiB/s)",                          type: "number" },
      { key: "slow_torrent_inactive_timer",       label: "Slow inactivity timer (s)",                          type: "number" },
      { key: "max_ratio_enabled",                 label: "Enable share ratio limit",                           type: "bool" },
      { key: "max_ratio",                         label: "Global share ratio limit",                           type: "number" },
      { key: "max_ratio_act",                     label: "Action when share ratio reached",                    type: "number" },
      { key: "autorun_enabled",                   label: "Run external program on completion",                 type: "bool" },
      { key: "autorun_program",                   label: "Program (path/args)",                                type: "string" },
      { key: "max_seeding_time_enabled",          label: "Enable max seeding time",                            type: "bool" },
      { key: "max_seeding_time",                  label: "Max seeding time (minutes)",                         type: "number" },
    ],
  },

  // -------------------- Connection --------------------
  {
    id: "connection",
    label: "Connection",
    settings: [
      { key: "listen_port",                       label: "Incoming connection port",                           type: "number" },
      { key: "upnp",                              label: "Enable UPnP/NAT-PMP",                                type: "bool" },
      { key: "random_port",                       label: "Randomly select port",                               type: "bool" },
      { key: "max_connec",                        label: "Global max connections",                             type: "number" },
      { key: "max_connec_per_torrent",            label: "Max connections per torrent",                        type: "number" },
      { key: "max_uploads",                       label: "Global max upload slots",                            type: "number" },
      { key: "max_uploads_per_torrent",           label: "Max upload slots per torrent",                       type: "number" },
      { key: "stop_tracker_timeout",              label: "Stopped announce timeout (s)",                       type: "number" },

      // Proxy
      { key: "proxy_type",                        label: "Proxy type",                                         type: "number" },
      { key: "proxy_ip",                          label: "Proxy IP / host",                                    type: "string" },
      { key: "proxy_port",                        label: "Proxy port",                                         type: "number" },
      { key: "proxy_peer_connections",            label: "Proxy peer & web seed connections",                  type: "bool" },
      { key: "proxy_auth_enabled",                label: "Proxy requires authentication",                      type: "bool" },
      { key: "proxy_username",                    label: "Proxy username",                                     type: "string" },
      { key: "proxy_password",                    label: "Proxy password",                                     type: "string" },
      { key: "proxy_torrents_only",               label: "Use proxy for torrents only",                        type: "bool" },

      // IP filter
      { key: "ip_filter_enabled",                 label: "Enable external IP filter",                          type: "bool" },
      { key: "ip_filter_path",                    label: "IP filter file path",                                type: "string" },
      { key: "ip_filter_trackers",                label: "Apply filters to trackers",                          type: "bool" },

      // Interfaces / networking & DDNS
      { key: "current_interface_address",         label: "Bind IP address (empty = all)",                      type: "string" },
      { key: "current_network_interface",         label: "Bind network interface",                             type: "string" },
      { key: "dyndns_enabled",                    label: "Enable dynamic DNS update",                          type: "bool" },
      { key: "dyndns_service",                    label: "DDNS service",                                       type: "number" },
      { key: "dyndns_username",                   label: "DDNS username",                                      type: "string" },
      { key: "dyndns_password",                   label: "DDNS password",                                      type: "string" },
      { key: "dyndns_domain",                     label: "DDNS domain",                                        type: "string" },
    ],
  },

  // -------------------- Speed --------------------
  {
    id: "speed",
    label: "Speed",
    settings: [
      { key: "dl_limit",                          label: "Global download limit (KiB/s, -1 = no limit)",       type: "number" },
      { key: "up_limit",                          label: "Global upload limit (KiB/s, -1 = no limit)",         type: "number" },
      { key: "limit_utp_rate",                    label: "Apply limits to uTP connections",                    type: "bool" },
      { key: "limit_tcp_overhead",                label: "Apply limits to TCP overhead",                       type: "bool" },
      { key: "limit_lan_peers",                   label: "Apply limits to LAN peers",                          type: "bool" },

      // Alternative limits & scheduler
      { key: "alt_dl_limit",                      label: "Alternative download limit (KiB/s)",                 type: "number" },
      { key: "alt_up_limit",                      label: "Alternative upload limit (KiB/s)",                   type: "number" },
      { key: "scheduler_enabled",                 label: "Enable alternative limits scheduler",                type: "bool" },
      { key: "schedule_from_hour",                label: "Schedule start hour",                                 type: "number" },
      { key: "schedule_from_min",                 label: "Schedule start minute",                               type: "number" },
      { key: "schedule_to_hour",                  label: "Schedule end hour",                                   type: "number" },
      { key: "schedule_to_min",                   label: "Schedule end minute",                                 type: "number" },
      { key: "scheduler_days",                    label: "Scheduler days",                                      type: "number" },
    ],
  },

  // -------------------- BitTorrent --------------------
  {
    id: "bittorrent",
    label: "BitTorrent",
    settings: [
      { key: "dht",                               label: "Enable DHT",                                         type: "bool" },
      { key: "pex",                               label: "Enable PeX",                                         type: "bool" },
      { key: "lsd",                               label: "Enable LSD",                                         type: "bool" },
      { key: "encryption",                        label: "Encryption mode",                                    type: "number" },
      { key: "anonymous_mode",                    label: "Enable anonymous mode",                              type: "bool" },
      { key: "bittorrent_protocol",               label: "BitTorrent protocol",                                type: "number" },

      // Trackers
      { key: "add_trackers_enabled",              label: "Automatically add trackers to new torrents",         type: "bool" },
      { key: "add_trackers",                      label: "Trackers to add (list)",                             type: "string" },
      { key: "announce_ip",                       label: "Announce IP",                                        type: "string" },
      { key: "announce_to_all_tiers",             label: "Always announce to all tiers",                       type: "bool" },
      { key: "announce_to_all_trackers",          label: "Always announce to all trackers in tier",            type: "bool" },

      // Algorithms / behavior
      { key: "upload_choking_algorithm",          label: "Upload choking algorithm",                           type: "number" },
      { key: "upload_slots_behavior",             label: "Upload slots behavior",                              type: "number" },
      { key: "utp_tcp_mixed_mode",                label: "µTP-TCP mixed mode",                                 type: "number" },
      { key: "enable_piece_extent_affinity",      label: "Enable piece extent affinity (advanced libtorrent)", type: "bool" },
    ],
  },

  // -------------------- RSS --------------------
  {
    id: "rss",
    label: "RSS",
    settings: [
      { key: "rss_refresh_interval",              label: "Refresh interval (minutes)",                         type: "number" },
      { key: "rss_max_articles_per_feed",         label: "Max articles per feed",                              type: "number" },
      { key: "rss_processing_enabled",            label: "Enable RSS processing",                              type: "bool" },
      { key: "rss_auto_downloading_enabled",      label: "Enable RSS auto-downloading",                        type: "bool" },
      { key: "rss_download_repack_proper_episodes", label: "Download repack/proper episodes",                 type: "bool" },
      { key: "rss_smart_episode_filters",         label: "Smart episode filters",                              type: "string" },
    ],
  },

  // -------------------- Web UI --------------------
  {
    id: "webui",
    label: "Web UI",
    settings: [
      // Language
      { key: "locale",                            label: "Language (locale)",                                  type: "string" },

      // Core WebUI
      { key: "web_ui_domain_list",                label: "Allowed domains (Host header validation)",           type: "string" },
      { key: "web_ui_address",                    label: "WebUI IP address",                                   type: "string" },
      { key: "web_ui_port",                       label: "WebUI port",                                         type: "number" },
      { key: "web_ui_upnp",                       label: "Use UPnP for WebUI port",                            type: "bool" },
      { key: "web_ui_username",                   label: "WebUI username",                                     type: "string" },
      { key: "web_ui_password",                   label: "WebUI password (write-only)",                        type: "string" },

      // Security
      { key: "web_ui_csrf_protection_enabled",    label: "Enable CSRF protection",                             type: "bool" },
      { key: "web_ui_clickjacking_protection_enabled", label: "Enable clickjacking protection",               type: "bool" },
      { key: "web_ui_secure_cookie_enabled",      label: "Set Secure cookie flag",                             type: "bool" },
      { key: "web_ui_max_auth_fail_count",        label: "Max auth failures before ban",                       type: "number" },
      { key: "web_ui_ban_duration",               label: "Ban duration (s)",                                   type: "number" },
      { key: "web_ui_session_timeout",            label: "Session timeout (s)",                                type: "number" },
      { key: "web_ui_host_header_validation_enabled", label: "Enable Host header validation",                  type: "bool" },

      // Auth bypass controls
      { key: "bypass_local_auth",                 label: "Bypass auth for 127.0.0.1",                          type: "bool" },
      { key: "bypass_auth_subnet_whitelist_enabled", label: "Enable auth bypass for subnets",                 type: "bool" },
      { key: "bypass_auth_subnet_whitelist",      label: "Subnet whitelist (comma-separated)",                 type: "string" },

      // Alternative / HTTPS / headers
      { key: "alternative_webui_enabled",         label: "Use alternative WebUI",                              type: "bool" },
      { key: "alternative_webui_path",            label: "Alternative WebUI path",                             type: "string" },
      { key: "use_https",                          label: "Enable HTTPS",                                      type: "bool" },
      { key: "ssl_key",                           label: "SSL key (legacy API < 2.0.1)",                       type: "string" },
      { key: "ssl_cert",                          label: "SSL cert (legacy API < 2.0.1)",                      type: "string" },
      { key: "web_ui_https_key_path",             label: "HTTPS key path",                                     type: "string" },
      { key: "web_ui_https_cert_path",            label: "HTTPS cert path",                                    type: "string" },

      // Custom headers
      { key: "web_ui_use_custom_http_headers_enabled", label: "Enable custom HTTP headers",                   type: "bool" },
      { key: "web_ui_custom_http_headers",        label: "Custom HTTP headers",                                type: "string" },

      // E-mail notifications
      { key: "mail_notification_enabled",         label: "Enable e-mail notifications",                        type: "bool" },
      { key: "mail_notification_sender",          label: "Sender e-mail",                                      type: "string" },
      { key: "mail_notification_email",           label: "Recipient e-mail",                                   type: "string" },
      { key: "mail_notification_smtp",            label: "SMTP server",                                        type: "string" },
      { key: "mail_notification_ssl_enabled",     label: "SMTP requires SSL",                                  type: "bool" },
      { key: "mail_notification_auth_enabled",    label: "SMTP requires authentication",                       type: "bool" },
      { key: "mail_notification_username",        label: "SMTP username",                                      type: "string" },
      { key: "mail_notification_password",        label: "SMTP password",                                      type: "string" },
    ],
  },

  // -------------------- Advanced --------------------
  {
    id: "advanced",
    label: "Advanced",
    settings: [
      { key: "async_io_threads",                  label: "Asynchronous I/O threads",                           type: "number" },
      { key: "banned_IPs",                        label: "Banned IPs (list)",                                  type: "string" },
      { key: "checking_memory_use",               label: "Memory while checking (MiB)",                        type: "number" },
      { key: "disk_cache",                        label: "Disk cache (MiB)",                                   type: "number" },
      { key: "disk_cache_ttl",                    label: "Disk cache expiry (s)",                              type: "number" },
      { key: "embedded_tracker_port",             label: "Embedded tracker port",                              type: "number" },
      { key: "enable_coalesce_read_write",        label: "Enable coalesce reads/writes",                       type: "bool" },
      { key: "enable_embedded_tracker",           label: "Enable embedded tracker",                            type: "bool" },
      { key: "enable_multi_connections_from_same_ip", label: "Allow multiple connections from same IP",       type: "bool" },
      { key: "enable_os_cache",                   label: "Enable OS cache",                                    type: "bool" },
      { key: "enable_upload_suggestions",         label: "Enable upload piece suggestions",                    type: "bool" },
      { key: "file_pool_size",                    label: "File pool size",                                     type: "number" },
      { key: "outgoing_ports_max",                label: "Max outgoing port (0 = disabled)",                   type: "number" },
      { key: "outgoing_ports_min",                label: "Min outgoing port (0 = disabled)",                   type: "number" },
      { key: "recheck_completed_torrents",        label: "Recheck completed torrents",                         type: "bool" },
      { key: "resolve_peer_countries",            label: "Resolve peer countries",                             type: "bool" },
      { key: "save_resume_data_interval",         label: "Save resume data interval (min)",                    type: "number" },
      { key: "send_buffer_low_watermark",         label: "Send buffer low watermark (KiB)",                    type: "number" },
      { key: "send_buffer_watermark",             label: "Send buffer watermark (KiB)",                        type: "number" },
      { key: "send_buffer_watermark_factor",      label: "Send buffer watermark factor (%)",                   type: "number" },
      { key: "socket_backlog_size",               label: "Socket backlog size",                                type: "number" },
      { key: "upnp_lease_duration",               label: "UPnP lease duration (0 = permanent)",                type: "number" },
    ],
  },
];
