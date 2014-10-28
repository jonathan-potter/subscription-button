;(function () {
    var emailSubscriptionButton, EmailSubscriptionButton

    EmailSubscriptionButton = function (state) { this.initialize(state) };

    EmailSubscriptionButton.prototype = {
        initialize: function (state) {
            this.state = state || "unsubscribed";

            this.form = $(".subscribe-form");
            this.elements = {
                 form: this.form,
                glyph: this.form.find("aside"),
                input: this.form.find("input"),
               button: this.form.find("div")
            }
            this.states = {
                "unsubscribed": {
                        nextState: "subscribing",
                    bindingTarget: this.elements.form
                },
                "subscribing": {
                        nextState: "subscribed",
                    bindingTarget: this.elements.button
                }
            }

            this.updateUI();
        },
        advanceState: function () {
            this.state = this.stateInformation().nextState;

            this.updateUI();
        },
        bindHandlers: function () {
            var self, stateInformation;

            self = this;
            stateInformation = this.stateInformation();

            if (stateInformation && stateInformation.bindingTarget) {
                stateInformation.bindingTarget.click(function () {
                    self.advanceState.call(self);
                });
            }
        },
        initializeDomState: function () {
            for (state in this.states) {
                this.form.removeClass(state);
            }

            for (element in this.elements) {
                this.elements[element].off("click");
            }
        },
        stateInformation: function () {
            return this.states[this.state];
        },
        updateUI: function () {
            this.initializeDomState();
            this.form.addClass(this.state);
            this.bindHandlers();
        }
    };

    emailSubscriptionButton = new EmailSubscriptionButton();

})();