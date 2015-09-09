
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngResource'])
.value('GRAV', {
  appid:'vgy82y1h97o3015mgyzelgmmn028tvcqxl0ruky8czvf5sy3',
  appkey:'ql6muc3dq86c737cv9lckgct8bqnxhu7qixsqdemcv7tpfb8'
})
.value('WX',{
    url:'http://www.angularui.cn/ionic',
    appid:'wxca65cb5d89c2f437',
    secret:'7d72fa1751ab37b8c1510f9fbfcb931d',
})
.value('CURUSER',{
    obj:'AV/vgy82y1h97o3015mgyzelgmmn028tvcqxl0ruky8czvf5sy3/currentUser'
})
.run(function($ionicPlatform, GRAV, WX, $location, Service, $rootScope) {
  //leancloud配置
  AV.initialize(GRAV.appid,GRAV.appkey);
  //wx配置
  var WXconfig = function(ticket){
    //时间戳
    var time = new Date().getTime();
    //随机串
    var nonceStr = Math.random().toString(36).substr(2, 15);
    //签名字符串
    var signStr = "jsapi_ticket=" + ticket +
        "&noncestr=" + nonceStr +
        "&timestamp=" + time +
        "&url=" + $location.absUrl();
    //SHA1加密
    var sign = ("" + CryptoJS.SHA1(signStr));
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: WX.appid, // 必填，公众号的唯一标识
        timestamp: time, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: sign,// 必填，签名，见附录1
        jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
  };
  var url=$location.absUrl();
  var parames = {};
  url.replace(/(\w+)=(\w+)/ig, function(a, b, c){parames[b] = c;});
  var code = parames['code'];
  //
  var getUser=function(){
    Service.WXOauth2({'appid':WX.appid,'secret':WX.secret,'code':code}).then(function(res) {
      Service.WXUserinfo({'access_token':res.access_token,'openid':res.openid}).then(function(res) {
        $rootScope.userinfo=res;
      })
    })
  }
  getUser();
  var getTicket=function(){
    Service.WXToken({appid:WX.appid,secret:WX.secret}).then(function(res) {
          Service.WXTicket(res.access_token).then(function (res) {
              if(res.errcode == 0){
                  ticket = new Object();
                  ticket.ticket =  res.ticket;
                  ticket.in = res.expires_in;
                  ticket.createAt = new Date().getTime();
                  localStorage.setItem('ticket', angular.toJson(ticket));
                  WXconfig(ticket.ticket);
              }
          });
      });
  }
  var ticket = localStorage.getItem("ticket");
  // if(ticket){
  //   var ticket = angular.fromJson(ticket);
  //   var time = new Date().getTime();
  //   var createAt = ticket.createAt;
  //   if(time - createAt <  (ticket.in * 1000)){
  //     WXconfig(ticket.ticket);
  //   }
  //   else{
  //     getTicket();
  //   }
  // }
  // else{
  //   getTicket();
  // }
  getTicket();
  wx.error(function(res){
     alert('WX出错');
  });
  AV.User.logIn("test", "123123", {
    success: function(user) {
      // 成功了，现在可以做其他事情了.
      console.log('登录成功');
    },
    error: function(user, error) {
      // 失败了.
      console.log('失败');
    }
  });
  
////////////////////////////////////////
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})
.filter('phoneFormat',function(){
  return function(phonenum){
    return phonenum?phonenum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'):'您还未绑定手机~'
  }
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.goods', {
      url: '/goods',
      views: {
        'tab-goods': {
          templateUrl: 'templates/tab-goods.html',
          controller: 'GoodsCtrl'
        }
      }
    })
  .state('tab.good-detail', {
      url: '/goods/:goodId',
      views: {
        'tab-goods': {
          templateUrl: 'templates/good-detail.html',
          controller: 'GoodDetailCtrl'
        }
      }
    })
  .state('tab.order', {
      url: '/order/:goodId',
      views: {
        'tab-goods': { 
          templateUrl: 'templates/order.html',
          controller: 'OrderCtrl'
        }
      },
      cache:false
    })
  .state('tab.pay', {
      url: '/pay',
      views: {
        'tab-goods': { 
          templateUrl: 'templates/pay.html',
          controller: 'PayCtrl'
        }
      },
      cache:false
    })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.phone-bind', {
    url: '/phone-bind',
    views: {
      'tab-account': {
        templateUrl: 'templates/phone-bind.html',
        controller: 'PhoneCtrl'
      }
    }
  })
  .state('demo', {
    url: '/demo',
    templateUrl: 'templates/demo.html'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
