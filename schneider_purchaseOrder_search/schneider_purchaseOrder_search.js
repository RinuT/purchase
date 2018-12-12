'use strict';

angular.module('myApp.schneider_purchaseOrder_search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/schneider_purchaseOrder_search', {
    templateUrl: 'schneider_purchaseOrder_search/schneider_purchaseOrder_search.html',
    controller:'schneider_purchaseOrder_searchCtrl'
  });
}])

.controller('schneider_purchaseOrder_searchCtrl', ['$scope','$http','$timeout',function ($scope,$http,$timeout) {
  $scope.search=false
  $scope.BatchId=""
  $scope.PONumber=""
  $scope.LineNo=" "
  $scope.price=" "
  $scope.SEmaterialCode=" "
  $scope.POQty=" "
  $scope.UOP=" "
  $scope.DeliveryDate=" "
 $scope.Currency=" "
 $scope.deliveryNoteNo=" "
 $scope.shippmentDate=" "
 $scope.shippedQty=" "
 $scope.fialuier=false
 $scope.search=false
 var acc = document.getElementsByClassName("accordion");
 var i;
 $scope.CreationDate = new Date();
 for (i = 0; i < acc.length; i++) {
   acc[i].addEventListener("click", function() {
     this.classList.toggle("active");
     var panel = this.nextElementSibling;
     if (panel.style.maxHeight){
       panel.style.maxHeight = null;
     } else {
       panel.style.maxHeight = panel.scrollHeight + "px";
     } 
   });
 }
 $scope.navigate=function(url){
  window.location.reload();
  window.location = url;

}
$scope.refreshPage=function(){
  window.location.reload();
}
 $scope.submit = function(){
  if($scope.PONumber==undefined){
    return false
  }
  else
 {
  $http.get("http://p2p-process-network.mybluemix.net/api/purchaseorder/"+$scope.PONumber)
  .then(function(response) {
    $scope.search=true
          $scope.res = response.data;
          $scope.PONumber=$scope.res.poNumber
          $scope.LineNo=$scope.res.purchaseorder.lineNumber
          $scope.price=$scope.res.purchaseorder.price
          $scope.SEmaterialCode=$scope.res.purchaseorder.materialCode
          $scope.POQty=$scope.res.purchaseorder.orderQuantity
          $scope.totalreceived=$scope.res.purchaseorder.receivedQuantity
          $scope.requirment=$scope.res.purchaseorder.requiredQuantity
          $scope.UOP=$scope.res.purchaseorder.uop
          $scope.POCreationDate=$scope.res.purchaseorder.creationDate
          $scope.DeliveryDate=$scope.res.purchaseorder.deliveryDate
          $scope.dateC = new Date($scope.POCreationDate); 
          $scope.dateD = new Date($scope.DeliveryDate);
          $scope.Currency=$scope.res.purchaseorder.currency
          $scope.Supplier="Supplier 1"
          $scope.loading=false
          $scope.fialuier=false
       
      
  }, function errorCallback(response){
    console.log("POST-ing of data failed");
    $scope.loading=false
    $scope.fialuier=true
});
 }
 }
 
 }]);