var SEVERITY_EMOJIS = [
    ':white_medium_square:', ':blue_square:', ':yellow_square:',
    ':orange_square:', ':red_square:', ':black_square:'
];

var RESOLVE_EMOJI = ':white_medium_square:';

var NEXTCLOUD_TALK_MODE_HANDLERS = {
    alarm: handlerAlarm,
    event: handlerEvent
};


if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;

        return this.replace(/{(\d+)}/g, function(match, number) {
            return number in args
                ? args[number]
                : match
            ;
        });
    };
}

function isEventProblem(params) {
    return params.event_value == 1
        && params.event_update_status == 0
    ;
}

function isEventUpdate(params) {
    return params.event_value == 1
        && params.event_update_status == 1
    ;
}

function isEventResolve(params) {
    return params.event_value == 0;
}



function createProblemURL(zabbix_url, triggerid, eventid, event_source) {
    var problem_url = '';
    if (event_source === '0') {
        problem_url = '{0}/tr_events.php?triggerid={1}&eventid={2}'
            .format(
                zabbix_url,
                triggerid,
                eventid
            );
    }
    else {
        problem_url = zabbix_url;
    }

    return problem_url;
}


function handlerAlarm(params) {
    var messageText = '';

    if (isEventProblem(params)) {
        messageText = createMessage(
            SEVERITY_EMOJIS[params.event_nseverity] || 0,
            params.event_date,
            params.event_time,
            createProblemURL(params.zabbix_url, params.trigger_id, params.event_id, params.event_source)
        );
    }
    else if (isEventUpdate(params)) {
        messageText = createMessage(
            SEVERITY_EMOJIS[params.event_nseverity] || 0,
            params.event_update_date,
            params.event_update_time,
            createProblemURL(params.zabbix_url, params.trigger_id, params.event_id, params.event_source),
            true
        );
    }
    else if (isEventResolve(params)) {
        messageText = createMessage(
            RESOLVE_EMOJI,
            params.event_recovery_date,
            params.event_recovery_time,
            createProblemURL(params.zabbix_url, params.trigger_id, params.event_id, params.event_source)
        );
    }

    var payload = {
        "token": params.channel,
        "message": messageText
    };

    var resp = req.post(NextcloudTalk.postMessage, JSON.stringify(payload));

    if (req.getStatus() != 201) {
        throw 'Response code: ' + req.getStatus() + '; Error: ' + resp;
    }
    
    // Check for XML success response
    if (resp.indexOf('<statuscode>201</statuscode>') === -1 && resp.indexOf('<status>ok</status>') === -1) {
         throw 'Response was 201 but XML body did not contain success status. Body: ' + resp;
    }
}

function handlerEvent(params) {
    var messageText = '';

    if (isEventProblem(params)) {
        messageText = createMessage(
            SEVERITY_EMOJIS[params.event_nseverity] || 0,
            params.event_date,
            params.event_time,
            createProblemURL(params.zabbix_url, params.trigger_id, params.event_id, params.event_source)
        );
    }
    else if (isEventUpdate(params)) {
        messageText = createMessage(
            SEVERITY_EMOJIS[params.event_nseverity] || 0,
            params.event_update_date,
            params.event_update_time,
            createProblemURL(params.zabbix_url, params.trigger_id, params.event_id, params.event_source),
            false
        );
    }
    else if (isEventResolve(params)) {
         messageText = createMessage(
            RESOLVE_EMOJI,
            params.event_recovery_date,
            params.event_recovery_time,
            createProblemURL(params.zabbix_url, params.trigger_id, params.event_id, params.event_source)
        );
    }

    var payload = {
        "token": params.channel,
        "message": messageText
    };

    var resp = req.post(NextcloudTalk.postMessage, JSON.stringify(payload));
    
    if (req.getStatus() != 201) {
        throw 'Response code: ' + req.getStatus() + '; Error: ' + resp;
    }
    
     // Check for XML success response
    if (resp.indexOf('<statuscode>201</statuscode>') === -1 && resp.indexOf('<status>ok</status>') === -1) {
         throw 'Response was 201 but XML body did not contain success status. Body: ' + resp;
    }
}

function createMessage(
    event_severity_color, // unused but kept for signature compatibility or removed if I update calls
    event_date,
    event_time,
    problem_url,
    isShort,
    messageText
) {
    var message = '';

    // Subject / Title
    message += '**' + params.alert_subject + '**\n\n';
    
    // Message Body
    if (messageText) {
        message += messageText + '\n\n';
    }

    // Host
    message += '**Host:** {0} [{1}]\n'.format(params.host_name, params.host_conn);
    
    // Time
    message += '**Event time:** {0} {1}\n'.format(event_date, event_time);
    
    if (params.event_source === '0') {
        message += '**Severity:** {0}\n'.format(params.event_severity);
        message += '**Opdata:** {0}\n'.format(params.event_opdata);
    }

    if (!isShort && params.event_source === '0') {
        message += '**Link:** {0}\n'.format(problem_url);
        
        try {
            var tags = JSON.parse(params.event_tags).filter(function (e) { return !e.tag.includes('__') }).map(function (e) { return e.tag + ': ' + e.value }).join(', ') || 'None';
             message += '**Event tags:** {0}\n'.format(tags);
        } catch (e) {
            // ignore tag parsing errors
        }
        
        message += '**Trigger description:** {0}\n'.format(params.trigger_description);
    }

    if (params.event_source !== '0' || params.event_update_status === '1') {
        message += '\n**Details:**\n{0}\n'.format(params.alert_message);
    }

    return message;
}

