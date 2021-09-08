var socket = io.connect('https://streamntn.herokuapp.com/');

$("#div-chat").hide()

socket.on("DANH_SACH_ONLINE",arrUserInfo=>{
    $("#div-chat").show()
    $("#div-dang-ky").hide()

    arrUserInfo.forEach(user => {
        const {ten , peerId} = user
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`)
    });
    socket.on("CO_NGUOI_DUNG_MOI",user=>{
        const {ten , peerId} = user
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`)
    })
})
socket.on('AI_DO_NGAT_KET_NOI',(peerId)=>{
    $(`#${peerId}`).remove()
})
socket.on('DANG_KY_THAT_BAI',()=>{
    alert('Vui long chọn userName khác')
})
function openStream(){
    const config ={ audio : false , video : true}
    return navigator.mediaDevices.getUserMedia(config)
}
function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag)
    video.srcObject = stream;
    video.onloadedmetadata = function() {
        video.play();
      };
}

openStream()
    .then(stream => {
        playStream('localStream',stream)
        console.log(stream);
    })
    .catch(err=> console.log(err))


var peer = new Peer();
peer.on('open', function(id) {
    $('#my-peer-id').append(id)
    $("#btnSignUp").click(function (e) { 
        const username = $("#txtUsername").val()
        socket.emit('NGUOI_DUNG_DANG_KY',{ten : username, peerId: id})    
    });  
  });

$("#btnCall").click(()=>{
    var id = $("#remoteId").val();
    openStream()
        .then(stream=>{
            playStream('localStream',stream)
            const call = peer.call(id,stream)
            call.on('stream',remoteStream =>{playStream('remoteStream',remoteStream)})
        })
  })

peer.on('call',call=>{
    openStream()
        .then((stream)=>{
            call.answer(stream);
            playStream('localStream',stream)
            call.on('stream',remoteStream =>{playStream('remoteStream',remoteStream)})
        })
  })

$("#ulUser").on('click','li',function(){
    const id = $(this).attr('id');
    openStream()
    .then(stream=>{
        playStream('localStream',stream)
        const call = peer.call(id,stream)
        call.on('stream',remoteStream =>{playStream('remoteStream',remoteStream)})
    })
})  
