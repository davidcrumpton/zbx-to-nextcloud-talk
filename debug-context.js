
// Mock Zabbix global environment for local debugging
global.Zabbix = {
    log: function(level, message) {
        console.log(`[Zabbix Log Level ${level}] ${message}`);
    }
};

global.HttpRequest = class HttpRequest {
    constructor() {
        this.headers = {};
        this.proxy = null;
        this.status = 200;
    }

    addHeader(header) {
        const parts = header.split(':');
        if (parts.length >= 2) {
            this.headers[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
    }

    setProxy(proxy) {
        this.proxy = proxy;
        console.log(`[MockHttpRequest] Set Proxy: ${proxy}`);
    }

    get(url) {
        console.log(`[MockHttpRequest] GET ${url}`);
        // Return dummy response
        return JSON.stringify({
            ok: true,
            permalink: 'https://mock-permalink.com/msg/123'
        });
    }

    post(url, body) {
        console.log(`[MockHttpRequest] POST ${url}`);
        console.log(`[MockHttpRequest] Body: ${body}`);
        
        this.status = 201;

        // Return XML response as seen in the curl example
        return `<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>201</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <id>799</id>
  <token>rvrujudf</token>
  <actorType>users</actorType>
  <actorId>chatbot</actorId>
  <actorDisplayName>Chatty Botti</actorDisplayName>
  <timestamp>1769028187</timestamp>
  <message>🚨 Test message from debug context</message>
  <messageParameters/>
  <systemMessage></systemMessage>
  <messageType>comment</messageType>
  <isReplyable>1</isReplyable>
  <referenceId></referenceId>
  <reactions/>
  <expirationTimestamp>0</expirationTimestamp>
  <markdown>1</markdown>
  <threadId>799</threadId>
 </data>
</ocs>`;
    }

    getStatus() {
        return this.status;
    }
};

// Mock the 'value' global variable which contains the Zabbix parameters
global.value = JSON.stringify({
    "bot_user": "mock_bot_user",
    "bot_token": "mock_bot_token",
    "channel": "mock_channel_token",
    "event_id": 12345,
    "event_source": "0", // Trigger event
    "event_nseverity": "4", // High severity
    "event_severity": "High",
    "event_update_status": "0", // Problem (not update)
    "event_value": "1", // Problem state
    "host_conn": "192.168.1.100",
    "host_name": "mock-server",
    "alert_subject": "High CPU Load",
    "alert_message": "CPU load is over 90% on mock-server",
    "event_date": "2023-01-01",
    "event_time": "12:00:00",
    "event_opdata": "Load: 5.2",
    "event_tags": "[{\"tag\": \"Application\", \"value\": \"Database\"}]",
    "trigger_description": "Processor load is too high",
    "trigger_id": 999,
    "zabbix_url": "https://zabbix.crumpton.org",
    "nextcloud_talk_as_user": "false",
    "nextcloud_talk_mode": "alarm",
    "nextcloud_talk_endpoint": "https://nextcloud.crumpton.org/ocs/v2.php/apps/spreed/api/v1/"
});

console.log("Debug context loaded. 'value', 'HttpRequest', and 'Zabbix' are defined.");
