/**
 * Timeline Gorilla - jQueru Timeline Plugin
 * @version 1.0
 * @author Vusal Orujov
 */


(function($) {
    "use strict";


    /**
     * Timeline Gorilla - Main class
     * @param  {DOM Element} domelement The DOM Element where plugin is applied
     * @param  {Object} options Options passed to the plugin
     */
    $.timelineGorilla = function(element, options) {

        // plugin's default options
        // this is private property and is  accessible only from inside the plugin
        var defaults = {
            htmlItems: "prepend", // prepend|append|false
            labelSelector: ">span",
            contentSelector: ">div",

            orientation: "vertical",
            startPosition: "left",

            mobileBreakpoint: 768,

            items: [
            ],

            
            onBeforeInit: function() {},
            onAfterInit: function() {},

            onBeforeAddItems: function() {},
            onAfterAddItems: function() {},

            onDestroy: function(){}
        };

        var item_defaults = {
            type: "small", // milestone|small|big
            label: "",
            content: "",
            position: "auto" // auto|left|right|top|bottom 
        };

        // reference to the current instance of the object
        var plugin = this;

        // this will hold the merged default, and user-provided options
        plugin.settings = {};

        var $element = $(element); // reference to the jQuery version of DOM element
        var original_html = $element.html();


        /**
         * Validate settins 
         * @return {bool} s
         */
        plugin._validateSettings = function()
        {
            var valid = true;

            if (typeof plugin.settings.labelSelector !== "string") {
                console.log("labelSelector must be string");
                valid = false;
            }

            if (typeof plugin.settings.contentSelector !== "string") {
                console.log("contentSelector must be string");
                valid = false;
            }

            return valid;
        };



        /**
         * Parse HTML items
         * @return {plugin} 
         */
        plugin._parseHtmlItems = function()
        {
            var html_items = [];
            if (plugin.settings.htmlItems == "prepend" || 
                plugin.settings.htmlItems == "append") 
            {
                for (var i = 0; i < $element.find(">div").length; i++) {
                    var _this = $element.find(">div").eq(i);
                    var label = _this.find(plugin.settings.labelSelector);
                    var content = _this.find(plugin.settings.contentSelector);

                    var item = $.extend({}, item_defaults, {
                        label: label,
                        content: content,
                    }, _this.data());
                    
                    html_items.push(item);
                }

                if (plugin.settings.htmlItems == "prepend") {
                    plugin.settings.items = html_items.concat(plugin.settings.items);
                } else {
                    plugin.settings.items = plugin.settings.items.concat(html_items);
                }
            }

            return plugin;
        };




        // the "constructor" method that gets called when the object is created
        plugin._init = function() {
            // the plugin's final properties are the merged default and 
            // user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options, $element.data());

            plugin.settings.onBeforeInit();

            if (plugin._validateSettings()) {
                plugin._parseHtmlItems();
                
                $element.addClass('timeline-gorilla');
                $element.html("");

                // Track
                var $track = $("<div />");
                $element.append($track);
                $track.addClass('tg-track');

                var items = plugin.settings.items;
                plugin.settings.items = [];
                plugin.addItems(items, "end");

                plugin._mobileBreakpoints();
                plugin.settings.onAfterInit();
            }
        };


        /**
         * Set item orientations
         * @return {self} 
         */
        plugin._itemOrientations = function()
        {
            var $items = $element.find(".tg-item");
            $items.removeClass('tg-left tg-right tg-top tg-bottom');
          
            var current_position;


            if (plugin.settings.orientation == "vertical") {
                current_position = "left";
                if (plugin.settings.startPosition == "right") {
                    current_position = "right";
                }
            } else if (plugin.settings.orientation == "horizontal") {
                current_position = "top";
                if (plugin.settings.startPosition == "bottom") {
                    current_position = "bottom";
                }
            }


            for (var i = 0; i < plugin.settings.items.length; i++) {
                var item = plugin.settings.items[i];

                if (item.type == "small" || item.type == "big") {
                    if (item.position == "left" || item.position == "right") {
                        current_position = item.position;
                    }

                    if (item.type == "small") {
                        $items.eq(i).addClass('tg-'+current_position);
                    }


                    if (plugin.settings.orientation == "vertical") {
                        if (item.position == "left") {
                            current_position = "right";
                        } else if (item.position == "right") {
                            current_position = "left";
                        } else {
                            if (current_position == "left") {
                                current_position = "right";
                            } else {
                                current_position = "left";
                            }
                        }
                    } else if (plugin.settings.orientation == "horizontal") {
                        if (item.position == "left") {
                            current_position = "right";
                        } else if (item.position == "right") {
                            current_position = "left";
                        } else {
                            if (current_position == "left") {
                                current_position = "right";
                            } else {
                                current_position = "left";
                            }
                        }
                    }
                }
            }

            return plugin;
        };


        /**
         * Add items to the plugin at position
         * @param {Array} items    An array of items
         * @param {String|Integer} position 
         */
        plugin.addItems = function(items, index) 
        {   
            index = typeof index !== 'undefined' ? index : "end";
            plugin.settings.onBeforeAddItems(items, index);

            // Extend items settings
            for (var i = 0; i < items.length; i++) {
                items[i] = $.extend({}, item_defaults, items[i]);
            }

            // Identify index
            if (index == "start") {
                index = 0;
            } else if (index == "end") {
                index = $element.find(".tg-item").length;
                if (index < 0) {
                    index = 0;
                }
            } else if (typeof index == "number" && index == parseInt(index, 10)) {
                index = parseInt(index, 10);
            }


            var current_index = index;
            for (var j = 0; j < items.length; j++) {
                var item = items[j];

                var $item = $("<div />");

                $item.addClass('tg-item');

                $item.append("<span class='tg-label'></span>");
                $item.find(".tg-label").append(item.label);

                switch (item.type) {
                    case "milestone":
                        $item.addClass('tg-milestone');
                        break;

                    case "small":
                        $item.addClass('tg-small');
                        $item.append("<div class='tg-content'></div>");
                        $item.find(".tg-content").append(item.content);
                        break;

                    case "big":
                        $item.addClass('tg-big');
                        $item.append("<div class='tg-content'></div>");
                        $item.find(".tg-content").append(item.content);
                        break;
                }

                if ($element.find(".tg-item").eq(current_index).length == 1) {
                    $element.find(".tg-item").eq(current_index).before($item);
                } else {
                    $element.append($item);
                }
                plugin.settings.items.splice(current_index, 0, item);
                current_index++;
            }

            plugin._itemOrientations();
            plugin.settings.onAfterAddItems();
            return plugin;
        };


        /**
         * Mobile Breakspoints
         * @return {self} 
         */
        plugin._mobileBreakpoints = function()
        {
            function _do() {
                if ($(window).width() <= plugin.settings.mobileBreakpoint) {
                    $element.addClass('tg-mobile');
                } else {
                    $element.removeClass('tg-mobile');
                }
            }

            $(window).on("resize", function() {
                _do();
            });

             _do();


            return plugin;
        };



        plugin.destroy = function()
        {
            $element.removeClass('timeline-gorilla');
            $element.html(original_html);
            $element.removeData('timelineGorilla');

            plugin.settings.onDestroy();
        };

        // fire up the plugin!
        // call the "constructor" method
        plugin._init();
    };


    // add the plugin to the jQuery.fn object
    $.fn.timelineGorilla = function(options) {
        var args = arguments;

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
            if (options === undefined || typeof options === "object") {
                // if plugin has not already been attached to the element
                if (undefined === $(this).data('timelineGorilla')) {

                    // create a new instance of the plugin
                    // pass the DOM element and the user-provided options as arguments
                    var plugin = new $.timelineGorilla(this, options);

                    // in the jQuery version of the element
                    // store a reference to the plugin object
                    $(this).data('timelineGorilla', plugin);
                }
            } else if (typeof options == "string" && options.charAt(0) !== '_') {
                var instance = $(this).data("timelineGorilla");

                if (instance instanceof $.timelineGorilla && typeof instance[options] ===  "function") {
                    instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
            }
        });
    };
})(jQuery);