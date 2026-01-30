# zbx-to-nextcloud-talk

This script is used to send Zabbix alerts to Nextcloud Talk.

It is a modified version of the Zabbix script that sends alerts to Slack.

## Zabbix Parameters

The following variables should be passed to the script as parameters in the Zabbix Media Type configuration.

| Variable | Description | Zabbix Macro / Value |
| :--- | :--- | :--- |
| alert_message | Alert message body | `{ALERT.MESSAGE}` |
| alert_subject | Alert subject | `{ALERT.SUBJECT}` |
| bot_token | Nextcloud Talk Bot Token | `<bot_token>` |
| bot_user | Nextcloud Talk Bot User (ID) | `<bot_user_id>` |
| channel | Nextcloud Talk Channel Token | `<channel_token>` |
| discovery_host_dns | Discovery Host DNS (if event source is discovery) | `{DISCOVERY.DEVICE.DNS}` |
| discovery_host_ip | Discovery Host IP (if event source is discovery) | `{DISCOVERY.DEVICE.IPADDRESS}` |
| event_date | Event date | `{EVENT.DATE}` |
| event_id | Event numeric ID | `{EVENT.ID}` |
| event_nseverity | Event numeric severity (0-5) | `{EVENT.NSEVERITY}` |
| event_opdata | Event operational data | `{EVENT.OPDATA}` |
| event_recovery_date | Event recovery date | `{EVENT.RECOVERY.DATE}` |
| event_recovery_time | Event recovery time | `{EVENT.RECOVERY.TIME}` |
| event_severity | Event severity name | `{EVENT.SEVERITY}` |
| event_source | Event source (0-3) | `{EVENT.SOURCE}` |
| event_tags | Event tags (JSON) | `{EVENT.TAGSJSON}` |
| event_time | Event time | `{EVENT.TIME}` |
| event_update_date | Event update date | `{EVENT.UPDATE.DATE}` |
| event_update_status | Event update status (0 or 1) | `{EVENT.UPDATE.STATUS}` |
| event_update_time | Event update time | `{EVENT.UPDATE.TIME}` |
| event_value | Event value (0 or 1) | `{EVENT.VALUE}` |
| host_conn | Host connection | `{HOST.CONN}` |
| host_name | Host name | `{HOST.NAME}` |
| HTTPProxy | HTTP Proxy (optional) | `<proxy_url>` |
| nextcloud_talk_as_user | Send as user or bot | `true` / `false` |
| nextcloud_talk_endpoint | API Endpoint | `<url>/ocs/v2.php/apps/spreed/api/v1/chat/` |
| nextcloud_talk_mode | Notification mode | `alarm` / `event` |
| trigger_description | Trigger description | `{TRIGGER.DESCRIPTION}` |
| trigger_id | Trigger ID | `{TRIGGER.ID}` |
| zabbix_url | Zabbix frontend URL | `{$ZABBIX.URL}` |
