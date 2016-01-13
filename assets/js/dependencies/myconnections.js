/**
 * Created by nstyl on 13-Jan-16.
 */
function easy() {
    var _localRoom, _remoteRoom, _localStream, _remoteStreams, _available , _webRTCinitialized, _user;
    var _acceptedStreamsMap = {};
    var roomName = "SectorOne";
    var mySocket;

    function init(options) {
        _webRTCinitialized = false;
        _available = false;
        _remoteStreams = [];

        _remoteRoom = {
            id: undefined,
            token: undefined
        };

        mySocket = io.connect();
        _user = {
            id: options.id,
            role: 'presenter'
        };
        return this;
    }

    function connect() {
        easyrtc.dontAddCloseButtons();
        easyrtc.enableDebug(true);
        easyrtc.enableAudio(false);
        easyrtc.enableVideo(false);
        easyrtc.enableAudioReceive(true);
        easyrtc.enableVideoReceive(true);
        easyrtc.setRoomOccupantListener(occupantsChanged);

        easyrtc.connect('auvious.audioVideo', function (easyrtcid, roomOwner) {

            _localRoom = easyrtcid;
            console.log('connected with id : ' + easyrtcid);

        }, function (error) {
            alert(error);
        });

        easyrtc.setDisconnectListener(roomDisconnected);
        easyrtc.setStreamAcceptor(callAccepted);
        easyrtc.setAcceptChecker(acceptCall);
        easyrtc.setOnStreamClosed(streamRemoved);
    }


    function startStreaming(audio, video, screen) {
        easyrtc.enableAudio(audio);
        easyrtc.enableVideo(video);
        easyrtc.enableAudioReceive(true);
        easyrtc.enableVideoReceive(true);

        easyrtc.initMediaSource(
            // success callback
            function () {
                var stream = easyrtc.getLocalStream();
                var compositeID = _user.id;
                var eventData = {userId: _user.id, role: _user.role, easyrtcid: _localRoom, id: stream.id, video: video, audio: !video, screen: screen};
                _acceptedStreamsMap[_localRoom] = eventData;
                var streamUrl = easyrtc.getLocalStreamAsUrl();
                var options = {video: video, audio: !video, screen: screen, local: true, streamUrl: streamUrl};
                console.log('about to show LOCAL stream...');
                showStream(compositeID, stream, options);
                easyrtc.setRoomApiField(roomName, _localRoom, JSON.stringify(eventData));
            },
            function (err) {
                alert(err);
            }
        );
    }

    function occupantsChanged(roomName, occupants, selfInfo) {
        _remoteStreams = [];
        easyrtc.setRoomOccupantListener(null);
        for (var easyrtcid in occupants) {
            var occ = occupants[easyrtcid];
            if (occ && occ.apiField) {
                var streamingId = occ.apiField[easyrtcid];
                if (streamingId && !_acceptedStreamsMap.hasOwnProperty(streamingId)) {
                    var data = JSON.parse(occ.apiField[easyrtcid].fieldValue);
                    _remoteStreams.push(data);
                }
            }
        }
        if (_remoteStreams.length > 0)
            callOthers();
    }

    function callAccepted(easyrtcid, stream) {
        if (_acceptedStreamsMap[easyrtcid] && !_acceptedStreamsMap[easyrtcid].streaming) {
            var remoteStream = _acceptedStreamsMap[easyrtcid];
            var compositeID = remoteStream.userId;
            var options = Object.clone(remoteStream);
            options.streamUrl = URL.createObjectURL(stream);
            options.local = false;

            console.log('about to show remote stream...');
            console.log(_acceptedStreamsMap);

            _acceptedStreamsMap[easyrtcid].streaming = true;

            showStream(compositeID, stream, options);
        }
    }

    function acceptCall(easyrtcid, acceptedCB) {
        acceptedCB(true);
    }

    function callOthers() {
        function establishConnection(position) {
            function callSuccess() {
            }

            function callFailure(errorCode, errorText) {
            }

            if (position >= 0) {
                console.log('calling ....' + _remoteStreams[position].easyrtcid);

                easyrtc.call(_remoteStreams[position].easyrtcid, callSuccess, callFailure, function (accepted, easyrtcid) {
                    if (position > 0) {
                        establishConnection(position - 1);
                    }
                    connectionCallAccepted(accepted, easyrtcid)
                })
            }
        }

        if (_remoteStreams.length > 0) {
            establishConnection(_remoteStreams.length - 1);
        }
    }

    function connectionCallAccepted(accepted, easyrtcid) {
        if (accepted) {
            if (_acceptedStreamsMap[easyrtcid] == undefined) {
                _acceptedStreamsMap[easyrtcid] = _remoteStreams.find(function (stream) {
                    return stream.easyrtcid == easyrtcid;
                });
            }
            console.log('accepted stream--->' + easyrtcid);
            console.log(_acceptedStreamsMap)
        }
    }

    function showStream(compositeID, stream, options) {
        $(compositeID).find('video').attr('src', options.streamUrl);
        console.log('streaming...');
    }

    function closeStream(stream) {

        easyrtc.enableAudio(false);
        easyrtc.enableVideo(false);

        if (stream.local) {
            delete _acceptedStreamsMap[_localRoom];
            easyrtc.setRoomApiField(roomName, _localRoom, undefined);
            easyrtc.closeLocalStream(stream.streamName);
        }
    }

    function streamRemoved(easyrtcId) {

        easyrtc.enableAudio(false);
        easyrtc.enableVideo(false);

        var stream = _acceptedStreamsMap[easyrtcId];
        if (stream) {

            console.log('stream removed ---->' + easyrtcId);
            console.log(_acceptedStreamsMap);

            var attrs = {guid: stream.id, userId: stream.userId};
            delete _acceptedStreamsMap[easyrtcId];
            console.log(_acceptedStreamsMap);
        }
    }

    function roomDisconnected() {

    }

    function disconnect() {
        easyrtc.disconnect();
    }

    return {
        init: init,
        startStreaming: startStreaming,
        connect: connect,
        disconnect: disconnect,
        closeStream: closeStream

    }
}

