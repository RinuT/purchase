'use strict';

angular.module('myApp.schneider_consumption', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/schneider_consumption', {
    templateUrl: 'schneider_consumption/schneider_consumption.html',
    controller:'schneider_consumptionCtrl'
  });
}])

.controller('schneider_consumptionCtrl', ['$scope','$http','$timeout',function ($scope,$http,$timeout) {
  $scope.navigate=function(url){
    window.location.reload();
    window.location = url;

  }
  $scope.refreshPage=function(){
    window.location.reload();
}
    var acc = document.getElementsByClassName("accordion");
    var i;
    $scope.fialuier=false
    $scope.sucess=false
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
     $scope.submit = function(){
       if($scope.materialCode==undefined||$scope.dateOfConsumption==undefined||$scope.POQty==undefined){
         return false
       }else{
       $scope.loading=true;
       $scope.setValue();
       }
     }
     $scope.setValue=function() {
       var dateOfConsumption = new Date();
       dateOfConsumption=$scope.dateOfConsumption
       var request=
                                
                                {
            "$class": "com.cts.ipm.p2pNetwork.RecordConsumption",
            "recordId": "c",
            "consumptionrecord": {
              "$class": "com.cts.ipm.p2pNetwork.newConsumptionRecord",
              "poNumber": "",
              "lineNum": "",
              "materialCode": $scope.materialCode,
              "quantity": "",
              "UOP": "",
              "materialDoceDate":dateOfConsumption.toString(),
              "consumptionQuantity": $scope.POQty,
              "invDocNum": ""
            },  "report": {
              "$class": "com.cts.ipm.p2pNetwork.newReport",
              "transactionType": "",
              "date": "",
              "quantity": "",
              "poNumber": "",
              "materialCode": ""
            }
          }
          
                  

         var requestInfo = Request();
       
         data : requestInfo
     
       var res = $http.post('http://p2p-process-network.mybluemix.net/api/RecordConsumption',request).then(function successCallback(response){
              // alert("Successfully placed order");
               $scope.update_response=response;
               $scope.sucess=true
               $scope.fialuier=false
               $scope.transactionId=$scope.update_response.data.transactionId
               $scope.loading=false;
           }, function errorCallback(response){
             $scope.fialuier=true
             $scope.sucess=false
             $scope.loading=false;
           });
     }
    
     function Request() {
     
       return {
         "Request" : 
                    {
          "$class": "com.cts.ipm.p2pNetwork.RecordConsumption",
          "recordId": "",
          "consumptionrecord": {
            "$class": "com.cts.ipm.p2pNetwork.newConsumptionRecord",
            "poNumber": "",
            "lineNum": "",
            "materialCode": "",
            "quantity": "",
            "UOP": "",
            "materialDoceDate": "",
            "consumptionQuantity": "",
            "invDocNum": ""
          } , "report": {
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