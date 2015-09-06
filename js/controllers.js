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
      Cgood.shopinfo=shop.toJSON();
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

.controller('AccountCtrl', function($scope, $rootScope) {
  $scope.$apply(function(){
    $scope.userinfo=$rootScope.userinfo
  })
  
});
