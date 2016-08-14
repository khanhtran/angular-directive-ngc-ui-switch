/**
 * $PROJECT_NAME$
 * $PROJECT_HOMEPAGE$
 *
 * @version $PROJECT_VERSION$
 * @license $PROJECT_LICENSE$
 */

(function(angular, undefined){
    'use strict';

    /**
     * @constant
     * @type {!string}
     */
    var MODULE_NAME = 'ngc.ui.switch';

    /**
     * @constant
     * @type {!string}
     */
    var DIRECTIVE_NAME = 'ngc-ui-switch';

    /**
     * @constant
     * @type {!string}
     */
    var DIRECTIVE_NORMALIZED_NAME = 'ngcUiSwitch';

    /**
     * @constant
     * @type {!string}
     */
    var CLASS_BASE = DIRECTIVE_NAME + '-base';

    /**
     * @constant
     * @type {!string}
     */
    var CLASS_ON = DIRECTIVE_NAME + '-on';

    /**
     * @constant
     * @type {!string}
     */
    var CLASS_OFF = DIRECTIVE_NAME + '-off';

    /**
     * @constant
     * @type {!string}
     */
    var CLASS_DISABLED = DIRECTIVE_NAME + '-disabled';

    function noop(){}

    var module = angular.module(MODULE_NAME, []),
        jqLite = angular.element;

    //region Directive: Switch
    //---------------------------------------------------------------------------------------------
    module.directive(DIRECTIVE_NORMALIZED_NAME, switchDirectiveFactory);

    switchDirectiveFactory.$inject = ['$parse', '$compile'];

    function switchDirectiveFactory($parse, $compile) {

        // TODO explain what, when and why
        var switchActions = {
            toggle: {attribute: 'ng-click', directive: 'ngClick', expression: '$__ngcUiSwitchToggle($event)'},
            on: {attribute: 'ng-swipe-right', directive: 'ngSwipeRight', expression: '$__ngcUiSwitchToggle($event, !0)'},
            off: {attribute: 'ng-swipe-left', directive: 'ngSwipeLeft', expression: '$__ngcUiSwitchToggle($event, !1)'}
        };

        /**
         * TODO explain what, when and why
         *
         * @param originalElement
         * @param attributes
         * @returns {string}
         */
        function templateFactory(originalElement, attributes) {

            var directivesToAdd = [],
                action;

            for (action in switchActions) {
                if (switchActions.hasOwnProperty(action)) {
                    action = switchActions[action];

                    // Do we need to force the directive?
                    if (!(action.directive in attributes)) {
                        directivesToAdd.push(action.attribute);
                    }
                }
            }

            directivesToAdd = directivesToAdd.join(' ');

            return '<span class="' + CLASS_BASE + '" ' + directivesToAdd + '></span>';
        }

        function switchUiCompiler(templateElement, templateAttributes, transcludeFunction) {

            var actionName,
                action,
                userActions = {};

            for (actionName in switchActions) {
                if (switchActions.hasOwnProperty(actionName)) {
                    action = switchActions[actionName];
                    userActions[actionName] = $parse(templateAttributes[action.directive]);
                    templateAttributes.$set(action.directive, action.expression);
                }
            }

            return angular.bind(null, switchUiLinker, userActions);
        }

        function switchUiLinker(userActions, scope, element, attributes, controllers) {

            var switchController = controllers[0],
                modelController = controllers[1],
                //parsedSwitchOn = $parse(attributes['switchOn']);
                parsedDisabled = $parse(attributes['switchDisabled']);


            if (modelController) {
                modelController.$render = function() {
                    switchController._updateFromModel(modelController.$viewValue);
                };
            }

            scope.$watch(
                function() {
                    return switchController.isOn()
                },
                function(on) {
                    if (on) {
                        element.addClass(CLASS_ON);
                        element.removeClass(CLASS_OFF);
                    }
                    else {
                        element.addClass(CLASS_OFF);
                        element.removeClass(CLASS_ON);
                    }
                },
                true
            );

            scope.$watch(
                function() {
                    return switchController.isDisabled();
                },
                function(disabled) {
                    if (disabled) {
                        element.addClass(CLASS_DISABLED);
                    }
                    else {
                        element.removeClass(CLASS_DISABLED);
                    }
                },
                true
            );

            scope.$watch(
                parsedDisabled,
                function(disabled) {
                    if (disabled) {
                        switchController.disable();
                    }
                    else {
                        switchController.enable();
                    }
                },
                true
            );

            /*scope.$watch(
                parsedSwitchOn,
                function(on) {
                    switchController.toggle(on);
                },
                true
            );*/

            // We need to store some info on the element itself to be retrieved by the event handlers
            element[0].$ngcUiSwitch = {
                controller : switchController,
                userActions : userActions
            };

            scope.$__ngcUiSwitchToggle = switchToggle;

            switchController.init(modelController);

            // TODO remove after tests
            window.switchController = switchController;
        }

        function switchToggle(event, on) {

            var userActions = event.srcElement.$ngcUiSwitch.userActions,
                controller = event.srcElement.$ngcUiSwitch.controller,
                action = 'toggle';

            if (on === true) {
                action = 'on'
            }
            else if (on === false) {
                action = 'off'
            }

            event.preventDefault();
            controller.toggle(on);
            userActions[action](this, {$event: event});
        }

        function switchUiController($scope, $element, $attrs, $transclude) {

            var _modelController,
                _disabled = false,
                _on = false;

            this.init = function(modelController) {
                _modelController = modelController;
            };

            this.enable = function() {
                _disabled = false;
            };

            this.disable = function() {
                _disabled = true;
            };

            this.isDisabled = function() {
                return _disabled;
            };

            this.isOn = function() {
                return _on;
            };

            this._updateFromModel = function(modelValue) {
                _on = !!modelValue
            };

            this.toggle = function(on) {

                console.log(now() + 'controller.toggle');

                if (this.isDisabled()) {
                    return;
                }

                // Normalize
                _on = on === undefined ? !_on : !!on;

                if (_modelController) {
                    _modelController.$setViewValue(_on);
                }
            };
        }

        return {
            restrict: 'EACM',
            replace: true,

            // This is a component, so why don't I create an isolate scope? Well, i'm porting most of the original
            // element's attribute to the inner checkbox, and I want any expressions the user put in them to be
            // parsable here. I don't run the risk of overriding anything because all I set on this scope
            // is a property whose name is randomly created.
            //scope: true,

            // We need to include ng-click, ng-swipe-left and ng-right-left in the template to make angular watch for them.
            // If we don't include them those, and even if we include them during compilation, they won't work. Odd..
            // If the element that calls the directive (the one that will be replaced by this) does make use of these event
            // directives, though, this would work. Odd #2. We include them here empty because otherwise angular would concatenate
            // them with the user expressions, if they exists, and our handlers would not be called. Odd #3.
            template: templateFactory,

            controller : ['$scope', '$element', '$attrs', '$transclude', switchUiController],

            require : ['ngcUiSwitch', '?ngModel'],

            compile: switchUiCompiler
        };
    }
    //---------------------------------------------------------------------------------------------
    //endregion

})(angular);
