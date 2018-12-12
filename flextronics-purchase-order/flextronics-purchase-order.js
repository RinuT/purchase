'use strict';

var app=angular.module('myApp.flextronics-purchase-order', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/flextronics-purchase-order', {
    templateUrl: 'flextronics-purchase-order/flextronics-purchase-order.html',
    controller: 'flextronics-purchase-orderCtrl'
  })
  .when('/flextronics-purchase-order-success', {
    templateUrl: 'flextronics-purchase-order-success/flextronics-purchase-order-success.html',
    controller: 'flextronics-purchase-orderCtrl-success'
  });
}])

app.controller('flextronics-purchase-orderCtrl', ['$scope','myservice','$http','$timeout',function ($scope,myservice,$http,$timeout) {
          
  $scope.refreshPage=function(){
    window.location.reload();
}
          $scope.PODataClosed=[];
          $scope.PODataOpen=[];
          $scope.poData={}
          $scope.poData.poNumber=""
          $scope.poData.poDate=""
          $scope.poData.poStatus=""
          $scope.poData.val=0;
          $scope.search=false
          $scope.loading=true
          $scope.failuer=false
       
          $scope.onload=function(){
    
             
           $http.get("http://p2p-process-network.mybluemix.net/api/purchaseorder")
  .then(function(response) {
      $scope.res = response.data;
      for( var n=0;n<$scope.res.length;n++){
        $scope.poData['poNumber'] = $scope.res[n].poNumber
        $scope.poData['poDate'] = $scope.res[n].purchaseorder.creationDate
        $scope.poData['poStatus'] = $scope.res[n].purchaseorder.orderStatus
        
        if($scope.poData.poStatus=="Closed"){
          $scope.poData['val'] = 1;
          $scope.PODataClosed.push($scope.poData)
          $scope.poData={}
        }
        else{
        $scope.poData['val'] = 0;
        $scope.PODataOpen.push($scope.poData)
        $scope.poData={}
        }
      
        console.log($scope.PODataClosed)
        console.log($scope.PODataOpen)
      //  console.log($scope.POData.length)
       
        $scope.loading=false
        $scope.failuer=false
       
      }
      
  }, function(response) {
    $scope.failuer=true
    $scope.content = "Something went wrong";
    $scope.loading=false
});
             
        
          }
          
        

          $scope.submit=function(id){
            
            myservice.xxx=id
          }
          
           }]);
   app.controller('flextronics-purchase-orderCtrl-success' ,['$scope','myservice','$http','$timeout',function ($scope,myservice,$http,$timeout) {
    $scope.PONumber=" "
    $scope.LineNo=" "
    $scope.price=" "
    $scope.SEmaterialCode=" "
    $scope.POQty=" "
    $scope.totalreceived=" "
    $scope.requirment=" "
    $scope.UOP=" "
    $scope.POCreationDate=" "
    $scope.DeliveryDate=" "
   $scope.Currency=" "
   $scope.failuer1=false
    $scope.failuer2=false
    $scope.loading=true
    $scope.first=true
    $scope.show=false
    $scope.refreshPage=function(){
      window.location.reload();
  }  
         
         
                      
           $http.get("http://p2p-process-network.mybluemix.net/api/purchaseorder/"+myservice.xxx)
  .then(function(response) {
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
          $scope.loading=false
          $scope.failuer1=false
          if($scope.totalreceived==$scope.POQty)
          {
            $scope.show=false
          }
          else
          $scope.show=true
      
  }, function(response) {
    $scope.failuer1=true
    $scope.content = "Something went wrong";
    $scope.loading=false
});
        
          
     $scope.proceed=function(){
         //$scope.search=true
         if($scope.requiredQuantity<$scope.shipmentQuantity){
           alert("shipped Quantity more than required quantity")
         }
         else if($scope.shipmentQuantity==undefined ||$scope.ShipmentDate==undefined ||$scope.BatchId==undefined ){
          return false;
         }
         $scope.setProceed()

     }
     $scope.setProceed=function() {
     
       var shipmentDate = new Date();
       shipmentDate=$scope.ShipmentDate
      var CreationDate = new Date();
      CreationDate=$scope.dateC
      $scope.loading=true
     
       var request=
                       {
             "$class": "com.cts.ipm.p2pNetwork.ShipmentNotification",
             "batchId": $scope.BatchId,
             "deliverynote": {
               "$class": "com.cts.ipm.p2pNetwork.delNote",
               "poNumber": $scope.PONumber,
               "lineNumber": "",
               "materialCode": $scope.SEmaterialCode,
               "UOP": "",
               "shipmentDate": shipmentDate.toString(),
               "shipmentQuantity": " ",           
               "supplierId": "Supplier 1"
             },
             "batch": {
               "$class": "com.cts.ipm.p2pNetwork.batch",
               "shipmentDate": shipmentDate.toString(),
               "receiptDate": "",
               "shippedQuantity": $scope.shipmentQuantity,
               "recievedQuantity": "0",
               "availableQuantity": "0",
               "batchStatus": "",
              "poNumber": "",
              "materialCode": "",
              "invoice": []
             },
             "report": {
               "$class": "com.cts.ipm.p2pNetwork.newReport",
               "transactionType": "",
               "date": "",
               "quantity": "",
               "poNumber": "",
               "materialCode": ""
             }
           }
          var requestInfo = RequestProceed();
        
          data : requestInfo
      
        var res = $http.post('http://p2p-process-network.mybluemix.net/api/ShipmentNotification',request).then(function successCallback(response){
                $scope.update_response=response;
                $scope.transactionId=$scope.update_response.data.transactionId
                $scope.sucess=true
                $scope.loading=false
                $scope.failuer2=false
                
            }, function errorCallback(response){
             $scope.failuer2=true
             $scope.sucess=false
             $scope.loading=false
            });
      
       
      }
      

   function RequestProceed() {
      
      return {
           
       "Request" :

         {
          "$class": "com.cts.ipm.p2pNetwork.ShipmentNotification",
          "batchId": "",
          "deliverynote": {
            "$class": "com.cts.ipm.p2pNetwork.delNote",
            "poNumber": "",
            "lineNumber": "",
            "materialCode": "",
            "UOP": "",
            "shipmentDate": "",
            "shipmentQuantity": "",        
            "supplierId": ""
          },
          "batch": {
            "$class": "com.cts.ipm.p2pNetwork.batch",
            "shipmentDate": "",
            "receiptDate": "",
            "shippedQuantity": "",
            "recievedQuantity": "",
            "availableQuantity": "",
            "batchStatus": "",
            "poNumber": "",
            "materialCode": "",
            "invoice": []
          },
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
