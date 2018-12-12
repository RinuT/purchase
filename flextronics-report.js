'use strict';

var app=angular.module('myApp.flextronics-report', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/flextronics-report', {
    templateUrl: 'flextronics-report/flextronics-report.html',
    controller: 'flextronics-reportCtrl'
  });
}])
app.controller('flextronics-reportCtrl', ['$scope','myservice','$http','$timeout',function ($scope,myservice,$http,$timeout) {
  $scope.poData={}
  $scope.poData.poNumber=" "
  $scope.poData.POQty=" "
  $scope.poData.shipped=" "
  $scope.poData.received=" "
  $scope.poData.consumed=" "
  $scope.poData.balance=" "
  $scope.poData.paymentDue=" "
  $scope.poData.status=" "
  $scope.poData.overDue=" "
$scope.PODataPending=[]
$scope.loading=false
$scope.id=""
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
$scope.submit=function(){
  $scope.loading=true
  $http.get("https://p2p-process-network.mybluemix.net/api/Material/"+$scope.materialCode)
  .then(function(response) {
    var datetime = new Date();
    var date1 = new Date(datetime);
     $scope.res = response.data;
     for(var n=0;n<$scope.res.purchaseorder.length;n++){
      $scope.poData.poNumber=$scope.res.purchaseorder[n].poNumber
      $scope.poData.POQty=$scope.res.purchaseorder[n].purchaseorder.orderQuantity
      $scope.poData.shipped=" "
      $scope.poData.received=" "
      $scope.poData.consumed=" "
      $scope.poData.balance=$scope.res.purchaseorder[n].purchaseorder.availableQuantity
      $scope.poData.paymentDue=" "
      $scope.poData.status=" "
      $scope.poData.overDue=" "
      $scope.PODataPending.push($scope.poData)
      $scope.poData={}
       for(var j=0;j<$scope.res.purchaseorder[n].purchaseorder.batch.length;j++){
        $scope.poData.shipped=$scope.res.purchaseorder[n].purchaseorder.batch[j].batch.shippedQuantity
        $scope.poData.received=$scope.res.purchaseorder[n].purchaseorder.batch[j].batch.shippedQuantity
        $scope.poData.consumed=" "
        $scope.poData.balance=" "
        $scope.poData.paymentDue=" "
        $scope.poData.status=" "
        var date2 = new Date($scope.res.purchaseorder[n].purchaseorder.batch[j].batch.receiptDate)
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600* 24)); 
        if($scope.res.purchaseorder[n].purchaseorder.batch[j].batch.availableQuantity>0 & diffDays>90){
          $scope.poData.overDue=$scope.res.purchaseorder[n].purchaseorder.batch[j].batch.availableQuantity
        }
        else 
        $scope.poData.overDue=" "

       
      $scope.PODataPending.push($scope.poData)
      $scope.poData={}
      for(var k=0;k<$scope.res.purchaseorder[n].purchaseorder.batch[j].batch.invoice.length;k++){
        $scope.poData.shipped=""
        $scope.poData.received=""
        $scope.poData.consumed=$scope.res.purchaseorder[n].purchaseorder.batch[j].batch.invoice[k].consumptionQuantity
        $scope.poData.balance=""
        $scope.poData.status=$scope.res.purchaseorder[n].purchaseorder.batch[j].batch.invoice[k].invoiceStatus
        $scope.poData.overDue=" "
      $scope.PODataPending.push($scope.poData)
      $scope.poData={}
      
      
       }
      
       }
     }
     
     $scope.search=true      
    $scope.loading=false
    $scope.fialuier=false
      
  }, function errorCallback(response){
   console.log("POST-ing of data failed");
   $scope.loading=false
   $scope.fialuier=true
   $scope.search=false
});
}

  

 }]);

 

    
app.service('myservice', function() {
  this.xxx = "yyy";
});