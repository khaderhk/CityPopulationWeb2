var main = {};
(function (ko, $) {
    var showTopModal = function (targetId) {
        $(".modal").modal("hide");
        $(".modal").children(".modal-overlay").toggleClass("in");
        $("#" + targetId).modal("show");
        $("#" + targetId).css("top", "0");
        if ($(document).height() - 1 > $(window).height()) {
            $("#pageWraper").css("margin-right", "17px");
        }
    };
    var cityDataModel = function () {
        this._id = 0;
        this.pop = 0;
        this.loc = [0,0];
        this.state = "";
        this.city = "";
    };

    var getFullCityData = function () {
        var data;
        $.ajax({
            url: "http://localhost:4180/api/CityData/Get",
            type: "GET",
            async: false,
            contentType: 'application/json',
            dataType: "json",
            success: function (citydata) {
                data = citydata;
            }
        });
        return data;
    };

    main.cityDataViewModel = function (cityInfo) {
        var self = this;
        self.cities = ko.observableArray(cityInfo);
        self._id = ko.observable();
        self.pop = ko.observable();
        self.state = ko.observable();
        self.city = ko.observable();
        self.loc = ko.observable([]);

        self.addEnabled = ko.observable(false);
        self.cityDataModel = new cityDataModel();
        self.srCounter = ko.observable(4);

        self.ViewCity = function (data, e) {
            if (data !== undefined || e !== undefined) {
                e.stopPropagation();
                self._id(data._id);
                self.pop(data.pop);
                self.state(data.state);
                self.city(data.city);
                self.loc(data.loc);
                showTopModal("cityModal");
            }
        };

        self.UpdateCity = function (data, e) {
            var payload = "{\"city\":\"" + data.city() +"\",\"loc\":[" + data.loc() +"],\"pop\":" + data.pop()+",\"state\":\""+data.state()+"\",\"_id\":"+data._id()+"}";
            $.ajax({
                url: "http://localhost:4180/api/CityData/UpdatePopulation",
                type: "POST",
                data: payload,
                async: false,
                contentType: "application/json",
                success: function (success) {
                    if (!success)
                        alert('Error occured while updating City details for ' + data.city());
                    location.reload();
                }                
            });
        }

        self.Cancel = function () {
            $(".modal-overlay").click();
        }

    };

    main.ViewModel = function (cityModel) {
        var self = this;
        self.cityModel = cityModel;
        self.searchString = ko.observable("");

        self.filteredCityData = ko.computed(function () {
            return cityModel.cities().filter(function (i) {
                return i.city.toLowerCase().indexOf(self.searchString()) >= 0;
            });
        });
        self.searchCity = function () {
            self.searchString($("#searchString").val());
        };

        self.pagingGrid = new ko.simpleGrid.viewModel({
            data: self.filteredCityData,
            pageSize: 10,
            columnTemplate: "gridWithColumnTemplate",
            columns: [{ headerText: "City", rowText: "" }, { headerText: "State", rowText: "" }, { headerText: "Zip", rowText: "" }, { headerText: "Population", rowText: "" }],
            ViewModel: cityModel
        });
        
    };

    var mainContainer = $("#main")[0];
    ko.applyBindings(new main.ViewModel(new main.cityDataViewModel(getFullCityData())), mainContainer);

})(ko, jQuery);

$(".modal-overlay").click(function () {
    $(".modal").modal("hide");
    $("#cityModal").css("top", "-100px");
    $(".modal").children(".modal-overlay").toggleClass("in");
    $("#pageWraper").css("margin-right", "0");
});