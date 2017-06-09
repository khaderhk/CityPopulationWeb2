(function () {
    // Private function
    function getColumnsForScaffolding(data) {
        if ((typeof data.length !== "number") || data.length === 0) {
            return [];
        }
        var columns = [];
        for (var propertyName in data[0]) {
            columns.push({ headerText: propertyName, rowText: propertyName });
        }
        return columns;
    }

    ko.simpleGrid = {
        // Defines a view model class you can use to populate a grid
        viewModel: function (configuration) {
            this.ViewModel = configuration.ViewModel || {};
            this.data = configuration.data;
            this.currentPageIndex = ko.observable(0);
            this.pageSize = configuration.pageSize || 5;
            this.hasMultiSelect = configuration.hasMultiSelect;
            this.addEnabled = configuration.addEnabled || false;
            this.addTemplate = configuration.addTemplate || "";
            this.columnTemplate = configuration.columnTemplate || "";
            this.headerMultiselectTemplate = configuration.headerMultiselectTemplate || "";
            // If you don't specify columns configuration, we'll use scaffolding
            this.columns = configuration.columns || getColumnsForScaffolding(ko.unwrap(this.data));

            this.itemsOnCurrentPage = ko.computed(function () {
                var startIndex = this.pageSize * this.currentPageIndex();
                return ko.unwrap(this.data).slice(startIndex, startIndex + this.pageSize);
            }, this);

            this.maxPageIndex = ko.computed(function () {
                return Math.ceil(ko.unwrap(this.data).length / this.pageSize) - 1;
            }, this);

            this.startRange = ko.computed(function () {
                if (this.currentPageIndex() === 0) {
                    return this.currentPageIndex() + 1;
                } else {
                    return (this.currentPageIndex() * this.pageSize) + 1;
                }
            }, this);

            this.endRange = ko.computed(function () {
                if (this.currentPageIndex() === 0) {
                    if (this.pageSize < ko.unwrap(this.data).length) {
                        return this.pageSize;
                    } else {
                        return ko.unwrap(this.data).length;
                    }
                } else if (this.currentPageIndex() === this.maxPageIndex()) {
                    return ko.unwrap(this.data).length;
                } else {
                    return (this.currentPageIndex() + 1) * this.pageSize;
                }
            }, this);
        }
    };

    // Templates used to render the grid
    var templateEngine = new ko.nativeTemplateEngine();

    templateEngine.addTemplate = function (templateName, templateMarkup) {
        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
    };

    templateEngine.addTemplate("ko_simpleGrid_grid", "\
                    <table class=\"table table-bordered\" cellspacing=\"0\">\
                        <thead>\
                            <tr class='grid-header'>\
                               <!-- ko if: hasMultiSelect -->\
                                  <!-- ko template: headerMultiselectTemplate --><!-- /ko -->\
                               <!-- /ko -->\
                               <!-- ko foreach: columns -->\
                               <th data-bind=\"text: headerText\"></th>\
                               <!-- /ko -->\
                            </tr>\
                        </thead>\
                        <tbody>\
                            <!-- ko if: addEnabled -->\
                                <tr>\
                                    <!-- ko if: hasMultiSelect -->\
                                        <td style='text-align: center;width: 50px;'><input type='checkbox' disabled='disabled' /><label></label></td>\
                                    <!-- /ko -->\
                                    <!-- ko template: addTemplate -->\
                                    <!-- /ko -->\
                                </tr>\
                            <!-- /ko -->\
                            <!-- ko foreach: itemsOnCurrentPage -->\
                            <tr>\
                                <!-- ko if: $parent.columnTemplate!=='' -->\
                                    <!-- ko template: $parent.columnTemplate -->\
                                <!-- /ko -->\
                                <!-- /ko -->\
                                <!-- ko if: $parent.columnTemplate==='' -->\
                                    <!-- ko foreach: $parent.columns -->\
                                        <td data-bind=\"text: typeof rowText == 'function' ? rowText($parent) : $parent[rowText] \"></td>\
                                    <!-- /ko -->\
                                <!-- /ko -->\
                            </tr>\
                            <!-- /ko--> \
                        </tbody>\
                    </table>");
    templateEngine.addTemplate("ko_simpleGrid_pageLinks", "\
                    <div class=\"ko-grid-pageLinks\">\
                        <span>Showing <span data-bind='text: startRange'></span>-<span data-bind='text: endRange'></span> of <span data-bind='text: ko.unwrap(data).length'></span> items</span>\
                        <div class='pull-right'><nav><ul class='pager'><li class='active-pager' data-bind='css:{disabled:currentPageIndex() === 0},click: currentPageIndex()=== 0 ? function(){return false;} : function(){currentPageIndex(currentPageIndex()-1)}'><a href='#'  class='glyphicon windows-icon-chevron-left' aria-hidden='true' aria-label='previous'></a></li><li class='active-pager' data-bind='css:{disabled: currentPageIndex()=== maxPageIndex()},click: currentPageIndex()=== maxPageIndex()?function(){return false;}:function(){currentPageIndex(currentPageIndex()+1)}'><a href='#'  class='glyphicon windows-icon-chevron-right' aria-hidden='true' aria-label='next'></a></li></ul></nav></div>\
                    </div>");

    // The "simpleGrid" binding
    ko.bindingHandlers.simpleGrid = {
        init: function () {
            return { 'controlsDescendantBindings': true };
        },
        // This method is called to initialize the node, and will also be called again if you change what the grid is bound to
        update: function (element, viewModelAccessor, allBindings) {
            var viewModel = viewModelAccessor();

            // Empty the element
            while (element.firstChild)
                ko.removeNode(element.firstChild);

            // Allow the default templates to be overridden
            var gridTemplateName = allBindings.get("simpleGridTemplate") || "ko_simpleGrid_grid",
                pageLinksTemplateName = allBindings.get("simpleGridPagerTemplate") || "ko_simpleGrid_pageLinks";

            // Render the main grid
            var gridContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");

            // Render the page links
            var pageLinksContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(pageLinksTemplateName, viewModel, { templateEngine: templateEngine }, pageLinksContainer, "replaceNode");
        }
    };
})();
