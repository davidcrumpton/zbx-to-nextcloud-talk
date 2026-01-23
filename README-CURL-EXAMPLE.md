# Example curl command

This code is based on the following Nextcloud documentation:
`https://docs.nextcloud.com/server/latest/developer_manual/app/ocs_api.html`

This code is validated against the test below:

## Invoke the API

```bash
bear@purplemac-1 .ollama % curl -u <ncuser>:<ncpass> \
  -X POST https://yournextcloudserver.domain.org/ocs/v2.php/apps/spreed/api/v1/chat/send \
  -H "OCS-APIRequest: true" \
  -H "Content-Type: application/json" \
  --data '{
    "token": "<your-channel-token>",
    "message": "🚨 Test message from curl"
  }'
```

## Example response

```xml
<?xml version="1.0"?>
<ocs>
 <meta>
  <status>ok</status>
  <statuscode>201</statuscode>
  <message>OK</message>
 </meta>
 <data>
  <id>799</id>
  <token><your-channel-token></token>
  <actorType>users</actorType>
  <actorId><your-nc-user></actorId>
  <actorDisplayName><your-nc-user></actorDisplayName>
  <timestamp>1769028187</timestamp>
  <message>🚨 Test message from curl</message>
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
</ocs>
```
