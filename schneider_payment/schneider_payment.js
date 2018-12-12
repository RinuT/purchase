'use strict';

var app=angular.module('myApp.schneider_payment', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/schneider_payment', {
    templateUrl: 'schneider_payment/schneider_payment.html',
    controller: 'schneider_paymentCtrl'
  })
  .when('/schneider_payment_success', {
    templateUrl: 'schneider_payment_success/schneider_payment_success.html',
    controller: 'sschneider_payment_successCtrl'
  });
}])
app.controller('schneider_paymentCtrl', ['$scope','myservice','$http','$timeout',function ($scope,myservice,$http,$timeout) {
  $scope.poData={}
  $scope.poData.poNumber=" "
  $scope.poData.materialCode=" "
  $scope.poData.batchId=" "
  $scope.poData.invoiceDoc=" "
  $scope.poData.quantity=" "
  $scope.poData.amount=" "
  $scope.poData.invoiceStatus=""
  $scope.PODataPending=[]
  $scope.PODataPaid=[];
  $scope.PODataGenerated=[];
  $scope.display=false
  
  $scope.navigate=function(url){
    window.location.reload();
    window.location = url;

  }
  $scope.refreshPage=function(){
    window.location.reload();
}
  $scope.loading=true
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
 
  function doSocketMessage(evt) {
    
 let data =JSON.parse(evt.data);
 
    
    }

  $scope.onload=function(){
   

        $http.get("http://p2p-process-network.mybluemix.net/api/SelfInvoice")
  .then(function(response) {
      $scope.res = response.data;
      for( var n=0;n<$scope.res.length;n++){
        
        $scope.poData['poNumber']=$scope.res[n].poNumber
        $scope.poData['materialCode']=$scope.res[n].materialCode
        $scope.poData['invoiceDoc']=$scope.res[n].invDocNum
        $scope.poData['quantity']=$scope.res[n].consumptionQuantity
        $scope.poData['amount']=$scope.res[n].amount
        $scope.poData['poStatus']=$scope.res[n].invoiceStatus
        $scope.poData['batchId']=$scope.res[n].batch.batchCode
         console.log($scope.poData)
      if( $scope.res[n].invoiceStatus =="Payment Pending" ){
  
      $scope.PODataPending.push($scope.poData) 
      $scope.Pending=true
     
  
     }
      $scope.loading=false
      $scope.poData={}
      
      }
      
      if($scope.PODataPending.length==0)
      {
        $scope.display=true
      }
      else
      $scope.display=false
      
  }, function errorCallback(response){
    console.log("POST-ing of data failed");
    $scope.loading=false
    $scope.display=true
});
          }
         $scope.generateInvoice=function(id){
           $scope.loading=true
          myservice.xxx=id
         }
   }]);

   app.controller('sschneider_payment_successCtrl', ['$scope','myservice','$http','$timeout',function ($scope,myservice,$http,$timeout) {$scope.POData=[];
     
    $scope.navigate=function(url){
      window.location.reload();
      window.location = url;
  
    }
    $scope.refreshPage=function(){
      window.location.reload();
  }
    $scope.materialCode=" "
    $scope.batchId=" "
    $scope.poNumber=" "
    $scope.invoiceId=" "
    $scope.quantity=" "
    $scope.perUnitPrice=" "
    $scope.fialuier1=false
    $scope.loading=true
    $scope.sucess1=false

    $scope.onloadS=function(){
      
     
       
      $http.get("http://p2p-process-network.mybluemix.net/api/SelfInvoice/"+myservice.xxx)
      .then(function(response) {
          $scope.res =  response.data;
          $scope.materialCode= $scope.res.materialCode
   $scope.batchId= $scope.res.batch.batchCode
   $scope.poNumber= $scope.res.poNumber
   $scope.invoiceId= $scope.res.invDocNum
   $scope.quantity= $scope.res.consumptionQuantity
   $scope.perUnitPrice= $scope.res.amount
  
    $scope.loading=false
          
      }, function errorCallback(response){
        console.log("POST-ing of data failed");
        $scope.loading=false
    });
       
         
    }
    $scope.generate = function(){
      $scope.loading=true
     $scope.setValueInvoice();
     }
     $scope.setValueInvoice=function() {
       var requestInvoice=
       {
        "$class": "com.cts.ipm.p2pNetwork.InvoiceStatus",
        "invDocNum":  $scope.invoiceId,
        "invoiceStatus": "Paid",
        "report": {
          "$class": "com.cts.ipm.p2pNetwork.newReport",
          "transactionType": "",
          "date": "",
          "quantity": "",
          "poNumber": "",
          "materialCode": ""
        }
      }
      
        
  
         var requestInfo = RequestInvoice();
       
         data : requestInfo
     
       var res = $http.post('http://p2p-process-network.mybluemix.net/api/InvoiceStatus',requestInvoice).then(function successCallback(response){
            //   alert("Successfully placed order");
               $scope.update_response=response;
               $scope.loading=false
               $scope.sucess1=true
               $scope.transactionId=$scope.update_response.data.transactionId
               $scope.fialuier1=false
           }, function errorCallback(response){
             $scope.fialuier1=true
             $scope.loading=false
             $scope.sucess1=false
           });
     }
   
     function RequestInvoice() {
     
       return {
         "Request" : {
          "$class": "com.cts.ipm.p2pNetwork.InvoiceStatus",
          "invDocNum": " ",
          "invoiceStatus": "Paid",
          "report": {
            "$class": "com.cts.ipm.p2pNetwork.newReport",
            "transactionType": "",
            "date": "",
            "quantity": "",
            "poNumber": "",
            "materialCode": ""
          }
        }
        
         }
       };
  
   
     }]);
  
        
    app.service('myservice', function() {
      this.xxx = "yyy";
    });
