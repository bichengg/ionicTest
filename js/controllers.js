angular.module('starter.controllers', [])
.controller('ContentController',function($scope, $ionicSideMenuDelegate){
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }
})
.controller('DashCtrl', function($scope, $ionicPopup,$timeout,$ionicLoading) {
  $ionicLoading.show({
      template: '加载中...'
  });
  //
  $scope.slideNav=[
    [
      [
        {icon:'ion-android-desktop',color:'calm',name:'美食',url:'..'},
        {icon:'ion-android-bulb',color:'positive',name:'电影',url:'..'},
        {icon:'ion-android-desktop',color:'balanced',name:'本期推荐',url:'..'},
        {icon:'ion-android-cart',color:'energized',name:'KTV',url:'..'}
      ],
      [
        {icon:'ion-ios-partlysunny',color:'assertive',name:'酒店',url:'..'},
        {icon:'ion-ios-film-outline',color:'royal',name:'代金券',url:'..'},
        {icon:'ion-android-bicycle',color:'calm',name:'周边游',url:'..'},
        {icon:'ion-ios-telephone',color:'royal',name:'全部分类',url:'..'}
      ]
    ],
    [
      [
        {icon:'ion-android-desktop',color:'calm',name:'代金券',url:'..'},
        {icon:'ion-android-bulb',color:'positive',name:'电影',url:'..'},
        {icon:'ion-android-bicycle',color:'balanced',name:'酒店',url:'..'},
        {icon:'ion-android-cart',color:'energized',name:'CC',url:'..'}
      ],
      [
        {icon:'ion-ios-partlysunny',color:'assertive',name:'KTV',url:'..'},
        {icon:'ion-ios-film-outline',color:'royal',name:'电影',url:'..'},
        {icon:'ion-android-bicycle',color:'balanced',name:'酒店',url:'..'},
        {icon:'ion-android-cart',color:'energized',name:'CC',url:'..'}
      ]
    ]
  ];

  $scope.goodsList = [];
  //
  var name = ["美食","电影"];
  var nameIndex = 0;
  function getProducts(nameIndex){

          var product = new AV.Query('Goods');
          //商品类型
          var Cid = new AV.Query('Classify');
          Cid.equalTo("classifyName", name[nameIndex]);
          Cid.find().then(function(res){
              product.equalTo("classifyID", res[0].id);
              product.equalTo("status",1);
              product.descending("updatedAt");
              product.limit(4);
              var results = [];
              //查询商品
              product.find().then(function(res2) {
                  for(var i in res2){
                    var oo = res2[i].toJSON();
                    oo.activeName = res[0].toJSON().classifyName;//分类名
                    results.push(oo);
                  };
                  $scope.goodsList.push(results);
                  console.log($scope.goodsList);
                  nameIndex++;
                  if(nameIndex<name.length)
                      getProducts(nameIndex);
                  else
                      $ionicLoading.hide();//loading结束
                      return
              });
          });

  }
  getProducts(nameIndex);
  $scope.doRefresh = function(){
    $ionicLoading.show({
        template: '加载中...'
    });
    $scope.goodsList=[];
    getProducts(nameIndex);
    $scope.$broadcast('scroll.refreshComplete');
  }
  $scope.data = {
    showDelete: false
  };
  
  $scope.edit = function(item) {
    alert('Edit Item: ' + item.id);
  };
  $scope.share = function(item) {
    $ionicPopup.alert({
        title:'分享 '+item.goodsName+' 成功！',
        subTitle: '分享获得 5 个积分!',
        okType:'button-theme',
        okText:'确定'
    });
  };
  
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };
  
  $scope.onItemDelete = function(item,i) {
    
    // if(!$scope.goodsList[i].length){
    //   $scope.show=false;
    // }
    $ionicPopup.confirm({
      title: '警告',
      template: '确定删除 '+item.goodsName+' 吗 ?',
      cancelText: '取消',
      okType:'button-assertive',
      okText:'确定'
     }).then(function(res) {
       if(res) {
         $scope.goodsList[i].splice($scope.goodsList[i].indexOf(item), 1);
       } else {
         console.log('You are not sure');
       }
     });
  };
  
})
.controller('GoodsCtrl', function($scope, Chats, $ionicLoading) {
  $ionicLoading.show({
      template: '加载中...'
  });
  
  var page=0;
  $scope.loadMoreData=function(){
    var query = new AV.Query(AV.User);
    query.limit(8);
    query.ascending("objectid");
    query.skip(8 * page);
    query.find().then(function(users) {
      if(users == ''){
          $scope.moreDataCanBeLoaded = false;
          return;
      }
      for (var user in users){
        $scope.$apply(function(){
          $scope.goods.push(users[user].toJSON());
        })
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
      page++;
    })
  };
  var query = new AV.Query(AV.User);
  query.limit(8);
  query.ascending("objectid");
  query.find().then(function(users) {
    var usersJSON=[];
    for (var user in users){
      usersJSON.push(users[user].toJSON());
    }
    $scope.$apply(function(){
      $scope.goods=usersJSON;
    })
    $ionicLoading.hide();//loading结束
    page++;
    $scope.moreDataCanBeLoaded = true;
  })


  //
  wx.ready(function(){
    // wx.getLocation({
    //   type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    //   success: function (res) {
    //       var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
    //       var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
    //       var speed = res.speed; // 速度，以米/每秒计
    //       var accuracy = res.accuracy; // 位置精度
    //       $scope.$apply(function(){
    //         $scope.point=latitude;
    //       })
          
    //   }
    // });
    wx.hideOptionMenu();
  })
})

.controller('GoodDetailCtrl', function($scope, $stateParams, $ionicLoading) {
  $ionicLoading.show({
      template: '加载中...'
  });
  var Cgood={};
  var goodDetail= new AV.Query('Goods');
  goodDetail.equalTo('objectId',$stateParams.goodId)
  goodDetail.first().then(function(good){
    Cgood=good.toJSON();
    var shop=new AV.Query('Shops');
    shop.equalTo('objectId',good.toJSON().shopID)
    shop.first().then(function(shop){
      Cgood.shopinfo=shop?shop.toJSON():{};
      $scope.$apply(function(){
        $scope.good=Cgood;
      })
    }).catch(function(err){
    alert('商家出错了~')
    })
    console.log(Cgood);
  }).catch(function(err){
    alert('产品详情出错了~')
  }).finally(function(){
      $ionicLoading.hide();//loading结束
  });

})
.controller('OrderCtrl', function($scope, $stateParams, $ionicLoading, $ionicPopup, CURUSER, $state, $rootScope){
  //获取用户
  if(!$rootScope.userInfo){
    $rootScope.noLoginGo();
    return false;
  }
  $ionicLoading.show({
      template: '加载中...'
  });
  $scope.num=1;
  //套餐信息
  var Cgood={};
  var goodDetail= new AV.Query('Goods');
  goodDetail.equalTo('objectId',$stateParams.goodId)
  goodDetail.first().then(function(good){
    Cgood=good.toJSON();
    Cgood.userphone=$rootScope.userInfo.phone;
    $scope.good=Cgood;
    console.log(Cgood);
  }).catch(function(err){
    alert('订单详情出错了~')
  }).finally(function(){
      $ionicLoading.hide();//loading结束
  });
  
  //
  $scope.subOrder=function(num){
    // $scope.user._sessionToken='1231231';
    // localStorage.setItem(CURUSER.obj, angular.toJson($scope.user));
    //查询是否有重复的未支付订单；
    if($rootScope.userInfo.objectId){
      var noPayOrder=new AV.Query('Orders');
      noPayOrder.equalTo('userID',$rootScope.userInfo.objectId)
      noPayOrder.equalTo('goodID',Cgood.objectId);
      noPayOrder.equalTo('status',0);
      noPayOrder.first().then(function(resNoPayOrder){
        if(resNoPayOrder){//发现重复的 更新数量和单价
          var updateOrder= new AV.Query('Orders');
          updateOrder.get(resNoPayOrder.toJSON().objectId, {
              success: function(res) {
                res.set('num', num);
                res.set('amount',(num*Cgood.price).toFixed(2)-0);
                res.save();
                $state.go('tab.pay',{'payId':res.id});
              },
              error: function(object, error) {
                // 失败了.
                console.log(object);
              }
          });
        }
        else{
          //提交订单
          var order= new AV.Object('Orders');
          order.set('userID',$rootScope.userInfo._id)
          order.set('goodID',Cgood.objectId);
          order.set('num',num);
          order.set('amount',(num*Cgood.price).toFixed(2)-0);
          order.set('status',0);
          order.save().then(function(res){
            $state.go('tab.pay',{'payId':res.id});
          },function(err){
            console.log(err.message);
          });
        }
      },function(err){
        console.log(err.message);
      });
      
    }
    else
      console.log('未登录');
  }
})
.controller('PayCtrl', function($scope, $stateParams, $rootScope, $ionicPopup) {
  //获取用户
  if(!$rootScope.userInfo){
    $rootScope.noLoginGo();
    return false;
  }
  var Corder={};
  var order= new AV.Query('Orders');
  order.equalTo('objectId',$stateParams.payId);
  order.first().then(function(pay){
    Corder=pay.toJSON();

    Corder.user=$rootScope.userInfo;
    var good=new AV.Query('Goods');
    good.equalTo('objectId',pay.toJSON().goodID)
    good.first().then(function(good){
      Corder.goodName=good.toJSON().goodsName;
    })
    $scope.$apply(function(){
      $scope.order=Corder;
    });
    console.log(Corder);
  }).catch(function(err){
    alert('订单详情出错了~')
  });

  $scope.payType="1";
  $scope.subPay=function(payType){
    switch(payType){
      case "1":
        if(Corder.amount>Corder.user.balance){
          $ionicPopup.alert({
            title:'余额不足',
            subTitle: '请充值或换其他支付方式',
            okType:'button-energized',
            okText:'确定'
          });
        }
        
        break;
      case "2":
        alert(2)
        break;
      case "3":
        alert(3)
        break;
      default:
        alert(0)
        break;
    }
  }
})
.controller('AccountCtrl', function($scope, $rootScope) {
  $scope.$apply(function(){
    $scope.userinfo=$rootScope.WXuserInfo;
  })
  
})
.controller('PhoneCtrl',  function($scope, $rootScope, $ionicPopup, $timeout, $state, CURUSER, $stateParams){
  //获取用户
  if(!$rootScope.userInfo){
    $rootScope.noLoginGo();
    return false;
  }
  var phoneNumOK='';
  $scope.send=function(phoneNum){
    var checkPhone=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if(!checkPhone.test(phoneNum)|| checkPhone==null){
      $ionicPopup.alert({
        title:'手机号码格式错误！',
        subTitle: '请输入11位手机号码!',
        okType:'button-energized',
        okText:'确定'
      });
    }
    else{
      phoneNumOK=phoneNum;
      AV.Cloud.requestSmsCode(phoneNum).then(function(){
        var stopwatch=60;
        $scope.isSend=true;
        $scope.btnSend=stopwatch+'秒';
        var myTimer=setInterval(function(){
          stopwatch--;
          $scope.btnSend=stopwatch+'秒';
          $scope.$digest();
        }, 1000);
        var timer=$timeout(function(){
          $scope.isSend=false;
          $scope.btnSend='发送验证码';
          clearInterval(myTimer);
          $timeout.cancel(timer);
        },60000);
        var myAlert=$ionicPopup.alert({
          title:'验证码已发送到您的手机！',
          subTitle: '请输入6位数验证码!',
          okType:'button-theme',
          okText:'确定'
        });
        $timeout(function() {
            myAlert.close(); 
         }, 2000);
      }, function(err){
        console.log(err.message);
        var myAlert=$ionicPopup.alert({
          title:err.message,
          subTitle: '请10分钟后再试!',
          okType:'button-theme',
          okText:'确定'
        });
        $timeout(function() {
            myAlert.close(); 
         }, 2000);
      });
    }
  };
  $scope.addPhoneNum=function(checkCode){
    
    if(checkCode && phoneNumOK){
      AV.Cloud.verifySmsCode(checkCode,phoneNumOK).then(function(){
        var myAlert=$ionicPopup.alert({
          title:'验证成功！',
          subTitle: '即将返回上一页!',
          okType:'button-theme',
          okText:'确定'
        });
        $timeout(function() {
          
          $rootScope.userInfo.phone=phoneNumOK;
          var user=new AV.Query(AV.User);//修改电话
          user.get($rootScope.userInfo.objectId, {
              success: function(res) {
                res.set('phone', phoneNumOK);
                res.save();
              },
              error: function(object, error) {
                // 失败了.
                console.log(object);
              }
          });
          myAlert.close();
          localStorage.setItem(CURUSER.obj, angular.toJson($rootScope.userInfo));
          $state.go('tab.order',{'goodId': $stateParams.goodId});//..........................................
        }, 2000);
      }, function(err){
        var myAlert=$ionicPopup.alert({
          title:err.message,
          subTitle: '请输入6位数验证码!',
          okType:'button-energized',
          okText:'确定'
        });
        $timeout(function() {
            myAlert.close(); 
        }, 2000);
      });
    }
    else{
      var myAlert=$ionicPopup.alert({
          title:'验证失败！',
          subTitle: '请输入正确的6位数验证码!',
          okType:'button-energized',
          okText:'确定'
        });
        $timeout(function() {
            myAlert.close(); 
        }, 2000);
    }
  }
})

