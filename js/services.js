angular.module('starter.services', [])
.factory('Service',  function($http,$resource,WX){
  var APIURL = WX.url;
  var WX = $resource(APIURL,{},{
      WXOauth2:{
          method: "GET",
          url: "/ionic/php/oauth2.php"
      },
      WXToken:{
          method: "GET",
          url: '/ionic/php/token.php'
      },
      WXToken2:{
          method: "GET",
          url: APIURL + "/cgi-bin/token?grant_type=client_credential&appid="+WX.appid+"&secret="+WX.secret
      },
      WXTicket:{
          method: "GET",
          url: '/ionic/php/ticket.php'
      },
      WXUserinfo:{
          method: "GET",
          url: "/ionic/php/userinfo.php"
      }
    });
  var Service = {
    WXOauth2:function(params){
        return WX.WXOauth2(params).$promise.then(function(res){
            return res;
        });
    },
    WXToken:function(params){
        return WX.WXToken(params).$promise.then(function(res){
           return res;
        })
    },
    WXTicket:function(accessToken){
        return WX.WXTicket({'access_token': accessToken}).$promise.then(function(res){
            return res;
        })
    }
    ,
    WXUserinfo:function(params){
        return WX.WXUserinfo(params).$promise.then(function(res){
            return res;
        })
    }
  }
  return Service
 })
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: '毕诚',
    lastText: 'You on your way?',
    face: 'http://www.angularui.cn/bbs/uploads/avatar/2/02/2_big.png'
  }, {
    id: 1,
    name: '毕诚',
    lastText: 'Hey, it\'s me',
    face: 'http://www.angularui.cn/bbs/uploads/avatar/2/02/2_big.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
