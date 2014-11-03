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
               events.click && events.click.target.click(function (event) {
                   event.stopPropagation();

                   self.setState(events.click.state);
                   self.elements.input.focus();
               });
               events.textAdded && events.textAdded.target.keyup(function (event) {
                   event.stopPropagation();

                   var text;

                   text = events.textAdded.target.val();

                   if (text.length > 0) {
                       self.setState(events.textAdded.state);
                   }
               });
               events.lossOfFocus && events.lossOfFocus.target.focusout(function (event) {
                   event.stopPropagation();

                   var element, targetInElements;

                   targetInElements = false;
                   for (elementIndex in self.elements) {
                       element = self.elements[elementIndex];
                       if (element[0] === event.relatedTarget) {
                           targetInElements = true;
                       }
                   }

                   if (!targetInElements) {
                       self.setState(events.lossOfFocus.state);
                   }
               });
               events.regexPassed && events.regexPassed.target.keyup(function (event) {
                   event.stopPropagation();

                   var emailMatch, emailRegexp, text;

                   emailRegexp = /[a-z]+@[a-z]+\.[a-z]+/;
                   text = events.regexPassed.target.val();

                   emailMatch = text.match(emailRegexp);

                   if (emailMatch) {
                       self.setState(events.regexPassed.state);
                   }
               });
               events.regexFailed && events.regexFailed.target.keyup(function (event) {
                   event.stopPropagation();

                   var emailMatch, emailRegexp, text;

                   emailRegexp = /[a-z]+@[a-z]+\.[a-z]+/;
                   text = events.regexFailed.target.val();

                   emailMatch = text.match(emailRegexp);

                   if (!emailMatch) {
                       self.setState(events.regexFailed.state);
                   }
               });
               events.allTextRemoved && events.allTextRemoved.target.keydown(function (event) {
                   event.stopPropagation();

                   var text;

                   text = events.regexPassed.target.val();

                   if (text.length === 0) {
                       self.setState(events.allTextRemoved.state);
                   }
               });
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
        }
    };

    emailSubscriptionButton = new EmailSubscriptionButton();

})();