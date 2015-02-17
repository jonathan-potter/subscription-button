;(function () {
    var emailSubscriptionButton, EmailSubscriptionButton

    EmailSubscriptionButton = function (state) { this.initialize(state) };

    EmailSubscriptionButton.prototype = {
        initialize: function (state) {
            this.state = state || "unsubscribed";

            this.formClass = ".subscribe-form";
            this.form = $(this.formClass);
            this.elements = {
                 form: this.form,
                glyph: this.form.find("aside"),
                input: this.form.find("input"),
               button: this.form.find("div")
            }
            this.events = [
                "click",
                "change",
                "focusout",
                "keydown",
                "keyup"
            ];
            this.states = {
                "unsubscribed": {
                    click: {
                        target: this.elements.form,
                        state: "subscribing-no-text"
                    }
                },
                "subscribing-no-text": {
                    regexPassed: {
                        target: this.elements.input,
                        state: "subscribing-valid-email"
                    },
                    textAdded: {
                        target: this.elements.input,
                        state: "subscribing-text-entered"
                    },
                    lossOfFocus: {
                        target: this.elements.input,
                        state: "unsubscribed"
                    },
                    click: {
                        target: this.elements.button,
                        state: "subscribing-input-error"
                    }
                },
                "subscribing-input-error": {
                    regexPassed: {
                        target: this.elements.input,
                        state: "subscribing-valid-email"
                    },
                    textAdded: {
                        target: this.elements.input,
                        state: "subscribing-text-entered"
                    },
                    lossOfFocus: {
                        target: this.elements.input,
                        state: "unsubscribed"
                    },
                    click: {
                        target: this.elements.button,
                        state: "subscribing-input-error"
                    }
                },
                "subscribing-text-entered": {
                    regexPassed: {
                        target: this.elements.input,
                        state: "subscribing-valid-email"
                    },
                    allTextRemoved: {
                        target: this.elements.input,
                        state: "subscribing-no-text"
                    },
                    click: {
                        target: this.elements.button,
                        state: "subscribing-input-error"
                    },
                    lossOfFocus: {
                        target: this.elements.input,
                        state: "unsubscribed"
                    }
                },
                "subscribing-valid-email": {
                    click: {
                        target: this.elements.button,
                        state: "subscription-submitted"
                    },
                    regexFailed: {
                        target: this.elements.input,
                        state: "subscribing-text-entered"
                    },
                    lossOfFocus: {
                        target: this.elements.input,
                        state: "unsubscribed"
                    }
                },
                "subscription-submitted": {
                    click: {
                        target: this.elements.form,
                        state: "unsubscribed"
                    }
                }
            }

            this.updateUI();
        },
        setState: function (state) {
            this.state = state;

            this.updateUI();
        },
        bindHandlers: function () {
            var self, stateInformation;

            self = this;
            events = this.stateInformation();

           if (events) {
               events.click          && events.click.target.click(this.respondToClick.bind(this));
               events.textAdded      && events.textAdded.target.keyup(this.respondToKeyUp.bind(this));
               events.lossOfFocus    && events.lossOfFocus.target.focusout(this.respondToLossOfFocus.bind(this));
               events.regexPassed    && events.regexPassed.target.keyup(this.respondToRegexPassed.bind(this));
               events.regexFailed    && events.regexFailed.target.keyup(this.respondToRegexFailed.bind(this));
               events.regexPassed    && events.regexPassed.target.keydown(this.respondToRegexPassed.bind(this));
               events.regexFailed    && events.regexFailed.target.keydown(this.respondToRegexFailed.bind(this));
               events.allTextRemoved && events.allTextRemoved.target.keydown(this.allTextRemoved.bind(this));
           }
        },
        initializeDomState: function () {
            for (state in this.states) {
                this.form.removeClass(state);
            }

            for (element in this.elements) {
                for (eventIndex in this.events) {
                    this.elements[element].off(this.events[eventIndex]);
                }
            }
        },
        stateInformation: function () {
            return this.states[this.state];
        },
        updateUI: function () {
            this.initializeDomState();
            this.form.addClass(this.state);
            this.bindHandlers();
        },

        /** EVENT HANDLERS **/
        respondToClick: function (event) {
            event.stopPropagation();

            this.setState(events.click.state);
            this.elements.input.focus();
        },
        respondToKeyUp: function (event) {
            var text;

            event.stopPropagation();

            text = events.textAdded.target.val();

            if (text.length > 0) {
                this.setState(events.textAdded.state);
            }
        },
        respondToLossOfFocus: function (event) {
            event.stopPropagation();

            var element, elementIndex, targetInElements;

            targetInElements = false;
            for (elementIndex in this.elements) {
                element = this.elements[elementIndex];
                if (element[0] === event.relatedTarget) {
                    targetInElements = true;
                }
            }

            if (!targetInElements) {
                this.setState(events.lossOfFocus.state);
            }
        },
        respondToRegexPassed: function (event) {
            event.stopPropagation();

            var emailMatch, emailRegexp, text;

            emailRegexp = /[a-z]+@[a-z]+\.[a-z]+/;
            text = events.regexPassed.target.val();

            emailMatch = text.toLowerCase().match(emailRegexp);

            if (emailMatch) {
                this.setState(events.regexPassed.state);
            }
        },
        respondToRegexFailed: function (event) {
            event.stopPropagation();

            var emailMatch, emailRegexp, text;

            emailRegexp = /[a-z]+@[a-z]+\.[a-z]+/;
            text = events.regexFailed.target.val();

            emailMatch = text.toLowerCase().match(emailRegexp);

            if (!emailMatch) {
                this.setState(events.regexFailed.state);
            }
        },
        allTextRemoved: function (event) {
            event.stopPropagation();

            var text;

            text = events.regexPassed.target.val();

            if (text.length === 0) {
                this.setState(events.allTextRemoved.state);
            }
        }
    };

    emailSubscriptionButton = new EmailSubscriptionButton();

})();
