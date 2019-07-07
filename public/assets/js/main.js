let app = angular.module("stock-notes", []);

app.filter("decode", function() {
	return function(x) {
		if (x !== undefined) return x.replace("&amp;", "&");
	};
});

app.controller("company-list-controller", function($scope, $http) {
	getCompanyInPage($scope, $http, "0-9");

	$scope.getCompanies = function($event) {
		let page = $event.target.innerHTML;
		//console.log(page);
		getCompanyInPage($scope, $http, page);
	};
	$scope.openInViewer = function($event) {
		let companyCode = $event.currentTarget.attributes["data-id"].value;
		getCompanyDetails($scope, $http, companyCode);
	};
});

function getCompanyDetails($scope, $http, companyCode) {
	$scope.companyDataLoading = true;
	$http({
		method: "GET",
		url: "company/" + companyCode
	})
		.then(response => {
			$scope.selectedCompany = response.data[0];
			console.log($scope.selectedCompany);
		})
		.catch(err => {
			console.log("Something has gone wrong", err);
		})
		.finally(() => {
			$scope.companyDataLoading = false;
		});
}

function getCompanyInPage($scope, $http, page) {
	$scope.dataLoading = true;
	$http({
		method: "GET",
		url: "companies/" + page
	})
		.then(response => {
			$scope.companies = JSON.parse(JSON.stringify(response.data));
		})
		.catch(err => {
			console.log("Something has gone wrong", err);
		})
		.finally(() => {
			$scope.dataLoading = false;
		});
}