// TODO: replace slack with nextcloud talk params



function validateParams(params) {
    if (typeof params.bot_user !== 'string' || params.bot_user.trim() === '') {
        throw 'Field "bot_user" cannot be empty';
    }
    if (typeof params.bot_token !== 'string' || params.bot_token.trim() === '') {
        throw 'Field "bot_token" cannot be empty';
    }

    if (typeof params.channel !== 'string' || params.channel.trim() === '') {
        throw 'Field "channel" cannot be empty';
    }

    if (isNaN(params.event_id)) {
        throw 'Field "event_id" is not a number';
    }

    if ([0, 1, 2, 3].indexOf(parseInt(params.event_source)) === -1) {
        throw 'Incorrect "event_source" parameter given: "' + params.event_source + '".\nMust be 0-3.';
    }

    if (params.event_source !== '0') {
        params.event_nseverity = '0';
        params.event_severity = 'Not classified';
        params.event_update_status = '0';
        params.nextcloud_talk_mode = 'event';
    }

    if (params.event_source === '1' || params.event_source === '2') {
        params.event_value = '1';
    }

    if (params.event_source === '1') {
        params.host_name = params.discovery_host_dns;
        params.host_ip = params.discovery_host_ip;
    }

    if (!~[0, 1, 2, 3, 4, 5].indexOf(parseInt(params.event_nseverity))) {
        throw 'Incorrect "event_nseverity" parameter given: ' + params.event_nseverity + '\nMust be 0-5.';
    }

    if (typeof params.event_severity !== 'string' || params.event_severity.trim() === '') {
        throw 'Field "event_severity" cannot be empty';
    }

    if (params.event_update_status !== '0' && params.event_update_status !== '1') {
        throw 'Incorrect "event_update_status" parameter given: ' + params.event_update_status + '\nMust be 0 or 1.';
    }

    if (params.event_value !== '0' && params.event_value !== '1') {
        throw 'Incorrect "event_value" parameter given: ' + params.event_value + '\nMust be 0 or 1.';
    }

    if (typeof params.host_conn !== 'string' || params.host_conn.trim() === '') {
        throw 'Field "host_conn" cannot be empty';
    }

    if (typeof params.host_name !== 'string' || params.host_name.trim() === '') {
        throw 'Field "host_name" cannot be empty';
    }

    if (!~['true', 'false'].indexOf(params.nextcloud_talk_as_user.toLowerCase())) {
        throw 'Incorrect "nextcloud_talk_as_user" parameter given: ' + params.nextcloud_talk_as_user + '\nMust be "true" or "false".';
    }

    if (!~['alarm', 'event'].indexOf(params.nextcloud_talk_mode)) {
        throw 'Incorrect "nextcloud_talk_mode" parameter given: ' + params.nextcloud_talk_mode + '\nMust be "alarm" or "event".';
    }

    if (isNaN(params.trigger_id) && params.event_source === '0') {
        throw 'field "trigger_id" is not a number';
    }

    if (typeof params.zabbix_url !== 'string' || params.zabbix_url.trim() === '') {
        throw 'Field "zabbix_url" cannot be empty';
    }

    if (typeof params.zabbix_url !== 'string' || params.zabbix_url.trim() === '') {
        throw 'Field "zabbix_url" cannot be empty';
    }


    if (!/^(http|https):\/\/.+/.test(params.zabbix_url)) {
        throw 'Field "zabbix_url" must contain a schema';
    }

}

try {
    var params = JSON.parse(value);

    validateParams(params);

    var req = new HttpRequest(),
        result = {tags: {}};

    if (typeof params.HTTPProxy === 'string' && params.HTTPProxy.trim() !== '') {
        req.setProxy(params.HTTPProxy);
    }
    req.addHeader('Content-Type: application/json; charset=utf-8');
    req.addHeader('Authorization: Basic ' + btoa(params.bot_user + ':' + params.bot_token));
    req.addHeader('OCS-APIRequest: true');

    var nextcloud_talk_endpoint = params.nextcloud_talk_endpoint;

    var NextcloudTalk = {
        postMessage: nextcloud_talk_endpoint + encodeURIComponent(params.channel)
    };

    params.nextcloud_talk_mode = params.nextcloud_talk_mode.toLowerCase();
    params.nextcloud_talk_mode = params.nextcloud_talk_mode in NEXTCLOUD_TALK_MODE_HANDLERS
        ? params.nextcloud_talk_mode
        : 'alarm';

    NEXTCLOUD_TALK_MODE_HANDLERS[params.nextcloud_talk_mode](params);
// Nextcloud API returns XML response
    if (params.event_source === '0') {
        return result;
    }
    else {
        return 'OK';
    }
}
catch (error) {
   Zabbix.log(4, '[ Nextcloud Talk Webhook ] Nextcloud Talk notification failed : ' + error);
    throw 'Nextcloud Talk notification failed : ' + error;
}