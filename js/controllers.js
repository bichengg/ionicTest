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

  $scope.goodsList = [];
  //
  var name = ["grtj","grrm","jfsp","grhl"];
  var nameIndex = 0;
  function getProducts(nameIndex){

          var product = new AV.Query('Product');
          //商品类型
          var Cid = new AV.Query('Classify');
          Cid.equalTo("gjz", name[nameIndex]);
          Cid.find().then(function(res){
              product.equalTo("cid",  parseInt(res[0].id));
              product.equalTo("status", 1);
              product.descending("updatedAt");
              product.limit(4);
              var results = [];
              //查询商品
              product.find().then(function(res2) {
                  angular.forEach(res2, function (result, index) {
                      var oo = result.toJSON();
                      oo.picurlarray = angular.fromJson(oo.picurlarray);
                      oo.activeName = res[0].toJSON().title;//分类名
                      oo.activeNameEN = res[0].toJSON().gjz;
                      for(var key in oo.spec){
                          $scope.$apply(function() {
                              oo.product = oo.spec[key];
                              results.push(oo);
                          });
                          break;
                      }
                  });
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
        title:'分享 '+item.name+' 成功！',
        subTitle: '分享获得 5 个积分!',
        okType:'button-balanced',
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
      template: '确定删除 '+item.name+' 吗 ?',
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
.controller('ChatsCtrl', function($scope, Chats, $ionicLoading) {
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
          $scope.chats.push(users[user].toJSON());
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
      $scope.chats=usersJSON;
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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
