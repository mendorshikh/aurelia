(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/kernel", "./ast"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const kernel_1 = require("@aurelia/kernel");
    const ast_1 = require("./ast");
    const slice = Array.prototype.slice;
    class Ref {
        constructor(sourceExpression, target, locator) {
            this.$state = 0 /* none */;
            this.$scope = void 0;
            this.locator = locator;
            this.sourceExpression = sourceExpression;
            this.target = target;
        }
        $bind(flags, scope, part) {
            if (kernel_1.Tracer.enabled) {
                kernel_1.Tracer.enter('Ref', '$bind', slice.call(arguments));
            }
            if (this.$state & 4 /* isBound */) {
                if (this.$scope === scope) {
                    if (kernel_1.Tracer.enabled) {
                        kernel_1.Tracer.leave();
                    }
                    return;
                }
                this.$unbind(flags | 4096 /* fromBind */);
            }
            // add isBinding flag
            this.$state |= 1 /* isBinding */;
            this.$scope = scope;
            this.part = part;
            if (ast_1.hasBind(this.sourceExpression)) {
                this.sourceExpression.bind(flags, scope, this);
            }
            this.sourceExpression.assign(flags, this.$scope, this.locator, this.target, part);
            // add isBound flag and remove isBinding flag
            this.$state |= 4 /* isBound */;
            this.$state &= ~1 /* isBinding */;
            if (kernel_1.Tracer.enabled) {
                kernel_1.Tracer.leave();
            }
        }
        $unbind(flags) {
            if (kernel_1.Tracer.enabled) {
                kernel_1.Tracer.enter('Ref', '$unbind', slice.call(arguments));
            }
            if (!(this.$state & 4 /* isBound */)) {
                if (kernel_1.Tracer.enabled) {
                    kernel_1.Tracer.leave();
                }
                return;
            }
            // add isUnbinding flag
            this.$state |= 2 /* isUnbinding */;
            if (this.sourceExpression.evaluate(flags, this.$scope, this.locator, this.part) === this.target) {
                this.sourceExpression.assign(flags, this.$scope, this.locator, null, this.part);
            }
            const sourceExpression = this.sourceExpression;
            if (ast_1.hasUnbind(sourceExpression)) {
                sourceExpression.unbind(flags, this.$scope, this);
            }
            this.$scope = void 0;
            // remove isBound and isUnbinding flags
            this.$state &= ~(4 /* isBound */ | 2 /* isUnbinding */);
            if (kernel_1.Tracer.enabled) {
                kernel_1.Tracer.leave();
            }
        }
        observeProperty(flags, obj, propertyName) {
            return;
        }
        handleChange(newValue, previousValue, flags) {
            return;
        }
    }
    exports.Ref = Ref;
});
//# sourceMappingURL=ref.js.map