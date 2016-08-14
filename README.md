ngc-ui-switch
=============

A switch component for AngularJS.


## Directive Usage ##

All you need is the `ngc-ui-switch` directive:
```
<span ngc-ui-switch></span>
```

That alone is not very usefull, though, so it integrates well with the well known `ng-model` for bi-direction bindings. In the following example, the switch will be bound to a scope property named `masterSwitch`, and one will reflect the other. If `masterSwitch` is `true`, the switch will be on. If you turn the switch off, `masterSwitch` will be set to false.
```
<span ngc-ui-switch ng-model="masterSwitch"></span>
```

You can also disable a switch through the `switch-disabled` attribute. If it's expression evaluates to `true`, the switch will be disabled.
```
<span ngc-ui-switch ng-model="slaveSwitch" switch-disabled="masterSwitch"></span>
```

You can also turn on/off a switch depending on the state of another with `switch-on`, master-slave style. Whenever the master's model change, so will the slave one, but you can stil toggle the slave one independently.
```
<span ngc-ui-switch ng-model="slaveSwitch" switch-on="masterSwitch"></span>
```


## Interacting with the Switch ##

The switch can be toggled by clicking on it, tapping on it or swiping either left or right. Internally, the switch makes use of angular's mobile module (`ngMobile`) to handle swiping.

If `ngMobile` is used by your application, tapping speed will be improved because `ngMobile` enhances click handling responsiveness for touch-based devices.

`ngMobile` is not a requirement, though. If it's not used by your application, the switch will fall back to the default click/tap behaviour.


## Styling the Switch ##

The switch is styled through stylesheets, whose classes are cascaded as follows:

```
.ngc-ui-switch-base
    .ngc-ui-switch-on
        .ngc-ui-switch-disabled
    .ngc-ui-switch-off
        .ngc-ui-switch-disabled
```


## Directive Controller ##

The `ngc-ui-switch` directive exposes its controller to any other directive present on the same element that requires it through the Directive Definition Object's `require` property. Just require the `ngcUiSwitch` controller like you would require any other:
```
yourModule.directive('yourDirective', function() {
    
    return {
        require : ['?ngcUiSwitch'],

        link : function(scope, element, attributes, controllers) {
            
            var switchController = controllers[0];
            
            if (switchController) {
                // interact with the switch
            }
        }
    }    
});
```


### Controller API ###

The switch controller exposes the following public interface:

* `{boolean} isOn()`

Queries the switch `on|off` state. `true` if it's toggled on, `false` otherwise.

* `{boolean} isDisabled()`

Queries the switch `disabled` state. `true` if it's disabled, `false` otherwise.

* `void toggle({boolean} [on])`

Toggles the switch `on|off` state. The switch can only be toggled if it's not disabled. If no argument is provided (or if `on` is `undefined`), the switch will invert its current state. If the argument `on` is boolean `true`, the switch will be toggled on. If it's anything else, the switch will be toggled off.

* `void disable()`

Disables the switch. The switch will mantain it's current `on|off` state and toggling it will not be allowed.

* `void enable()`

Enables the switch. The switch will mantain it's current `on|off` state and toggling it will be allowed again.


## Other Important Details ##

### Replace ###
`ngc-ui-switch` is a replace directive, meaning that it will replace the element it's used on for it's own template. 

### No Transcluion ###
`ngc-ui-switch`'s element was not made to contain anything other then itself, so no transclusion of original content is performed.

### No scope ###
`ngc-ui-switch` does not create it's own scope. It will work on the current scope. The decision to not isolate it's scope (or even inherit the current scope) was made to allow for other directives to work properly on the scopes they're intended to. If we were to create a new scope, directives such as ng-model would not trigger updates on the correct scope, for instance.

